import { Component } from '@angular/core';
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
import { Store } from '@ngrx/store';
import { setLoadingAction } from 'app/store/actions/auth.action';
import { selectLoadingState } from 'app/store/selectors/auth.selectors';
import { IHttpError } from 'app/models/auth.model';

@Component({
  selector: 'app-signup-form',
  standalone: true,
  imports: [CommonModule, ButtonModule, InputTextModule, ReactiveFormsModule, ToastModule,],
  providers: [MessageService],
  templateUrl: './signup-form.component.html',
  styleUrl: './signup-form.component.scss'
})
export class SignupFormComponent {

  isLoading = this.store.select(selectLoadingState);

  error: IHttpError | null = null;

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
    private authService: AuthService,
    private store: Store) {

  }

  onTabSwitch() {
    this.router.navigate([Pathes.SIGN_IN])
  }

  onSubmit() {
    console.log('form :>> ', this.signupForm.value);
    this.store.dispatch(setLoadingAction({ loading: true }))
    this.authService.register(this.firstName.value, this.email.value, this.password.value)
      .pipe(take(1), tap(x => console.log("inside tap", x)))
      .subscribe(res => {
        if (res && "type" in res) {
          this.error = res;
          this.showError()
        } else {
          this.showSuccess(); //TODO  show message in other component cause redirection
          this.signupForm.reset();
          this.router.navigate([Pathes.SIGN_IN])
        }
        this.store.dispatch(setLoadingAction({ loading: false }))
      })


  }
  showSuccess() {
    this.messageService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: 'Thank you! Now you can login', life: 60000 });
  }
  showError() {
    this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: this.error?.message || "Something went wrong, try again" });
  }
}
