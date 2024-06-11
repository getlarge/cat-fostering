import { Component, OnInit } from '@angular/core';
import { CatProfileStateService } from '@cat-fostering/ng-catprofile-state';
import { CatProfile } from '@cat-fostering/ng-data-acess';

@Component({
  standalone: true,
  selector: 'lib-catprofile-list',
  templateUrl: './catprofile-list.component.html',
  styleUrls: ['./catprofile-list.component.css'],
})
export class CatProfileListComponent implements OnInit {
  cats$ = this.catState.select('cats');

  constructor(private catState: CatProfileStateService) {}

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method, @typescript-eslint/no-empty-function
  ngOnInit(): void {}

  selectCat(cat: CatProfile) {
    this.catState.selectCat(cat);
  }
}
