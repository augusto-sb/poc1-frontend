import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, RouterStateSnapshot } from '@angular/router';

import { KeycloakService } from './keycloak.service';

@Injectable({
  providedIn: 'root'
})
export class App2Guard implements CanActivate {
  constructor(
    public ks: KeycloakService,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): MaybeAsync<GuardResult> {
    if(route.data['requiredRole']){
      return this.ks.hasResourceRole(route.data['requiredRole']);
    }
    return true;
  }
  
}
