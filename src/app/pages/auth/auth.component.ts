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
    SignupFormComponent],
  providers: [MessageService],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {

  activeIndex = 0;

  constructor(private messageService: MessageService,
    private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.activeIndex = event.urlAfterRedirects.includes("signup") ? 1 : 0;
      }
    });
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
  showSuccess() {
    this.messageService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: 'Thank you! Now you can login', life: 60000 });
  }
  showError() {
    this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'Your registration ended up with an error. Try again' });
  }
}

/*     if (event.index === 1) {
      console.log('event.index :>> ', event.index);
      this.router.navigate(["/signup"])
    };
    if (event.index === 0) { console.log('event.index :>> ', event.index); this.router.navigate(["/signin"]) }; */
