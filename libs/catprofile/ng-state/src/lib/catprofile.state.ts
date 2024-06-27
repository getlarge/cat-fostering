import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  CatProfile,
  CatProfilesService,
  CreateCatProfile,
  UpdateCatProfile,
} from '@cat-fostering/ng-data-acess';
import {
  optimizedFetch,
  WithContext,
  withLoadingEmission,
} from '@cat-fostering/ng-state';
import {
  deleteProp,
  patch,
  toDictionary,
} from '@rx-angular/cdk/transformations';
import { RxState } from '@rx-angular/state';
import { rxActions } from '@rx-angular/state/actions';
import { concatMap, map, merge, tap } from 'rxjs';

export interface CatProfileState {
  catProfiles: WithContext<Record<string, CatProfile>>;
  selectedCatProfile: WithContext<CatProfile | null>;
}

interface Actions {
  findCatProfile: string;
  findCatProfiles: void;
  createCatProfile: CreateCatProfile;
  updateCatProfile: [string, UpdateCatProfile];
  deleteCatProfile: { id: string };
}

@Injectable({
  providedIn: 'root',
})
export class CatProfileStateService extends RxState<CatProfileState> {
  private readonly router = inject(Router);
  private readonly catProfilesService = inject(CatProfilesService);
  private readonly actions = rxActions<Actions>();

  constructor() {
    super();
    this.set({
      catProfiles: { value: {} },
      selectedCatProfile: { value: null },
    });

    this.connect(
      'catProfiles',
      this.actions.findCatProfiles$.pipe(() =>
        this.catProfilesService.catProfilesControllerFind().pipe(
          map((result) => ({ value: toDictionary(result, 'id') })),
          withLoadingEmission()
        )
      ),
      (oldState, newPartial) => {
        const resultState = patch(oldState?.catProfiles || {}, newPartial);
        resultState.value = patch(
          oldState?.catProfiles?.value || {},
          resultState?.value || {}
        );
        return resultState;
      }
    );

    this.connect(
      'catProfiles',
      this.actions.updateCatProfile$,
      (state, [id, catProfile]) => {
        if (state && id) {
          return patch(state.catProfiles, {
            [id]: patch(state.catProfiles.value?.[id], catProfile),
          });
        }
        return state.catProfiles;
      }
    );

    this.connect(
      'catProfiles',
      this.actions.deleteCatProfile$,
      (state, catProfile) => {
        if (state && catProfile?.id) {
          return { value: deleteProp(state.catProfiles.value, catProfile.id) };
        }
        return state.catProfiles;
      }
    );

    this.connect(
      'selectedCatProfile',
      this.actions.findCatProfile$.pipe(
        optimizedFetch(
          (id) => id,
          (id) =>
            this.catProfilesService.catProfilesControllerFindById(id).pipe(
              map((catProfile) => ({
                value: catProfile,
              })),
              withLoadingEmission()
            )
        )
      ),
      (state, catProfile) => {
        return patch(state?.selectedCatProfile || {}, catProfile);
      }
    );

    this.hold(this.sideEffects$);
  }

  readonly findCatProfile = this.actions.findCatProfile;
  readonly findCatProfiles = this.actions.findCatProfiles;
  readonly createCatProfile = this.actions.createCatProfile;
  readonly updateCatProfile = this.actions.updateCatProfile;
  readonly deleteCatProfile = this.actions.deleteCatProfile;

  private readonly sideEffects$ = merge(
    this.actions.updateCatProfile$.pipe(
      concatMap(([id, catProfile]) =>
        this.catProfilesService.catProfilesControllerUpdateById(id, catProfile)
      )
    ),
    this.actions.createCatProfile$.pipe(
      concatMap((params) =>
        this.catProfilesService.catProfilesControllerCreate(params)
      ),
      tap((params) => params?.id && this.router.navigate(['cat-profiles']))
    ),
    this.actions.deleteCatProfile$.pipe(
      tap((params) => params.id && this.router.navigate(['cat-profiles'])),
      concatMap((params) =>
        this.catProfilesService.catProfilesControllerDeleteById(params.id)
      )
    )
  );

  catByIdCtx$ = (id: string) =>
    this.select(
      map(({ catProfiles: { value, loading } }) => ({
        loading,
        value: value[id],
      }))
    );

  getCatById(id: string) {
    const catProfiles = this.get('catProfiles')?.value;
    console.log(catProfiles);
    return catProfiles[id];
  }

  selectCatProfile(cat: CatProfile) {
    this.set({
      selectedCatProfile: {
        value: cat,
        loading: false,
        error: undefined,
      },
    });
  }

  unselectCatProfile() {
    this.set({
      selectedCatProfile: { value: null, loading: false, error: undefined },
    });
  }

  initialize(): void {
    this.findCatProfiles();
  }
}
