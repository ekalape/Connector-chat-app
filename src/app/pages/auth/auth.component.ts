import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabViewCloseEvent, TabViewModule } from 'primeng/tabview';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { SignupFormComponent } from './components/signup-form/signup-form.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { Store, StoreModule } from '@ngrx/store';
import { selectProfileData } from 'app/store/selectors/profile.selectors';
import { authReducer } from 'app/store/reducers/auth.reducer';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule,
    TabViewModule,
    ButtonModule,
    InputTextModule,
    LoginFormComponent,
    RouterModule,
    SignupFormComponent,
  ],
  providers: [],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {

  activeIndex = 0;

  data = this.store.select(selectProfileData)
  sub: Subscription | undefined

  constructor(private store: Store,
    private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.activeIndex = event.urlAfterRedirects.includes("signup") ? 1 : 0;
      }
    });
  }

  ngOnInit() {
    this.sub = this.data.subscribe(x => console.log("store data -->", x))
  }



  changeTab(event: TabViewCloseEvent) {
    console.log('event.index :>> ', event.index);
    this.router.navigate([event.index === 0 ? "/signin" : "/signup"]);
  }

  setActiveIndex(index: Event) {
    console.log('index :>> ', index);
    /*     if (index === 3) { this.showSuccess(); this.activeIndex = 0; this.router.navigate(["/signin"]) }
        else { this.activeIndex = index; this.router.navigate(["/signup"]) } */
  }
  ngOnDestroy() {
    this.sub?.unsubscribe()
  }

}


