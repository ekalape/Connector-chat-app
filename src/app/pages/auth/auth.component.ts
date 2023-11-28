import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabViewModule } from 'primeng/tabview';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { SignupFormComponent } from './components/signup-form/signup-form.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, TabViewModule, ButtonModule, InputTextModule, LoginFormComponent, ToastModule, SignupFormComponent],
  providers: [MessageService],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {


  activeIndex = 0;

  constructor(private messageService: MessageService) { }

  setActiveIndex(index: number) {
    if (index === 3) { this.showSuccess(); this.activeIndex = 0 }
    else this.activeIndex = index
  }
  showSuccess() {
    this.messageService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: 'Thank you! Now you can login', life: 60000 });
  }
  showError() {
    this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'Your registration ended up with an error. Try again' });
  }
}
