import { Injectable } from '@angular/core';

import Keycloak from 'keycloak-js';

import { environment } from '../environments/environment.ts';

@Injectable({
  providedIn: 'root'
})
export class KeycloakService {
  private readonly keycloak: Keycloak = new Keycloak({
    url: environment.authUrl,
    realm: environment.authRealm,
    clientId: environment.authClientId,
  });
  private userInfo: object = {};

  //constructor(){}

  public async init(): Promise<void> {
    const authenticated = await this.keycloak.init({
      onLoad: 'check-sso',
    });
    if(authenticated){
      this.userInfo = await this.keycloak.loadUserInfo();
    }
    //, await this.keycloak.loadUserProfile())
  }
  public isAuthenticated(): boolean {
    return this.keycloak.authenticated || false;
  }
  public login(): void {
    this.keycloak.login();
  }
  public logout(): void {
    this.keycloak.logout();
  }
  public hasResourceRole(role: string, resource: string): boolean{
    return this.keycloak.hasResourceRole(role, resource);
  }
  public getUserInfo(): object {
    return this.userInfo;
  }
}
