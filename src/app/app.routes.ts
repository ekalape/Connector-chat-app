import { Routes } from '@angular/router';
import { AuthComponent } from './pages/auth/auth.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { LoginFormComponent } from './pages/auth/components/login-form/login-form.component';
import { SignupFormComponent } from './pages/auth/components/signup-form/signup-form.component';
import { Pathes } from './utils/enums/pathes';

export const routes: Routes = [
  {
    path: "", redirectTo: Pathes.SIGN_IN, pathMatch: "full"
  },
  {
    path: "", component: AuthComponent, children:
      [
        { path: "signup", component: SignupFormComponent },
        { path: "signin", component: LoginFormComponent },]
  },
  { path: "**", component: NotFoundComponent }
];
