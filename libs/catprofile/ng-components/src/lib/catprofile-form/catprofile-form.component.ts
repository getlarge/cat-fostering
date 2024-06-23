import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { CatProfileStateService } from '@cat-fostering/ng-catprofile-state';
import { UserStateService } from '@cat-fostering/ng-user-state';
import {
  CreateCatProfile,
  UpdateCatProfile,
} from '@cat-fostering/ng-data-acess';
import { patch } from '@rx-angular/cdk/transformations';
import { RxState } from '@rx-angular/state';
import { rxActions } from '@rx-angular/state/actions';
import { RxIf } from '@rx-angular/template/if';
import { RxLet } from '@rx-angular/template/let';
import { filter, map, startWith, withLatestFrom } from 'rxjs';

interface Actions {
  submit: void;
  update: { [key: string]: string };
  delete: void;
}

const enum FormMode {
  Read = 'read',
  Create = 'create',
  Edit = 'edit',
}

@Component({
  selector: 'lib-cat-profile-form',
  standalone: true,
  imports: [
    CommonModule,
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardTitle,
    MatInputModule,
    MatButtonModule,
    RxIf,
    RxLet,
  ],
  templateUrl: './catprofile-form.component.html',
  styleUrls: ['./catprofile-form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatProfileFormComponent extends RxState<{
  mode: FormMode;
  request: (UpdateCatProfile | CreateCatProfile) & { id: string };
}> {
  readonly state = inject(CatProfileStateService);
  private readonly usersState = inject(UserStateService);
  readonly ui = rxActions<Actions>();

  readonly isCreateMode$ = this.select(
    map((state) => state.mode === FormMode.Create)
  );
  readonly isEditMode$ = this.select(
    map((state) => state.mode === FormMode.Edit)
  );
  readonly isReadMode$ = this.select(
    map((state) => state.mode === FormMode.Read)
  );
  readonly catProfile$ = this.state.select('selectedCatProfile');
  readonly name$ = this.select('request', 'name');
  readonly description$ = this.select('request', 'description');
  readonly age$ = this.select('request', 'age');
  readonly valid$ = this.select(
    map((state) => {
      if ([FormMode.Create, FormMode.Edit].includes(state.mode)) {
        return !!state?.request?.name?.length;
      }
      return false;
    })
  );
  private readonly submitEvent$ = this.ui.submit$.pipe(
    withLatestFrom(this.select())
  );
  private readonly deleteEvent$ = this.ui.delete$.pipe(
    withLatestFrom(this.select())
  );

  constructor() {
    super();

    console.log('CatProfileFormComponent');
    this.connect('request', this.ui.update$, (state, update) => {
      return patch(state.request, update);
    });

    this.connect(
      this.catProfile$.pipe(
        filter((catProfile) => !!catProfile.value && !catProfile.loading),
        map((catProfile) => ({
          request: {
            id: catProfile.value?.id || '',
            name: catProfile.value?.name || '',
            description: catProfile.value?.description || '',
            age: catProfile.value?.age || 0,
          },
          mode: this.userIsOwner ? FormMode.Edit : FormMode.Read,
        })),
        startWith({
          request: {
            id: '',
            name: '',
            description: '',
            age: 0,
          },
          mode: FormMode.Create,
        })
      )
    );

    this.hold(this.submitEvent$, ([, state]) => {
      if (state.mode === 'edit') {
        this.state.updateCatProfile([state.request.id, state.request]);
      }
      if (state.mode === 'create') {
        this.state.createCatProfile(state.request as CreateCatProfile);
      }
    });

    this.hold(this.deleteEvent$, ([, state]) => {
      this.state.deleteCatProfile({ id: state.request.id });
    });
  }

  get userIsOwner() {
    const user = this.usersState.get('user');
    return (
      !!user.value?.id &&
      user.value.id === this.state.get('selectedCatProfile').value?.owner?.id
    );
  }

  resetForm() {
    this.set({
      mode: FormMode.Create,
      request: {
        id: '',
        name: '',
        description: '',
        age: 0,
      },
    });
  }
}
