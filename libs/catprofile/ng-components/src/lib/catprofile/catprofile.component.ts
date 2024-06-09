import { Component } from '@angular/core';
import { CatProfileStateService } from '@catfostering/ng-catprofile-state';

@Component({
  selector: 'lib-catprofile',
  templateUrl: './catprofile.component.html',
  styleUrls: ['./catprofile.component.css'],
})
export class CatProfileComponent {
  selectedCat$ = this.catState.select('selectedCat');

  constructor(private catState: CatProfileStateService) {}
}
