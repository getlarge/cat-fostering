import { Component } from '@angular/core';
import { CatProfileStateService } from '@cat-fostering/ng-catprofile-state';

@Component({
  standalone: true,
  selector: 'lib-catprofile',
  templateUrl: './catprofile.component.html',
  styleUrls: ['./catprofile.component.css'],
})
export class CatProfileComponent {
  selectedCat$ = this.catState.select('selectedCat');

  constructor(private catState: CatProfileStateService) {}
}
