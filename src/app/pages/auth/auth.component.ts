import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabViewModule } from 'primeng/tabview';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { SignupFormComponent } from './components/signup-form/signup-form.component';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, TabViewModule, ButtonModule, InputTextModule, LoginFormComponent, SignupFormComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {


  activeIndex = 0;

  setActiveIndex(index: number) {
    this.activeIndex = index
  }

}
