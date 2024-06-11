import { Component } from '@angular/core';
import { FosteringStateService } from '@cat-fostering/ng-fostering-state';

@Component({
  standalone: true,
  selector: 'lib-fostering-request',
  templateUrl: './fostering-request.component.html',
  styleUrls: ['./fostering-request.component.css'],
})
export class FosteringRequestComponent {
  requests$ = this.fosteringState.select('requests');

  constructor(private fosteringState: FosteringStateService) {}
}
