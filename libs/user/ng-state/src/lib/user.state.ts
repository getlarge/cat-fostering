// src/app/state/user.state.ts
import { inject, Injectable } from '@angular/core';
import { User, UsersService } from '@cat-fostering/ng-data-acess';
import { WithContext, withLoadingEmission } from '@cat-fostering/ng-state';
import { patch } from '@rx-angular/cdk/transformations';
import { RxState } from '@rx-angular/state';
import { rxActions } from '@rx-angular/state/actions';
import { map } from 'rxjs';

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
  private readonly usersService = inject(UsersService);
  private readonly actions = rxActions<Actions>();

  constructor() {
    super();
    this.set({
      user: { value: null },
      isAuthenticated: false,
    });

    this.connect(
      'user',
      this.actions.loadCurrentUser$.pipe(() =>
        this.usersService.usersControllerGetCurrentUser().pipe(
          map((result) => ({ value: result })),
          withLoadingEmission()
        )
      ),
      (oldState, newPartial) => {
        const resultState = patch(oldState?.user || {}, newPartial);
        resultState.value = patch(
          oldState?.user?.value || ({} as User),
          resultState?.value as User
        );
        oldState.isAuthenticated = true;
        return resultState;
      }
    );

    this.initialize();
  }

  initialize(): void {
    this.loadCurrentUser();
  }

  loadCurrentUser = this.actions.loadCurrentUser;

  getUserCtx = () =>
    this.select(
      map(({ user: { value, loading } }) => ({
        loading,
        value,
      }))
    );

  logout() {
    this.set({
      user: { value: null },
      isAuthenticated: false,
    });

    // TODO: remove cookie
  }
}
