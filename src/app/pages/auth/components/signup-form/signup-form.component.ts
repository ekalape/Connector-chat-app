import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormGroup, Validators, FormControl, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ComplexPasswordValidator } from 'app/directives/complex-password-validator.directive';
import { Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Pathes } from 'app/utils/enums/pathes';
import { AuthService } from 'app/services/auth.service';
import { take, tap } from 'rxjs';

@Component({
  selector: 'app-signup-form',
  standalone: true,
  imports: [CommonModule, ButtonModule, InputTextModule, ReactiveFormsModule, ToastModule,],
  providers: [MessageService],
  templateUrl: './signup-form.component.html',
  styleUrl: './signup-form.component.scss'
})
export class SignupFormComponent {



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

  constructor(private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private authService: AuthService) {

  }
  onTabSwitch() {
    this.router.navigate([Pathes.SIGN_IN])
  }

  onSubmit() {
    console.log('form :>> ', this.signupForm.value);
    this.authService.register(this.firstName.value, this.email.value, this.password.value)
      .pipe(take(1), tap(x => console.log("inside tap", x)))
      .subscribe(res => {
        console.log('res inside subs :>> ', res);
      })

    //this.showSuccess()
    //this.signupForm.reset()
    // this.router.navigate([Pathes.SIGN_IN])

  }
  showSuccess() {
    this.messageService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: 'Thank you! Now you can login', life: 60000 });
  }
  showError() {
    this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'Your registration ended up with an error. Try again' });
  }
}
