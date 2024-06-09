import { Injectable } from '@angular/core';
import { CatProfile, CatProfilesService } from '@cat-fostering/ng-data-acess';
import { RxState } from '@rx-angular/state';

interface CatProfileState {
  cats: CatProfile[];
  selectedCat: CatProfile | null;
}

@Injectable({
  providedIn: 'root',
})
export class CatProfileStateService extends RxState<CatProfileState> {
  constructor(private catProfilesService: CatProfilesService) {
    super();
    this.set({
      cats: [],
      selectedCat: null,
    });

    this.connect('cats', this.catProfilesService.catProfilesControllerFind());
  }

  selectCat(cat: CatProfile) {
    this.set({ selectedCat: cat });
  }
}
