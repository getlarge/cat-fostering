// src/app/state/fostering.state.ts
import { Injectable } from '@angular/core';
import { Fostering, FosteringService } from '@cat-fostering/ng-data-acess';
import { RxState } from '@rx-angular/state';

interface FosteringState {
  requests: Fostering[];
}

@Injectable({
  providedIn: 'root',
})
export class FosteringStateService extends RxState<FosteringState> {
  constructor(private fosteringService: FosteringService) {
    super();
    this.set({
      requests: [],
    });

    this.connect('requests', this.fosteringService.fosteringControllerFind());
  }
}
