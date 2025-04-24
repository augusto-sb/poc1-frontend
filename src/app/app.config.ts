import { ApplicationConfig, provideZoneChangeDetection, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { KeycloakService } from './keycloak.service';
import { routes } from './app.routes';
import { apiInterceptor } from './api.interceptor';
import { AuthInterceptor } from './auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    {
      provide: APP_INITIALIZER,
      useFactory: (ks: KeycloakService) => {
        return async() => await ks.init();
      },
      multi: true,
      deps: [KeycloakService],
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
      deps: [KeycloakService],
    },
    provideHttpClient(
      withInterceptorsFromDi(),
      withInterceptors([apiInterceptor]),
    ),
  ]
};
