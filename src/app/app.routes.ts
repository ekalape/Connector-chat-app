import { Routes } from '@angular/router';
import { AuthComponent } from './pages/auth/auth.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

import { SignupFormComponent } from './pages/auth/components/signup-form/signup-form.component';
import { Pathes } from './utils/enums/pathes';
import { ProfileComponent } from './pages/profile/profile/profile.component';
import { LoginFormComponent } from './pages/auth/components/login-form/login-form.component';
import { authGuard, guestGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: "", redirectTo: Pathes.SIGN_IN, pathMatch: "full"
  },
  { path: "profile", component: ProfileComponent, canActivate: [authGuard] },
  {
    path: "", component: AuthComponent, children:
      [
        { path: "signup", component: SignupFormComponent, canActivate: [guestGuard] },
        { path: "signin", component: LoginFormComponent, canActivate: [guestGuard] },]
  },
  { path: "**", component: NotFoundComponent }
];
