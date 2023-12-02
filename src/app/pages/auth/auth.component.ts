import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabViewCloseEvent, TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SignupFormComponent } from './components/signup-form/signup-form.component';
import { MessageService } from 'primeng/api';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectProfileData } from 'app/store/selectors/profile.selectors';
import { Subscription } from 'rxjs';
import { DataExchangeService } from './services/data-exchange.service';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { Pathes } from 'app/utils/enums/pathes';
import { authActions } from 'app/utils/enums/authActions';
import { getProfileAction } from 'app/store/actions/profile.action';


@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule,
    TabViewModule,
    ButtonModule,
    InputTextModule,
    LoginFormComponent,
    RouterModule,
    ToastModule,
    SignupFormComponent,
  ],
  providers: [DataExchangeService, MessageService],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {

  activeIndex = 0;

  data = this.store.select(selectProfileData)
  sub: Subscription | undefined;
  datasub: Subscription | undefined;

  constructor(private store: Store,
    private router: Router,
    private dataExchange: DataExchangeService,
    private messageService: MessageService,
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.activeIndex = event.urlAfterRedirects.includes("signup") ? 1 : 0;
      }
    });
  }

  ngOnInit() {

    this.datasub = this.dataExchange.successful.subscribe(x => {
      if (x.action && x.success) {
        console.log("dataExchange on success", x);
        this.showSuccess(x.message);
        if (x.action === authActions.LOGIN) {
          this.store.dispatch(getProfileAction());
          setTimeout(() => {          // because navigating too fast and success toast is not visible
            console.log("inside timeout");
            this.router.navigate([Pathes.HOME]);
          }, 800)
        }
      }
      else if (x.action && !x.success) {
        this.showError(x.message)
      }
    })
  }

  changeTab(event: TabViewCloseEvent) {
    this.router.navigate([event.index === 0 ? "/signin" : "/signup"]);
  }


  ngOnDestroy() {
    this.dataExchange.reset()
    this.sub?.unsubscribe();
    this.datasub?.unsubscribe();
  }

  showSuccess(message: string | undefined) {
    console.log("inside show success message");
    this.messageService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: message || 'Thank you!' });
  }
  showError(errorMessage: string | undefined) {
    this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: errorMessage || "Something went wrong, try again" });
  }

}


