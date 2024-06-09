import { Component } from '@angular/core';
import { FosteringStateService } from '@catfostering/ng-fostering-state';

@Component({
  selector: 'lib-fostering-request',
  templateUrl: './fostering-request.component.html',
  styleUrls: ['./fostering-request.component.css'],
})
export class FosteringRequestComponent {
  requests$ = this.fosteringState.select('requests');

  constructor(private fosteringState: FosteringStateService) {}
}
