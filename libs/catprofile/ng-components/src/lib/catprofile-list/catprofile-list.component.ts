import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { CatProfileStateService } from '@cat-fostering/ng-catprofile-state';
import { CatProfile } from '@cat-fostering/ng-data-acess';
import { RxFor } from '@rx-angular/template/for';
import { RxIf } from '@rx-angular/template/if';
import { map } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, RxIf, RxFor],
  selector: 'lib-catprofile-list',
  templateUrl: './catprofile-list.component.html',
  styleUrls: ['./catprofile-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatProfileListComponent {
  readonly displayedColumns = ['name', 'age', 'description'];
  private router = inject(Router);
  private state = inject(CatProfileStateService);
  readonly catProfiles$ = this.state
    .select('catProfiles')
    .pipe(map((catProfile) => Object.values(catProfile.value)));

  readonly catProfilesListVisible$ = this.state.select(
    map(
      (state) =>
        !!state.catProfiles?.value &&
        Object.keys(state.catProfiles.value).length > 0
    )
  );

  selectCat(cat: CatProfile) {
    void this.router.navigate([`/cat-profiles/${cat?.id}`]);
  }

  trackById(_: number, catProfile: CatProfile) {
    return catProfile.id;
  }
}
