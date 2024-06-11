import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserStateService } from '@cat-fostering/ng-user-state';

export function authenticationGuard(): CanActivateFn {
  return () => {
    const userStateService: UserStateService = inject(UserStateService);
    const router = inject(Router);
    const isAuthenticated = userStateService.get('isAuthenticated');
    if (isAuthenticated) {
      return true;
    }
    router.navigate(['/login']);
    return false;
  };
}
