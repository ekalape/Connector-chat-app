import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormGroup, Validators, FormControl, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ComplexPasswordValidator } from 'app/directives/complex-password-validator.directive';


@Component({
  selector: 'app-signup-form',
  standalone: true,
  imports: [CommonModule, ButtonModule, InputTextModule, ReactiveFormsModule],
  templateUrl: './signup-form.component.html',
  styleUrl: './signup-form.component.scss'
})
export class SignupFormComponent {
  @Output() currentActiveIndex = new EventEmitter<number>()
  signupForm: FormGroup = this.fb.group({
    firstNameInput: ["", [Validators.required, Validators.minLength(3), Validators.pattern(/^[A-Za-z\s]*$/)]],
    emailInput: ['', [Validators.required, Validators.email]],
    passInput: ['', [Validators.required, ComplexPasswordValidator()]],
  });

  get firstName() {
    return this.signupForm.get('firstNameInput') as FormControl;
  }
  get email() {
    return this.signupForm.get('emailInput') as FormControl;
  }
  get password() {
    return this.signupForm.get('passInput') as FormControl;
  }

  constructor(private fb: FormBuilder) {

  }
  onTabSwitch() {
    this.currentActiveIndex.emit(0)
  }

  onSubmit() { }
}
