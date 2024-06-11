import { Route } from '@angular/router';
import { LoginComponent } from '@cat-fostering/ng-user-components';

import { authenticationGuard } from './auth.guard';

export const appRoutes: Route[] = [
  {
    path: '',
    canActivate: [authenticationGuard()],
    loadComponent: () =>
      import('@cat-fostering/ng-catprofile-components').then(
        (m) => m.CatProfileListComponent
      ),
  },
  {
    path: 'cat-profile/:identifier',
    canActivate: [authenticationGuard()],
    loadComponent: () =>
      import('@cat-fostering/ng-catprofile-components').then(
        (m) => m.CatProfileComponent
      ),
  },
  {
    path: 'fostering-requests',
    loadComponent: () =>
      import('@cat-fostering/ng-fostering-components').then(
        (m) => m.FosteringRequestComponent
      ),
    canActivate: [authenticationGuard()],
  },
  { path: 'login', component: LoginComponent },
  // TODO: add catch-all route and page-not-found route
];
