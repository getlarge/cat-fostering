import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  imports: [],
  selector: 'lib-not-found',
  template: ` <div class="not-found-container">
    <h1 class="title">Sorry, page not found</h1>
    <a class="btn" routerLink="/cat-profiles">See cat profiles</a>
  </div>`,
  styleUrls: ['./not-found-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundPageComponent {}
