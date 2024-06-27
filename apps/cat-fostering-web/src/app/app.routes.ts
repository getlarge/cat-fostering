import { Route } from '@angular/router';
import { NotFoundPageComponent } from '@cat-fostering/ng-components';

import { authenticationGuard } from './auth.guard';
import { kratosUrlProvider } from './kratos-url.provider';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'cat-profiles',
  },
  {
    path: 'cat-profiles',
    canActivate: [authenticationGuard()],
    loadComponent: () =>
      import('@cat-fostering/ng-catprofile-components').then(
        (m) => m.CatProfileListComponent
      ),
  },
  {
    path: 'cat-profiles/:id',
    canActivate: [authenticationGuard()],
    loadComponent: () =>
      import('@cat-fostering/ng-catprofile-components').then(
        (m) => m.CatProfileDetailComponent
      ),
  },
  {
    path: 'fostering-requests',
    canActivate: [authenticationGuard()],
    loadComponent: () =>
      import('@cat-fostering/ng-fostering-components').then(
        (m) => m.FosteringRequestComponent
      ),
  },
  // {
  //   path: 'fostering-requests/:id',
  //   canActivate: [authenticationGuard()],
  //   loadComponent: () =>
  //     import('@cat-fostering/ng-fostering-components').then(
  //       (m) => m.FosteringRequestComponent
  //     ),
  // },
  {
    path: 'login',
    resolve: {
      url: kratosUrlProvider,
    },
    component: NotFoundPageComponent,
  },
  {
    path: '**',
    component: NotFoundPageComponent,
  },
];
