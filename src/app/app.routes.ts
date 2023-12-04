import { Routes } from '@angular/router';
import { AuthComponent } from './pages/auth/auth.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { SignupFormComponent } from './pages/auth/components/signup-form/signup-form.component';
import { ProfileComponent } from './pages/profile/profile/profile.component';
import { LoginFormComponent } from './pages/auth/components/login-form/login-form.component';
import { authGuard } from './guards/auth.guard';
import { GroupComponent } from './pages/group/group.component';
import { DefaultMainComponent } from './pages/default-main/default-main.component';

export const routes: Routes = [
  { path: "profile", component: ProfileComponent/* , canActivate: [authGuard] */ },
  {
    path: "signup", component: AuthComponent, children:
      [
        { path: "", component: SignupFormComponent }
      ]
  },
  {
    path: "signin", component: AuthComponent, children:
      [
        { path: "", component: LoginFormComponent }]
  },
  {
    path: "group/:groupId", component: GroupComponent
  },
  {
    path: "", component: DefaultMainComponent/* , canActivate: [authGuard] */
  },
  { path: "**", component: NotFoundComponent }

];
