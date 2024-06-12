// src/app/state/user.state.ts
import { DOCUMENT } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User, UsersService } from '@cat-fostering/ng-data-acess';
import { environment } from '@cat-fostering/ng-env';
import { WithContext, withLoadingEmission } from '@cat-fostering/ng-state';
import { patch } from '@rx-angular/cdk/transformations';
import { RxState } from '@rx-angular/state';
import { rxActions } from '@rx-angular/state/actions';
import { catchError, filter, lastValueFrom, map, of, tap } from 'rxjs';

export interface UserState {
  user: WithContext<User | null>;
  isAuthenticated: boolean;
}

interface Actions {
  loadCurrentUser: void;
}

@Injectable({
  providedIn: 'root',
})
export class UserStateService extends RxState<UserState> {
  private readonly document = inject(DOCUMENT);
  private readonly usersService = inject(UsersService);
  private readonly httpClient = inject(HttpClient);
  private readonly actions = rxActions<Actions>();

  readonly loadCurrentUser = this.actions.loadCurrentUser;
  readonly loadCurrentUser$ = this.actions.loadCurrentUser$;
  readonly isAuthenticated$ = this.select('user').pipe(
    filter((user) => !!user && !user.loading && (!!user.value || !!user.error)),
    map((user) => !!user.value)
  );

  constructor() {
    super();
    this.initialize();

    this.connect(
      'user',
      this.actions.loadCurrentUser$.pipe(() =>
        this.usersService.usersControllerGetCurrentUser().pipe(
          map((result) => ({ value: result, error: null })),
          catchError((e) => {
            const errorMessage =
              e instanceof HttpErrorResponse ? e.error.message : e.message;
            return of({ value: null, error: errorMessage });
          }),
          withLoadingEmission()
        )
      ),
      (oldState, newPartial) => {
        const resultState = patch(oldState?.user || {}, newPartial);
        if (newPartial.error) {
          resultState.value = null;
          oldState.isAuthenticated = false;
        } else if (resultState.value) {
          resultState.value = patch(
            oldState?.user?.value || {},
            resultState?.value || {}
          ) as User;
          oldState.isAuthenticated = true;
        }
        return resultState;
      }
    );
  }

  initialize(): void {
    this.set({
      user: { value: null },
      isAuthenticated: undefined,
    });
    this.loadCurrentUser();
  }

  getUserCtx = () =>
    this.select(
      map(({ user: { value, loading } }) => ({
        loading,
        value,
      }))
    );

  login() {
    this.document.location.href = `${environment.kratosUrl}/self-service/login/browser`;
  }

  logout() {
    return lastValueFrom(
      this.httpClient
        .get<{
          logout_url: string;
          logout_token: string;
        }>(`${environment.kratosUrl}/self-service/logout/browser`, {
          withCredentials: true,
          headers: {
            'content-type': 'application/json',
            accept: 'application/json',
          },
        })
        .pipe(
          tap(() => {
            this.set({
              user: { value: null },
              isAuthenticated: false,
            });
          }),
          map((res) => {
            this.document.location.href = res.logout_url;
            return res;
          })
        )
    );
  }
}
