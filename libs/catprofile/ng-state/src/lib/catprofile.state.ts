import { inject, Injectable } from '@angular/core';
import { CatProfile, CatProfilesService } from '@cat-fostering/ng-data-acess';
import {
  optimizedFetch,
  WithContext,
  withLoadingEmission,
} from '@cat-fostering/ng-state';
import { patch, toDictionary } from '@rx-angular/cdk/transformations';
import { RxState } from '@rx-angular/state';
import { rxActions } from '@rx-angular/state/actions';
import { map } from 'rxjs';

export interface CatProfileState {
  cats: WithContext<Record<string, CatProfile>>;
  selectedCat: WithContext<CatProfile | null>;
}

interface Actions {
  findCatProfile: string;
  findCatProfiles: void;
}

@Injectable({
  providedIn: 'root',
})
export class CatProfileStateService extends RxState<CatProfileState> {
  private readonly catProfilesService = inject(CatProfilesService);
  private readonly actions = rxActions<Actions>();

  constructor() {
    super();
    this.set({
      cats: { value: {} },
      selectedCat: { value: null },
    });

    this.connect(
      'cats',
      this.actions.findCatProfile$.pipe(() =>
        this.catProfilesService.catProfilesControllerFind().pipe(
          map((result) => ({ value: toDictionary(result, 'id') })),
          withLoadingEmission()
        )
      ),
      (oldState, newPartial) => {
        const resultState = patch(oldState?.cats || {}, newPartial);
        resultState.value = patch(
          oldState?.cats?.value || {},
          resultState?.value || {}
        );
        return resultState;
      }
    );

    this.connect(
      'selectedCat',
      this.actions.findCatProfile$.pipe(
        map((id) => ({ id })),
        optimizedFetch(
          ({ id }) => id,
          ({ id }) =>
            this.catProfilesService.catProfilesControllerFindById(id).pipe(
              map((catProfile) => ({
                value: catProfile,
              })),
              withLoadingEmission()
            )
        )
      ),
      (oldState, catProfile) => {
        const val = toDictionary([catProfile.value], 'id');
        const resultState = patch(oldState?.cats || {}, val);
        resultState.value = patch(
          oldState?.cats?.value || {},
          resultState?.value || {}
        );
        return catProfile;
      }
    );
  }

  findCatProfile = this.actions.findCatProfile;
  findCatProfiles = this.actions.findCatProfiles;

  catByIdCtx = (id: string) =>
    this.select(
      map(({ cats: { value, loading } }) => ({
        loading,
        value: value[id],
      }))
    );

  selectCat(cat: CatProfile) {
    this.set({ selectedCat: { value: cat } });
  }

  initialize(): void {
    this.findCatProfiles();
  }
}
