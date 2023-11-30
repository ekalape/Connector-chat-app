import { ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { HttpClientModule } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { reducers } from './store';
import { GetProfileEffects } from './store/effects/get-profile.effects';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
  provideAnimations(),
  importProvidersFrom(HttpClientModule), provideStore(reducers), provideEffects([GetProfileEffects]), provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })]
};
