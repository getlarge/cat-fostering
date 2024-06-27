import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { environment } from '@cat-fostering/ng-env';
import { UserStateService } from '@cat-fostering/ng-user-state';
import { firstValueFrom } from 'rxjs';

export function authenticationGuard(): CanActivateFn {
  return async () => {
    const userStateService = inject(UserStateService);
    const router = inject(Router);
    const isAuthenticated = await firstValueFrom(
      userStateService.isAuthenticated$
    );
    if (isAuthenticated) {
      return true;
    }
    router.navigate([
      '/login',
      {
        selfServiceLogin: `${environment.kratosUrl}/self-service/login/browser`,
      },
    ]);
    return false;
  };
}
