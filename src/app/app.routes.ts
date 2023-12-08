import { Routes } from '@angular/router';
import { AuthComponent } from './pages/auth/auth.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { SignupFormComponent } from './pages/auth/components/signup-form/signup-form.component';
import { ProfileComponent } from './pages/profile/profile/profile.component';
import { LoginFormComponent } from './pages/auth/components/login-form/login-form.component';
import { authGuard } from './guards/auth.guard';
import { GroupComponent } from './pages/group/group.component';
import { DefaultMainComponent } from './pages/default-main/default-main.component';
import { ConversationComponent } from './pages/conversation/conversation.component';

export const routes: Routes = [
  { path: "profile", component: ProfileComponent, canActivate: [authGuard], title: "Profile" },
  {
    path: "signup", component: AuthComponent, title: "Sign-up", children:
      [
        { path: "", component: SignupFormComponent }
      ]
  },
  {
    path: "signin", component: AuthComponent, title: "Sign-in", children:
      [
        { path: "", component: LoginFormComponent }]
  },
  {
    path: "group/:groupId", component: GroupComponent, title: "Group dialog", canActivate: [authGuard]
  },
  {
    path: "conversation/:convID", component: ConversationComponent, title: "Private conversation", canActivate: [authGuard]
  },
  {
    path: "", component: DefaultMainComponent, canActivate: [authGuard]
  },
  { path: "**", component: NotFoundComponent, title: "Not found" }

];
