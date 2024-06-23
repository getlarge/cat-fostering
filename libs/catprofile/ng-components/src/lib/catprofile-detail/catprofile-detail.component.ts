import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CatProfileStateService } from '@cat-fostering/ng-catprofile-state';
import { RxIf } from '@rx-angular/template/if';

import { CatProfileFormComponent } from '../catprofile-form/catprofile-form.component';

@Component({
  standalone: true,
  imports: [CatProfileFormComponent, RxIf],
  selector: 'lib-catprofile-detail',
  templateUrl: './catprofile-detail.component.html',
  styleUrls: ['./catprofile-detail.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatProfileDetailComponent {
  private state = inject(CatProfileStateService);
  private route = inject(ActivatedRoute);

  constructor() {
    const catProfileId = this.route.snapshot.params['id'];
    this.fetchCatProfile(catProfileId);

    this.route.params.subscribe((params) => {
      this.fetchCatProfile(params['id']);
    });
  }

  fetchCatProfile(id: string): void {
    if (id === 'new') {
      this.state.unselectCatProfile();
    } else {
      this.state.findCatProfile(id);
    }
  }
}
