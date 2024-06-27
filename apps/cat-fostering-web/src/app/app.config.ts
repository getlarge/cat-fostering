import {
  provideHttpClient,
  withInterceptorsFromDi,
  withXsrfConfiguration,
} from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ActivatedRouteSnapshot, provideRouter } from '@angular/router';
import { environment } from '@cat-fostering/ng-env';

import { provideApi, withBackendApiConfiguration } from './api.provider';
import { appRoutes } from './app.routes';
import { kratosUrlProvider } from './kratos-url.provider';

const XSRF_COOKIE_NAME = 'XSRF-TOKEN';
const XSRF_HEADER_NAME = 'X-XSRF-TOKEN';

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: kratosUrlProvider,
      useValue: (route: ActivatedRouteSnapshot) => {
        const selfServiceLogin =
          route.paramMap.get('selfServiceLogin') ??
          `${environment.kratosUrl}/self-service/login/browser`;
        window.open(selfServiceLogin, '_self');
      },
    },
    provideRouter(appRoutes),
    provideApi(
      withBackendApiConfiguration({
        basePath: environment.apiUrl,
        withCredentials: true,
        credentials: {
          cookie: () => document.cookie,
        },
      })
    ),
    provideHttpClient(
      withXsrfConfiguration({
        cookieName: XSRF_COOKIE_NAME,
        headerName: XSRF_HEADER_NAME,
      }),
      withInterceptorsFromDi()
    ),
    provideAnimationsAsync('noop'),
  ],
};
