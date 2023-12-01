import { ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { reducers } from './store';
import { GetProfileEffects } from './store/effects/get-profile.effects';
import { AuthorizationInterceptor } from './interceptors/authorization.interceptor';
import { LogoutEffects } from './store/effects/logout.effect';

export const httpInterceptorProviders = [{ provide: HTTP_INTERCEPTORS, useClass: AuthorizationInterceptor, multi: true }]

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
  provideAnimations(),
  importProvidersFrom(HttpClientModule),
    httpInterceptorProviders,
  provideStore(reducers),
  provideEffects([GetProfileEffects, LogoutEffects]),
  provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })]
};
