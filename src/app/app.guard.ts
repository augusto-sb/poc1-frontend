import { CanActivateFn } from '@angular/router';
import { Inject } from '@angular/core';

import { KeycloakService } from './keycloak.service';

export const appGuard: CanActivateFn = (route, state) => {
  if(route.data['requiredRole']){
    return Inject(KeycloakService).hasResourceRole(route.data['requiredRole']);
  }
  return true;
};
