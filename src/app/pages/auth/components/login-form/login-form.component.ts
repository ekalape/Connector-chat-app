import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, ButtonModule, InputTextModule, ReactiveFormsModule],

  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss'
})
export class LoginFormComponent {

  @Output() currentActiveIndex = new EventEmitter<number>()

  loginForm: FormGroup = this.fb.group({

    emailInput: ['', [Validators.required, Validators.email]],
    passInput: ['', [Validators.required]],
  });

  get email() {
    return this.loginForm.get('emailInput') as FormControl;
  }

  get password() {
    return this.loginForm.get('passInput') as FormControl;
  }

  constructor(private fb: FormBuilder) {

  }
  onTabSwitch() {
    this.currentActiveIndex.emit(1)
  }

  onSubmit() {
    console.log('form :>> ', this.loginForm.value);

  }

}
