import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { KeycloakService } from './keycloak.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private ks: KeycloakService){}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authToken = this.ks.getAuthorizationToken();
    const authReq = req.clone({
      headers: req.headers.append('Authorization', 'bearer '+authToken),
    });
    return next.handle(authReq);
  }
}