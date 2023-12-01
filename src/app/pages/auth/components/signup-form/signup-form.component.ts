import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormGroup, Validators, FormControl, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ComplexPasswordValidator } from 'app/directives/complex-password-validator.directive';
import { Router } from '@angular/router';

import { Pathes } from 'app/utils/enums/pathes';
import { AuthService } from 'app/services/auth.service';
import { distinctUntilChanged, take, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { setLoadingAction } from 'app/store/actions/auth.action';
import { selectLoadingState } from 'app/store/selectors/auth.selectors';
import { DataExchangeService } from '../../services/data-exchange.service';
import { authActions } from 'app/utils/enums/authActions';

@Component({
  selector: 'app-signup-form',
  standalone: true,
  imports: [CommonModule, ButtonModule, InputTextModule, ReactiveFormsModule,],
  providers: [],
  templateUrl: './signup-form.component.html',
  styleUrl: './signup-form.component.scss'
})
export class SignupFormComponent {

  isLoading = this.store.select(selectLoadingState);

  wrongEmail: string = "";
  emailValidators = [Validators.required, Validators.email]

  signupForm: FormGroup = this.fb.group({
    firstNameInput: ["", [Validators.required, Validators.minLength(3), Validators.pattern(/^[A-Za-z\s]*$/)]],
    emailInput: ['', this.emailValidators],
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
    private authService: AuthService,
    private dataExchange: DataExchangeService,
    private store: Store) {

  }

  onTabSwitch() {
    this.router.navigate([Pathes.SIGN_IN])
  }

  onSubmit() {

    this.store.dispatch(setLoadingAction({ loading: true }))
    this.authService.register(this.firstName.value, this.email.value, this.password.value)
      .pipe(take(1))
      .subscribe(res => {
        if (res && "type" in res) {
          if (res.type === "PrimaryDuplicationException") {
            this.wrongEmail = this.email.value;
            const emailValidator = Validators.pattern(new RegExp(`^(?!${this.wrongEmail}$).*$`));
            this.email.addValidators(emailValidator);
            this.email.updateValueAndValidity({ emitEvent: false });

          }
          this.dataExchange.setFail(res.message, authActions.REG);
        } else {
          this.dataExchange.setSuccess("Thank you! Now you can login", authActions.REG);
          this.signupForm.reset();
          setTimeout(() => {
            this.router.navigate([Pathes.SIGN_IN])
          }, 15000)
        }
        this.store.dispatch(setLoadingAction({ loading: false }))
      })


  }

}
