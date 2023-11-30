import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthService } from 'app/services/auth.service';
import { Router } from '@angular/router';
import { Pathes } from 'app/utils/enums/pathes';
import { take } from 'rxjs';
import { Store } from '@ngrx/store';
import { logInAction, setLoadingAction } from 'app/store/actions/auth.action';
import { DataExchangeService } from '../../services/data-exchange.service';
import { selectLoadingState } from 'app/store/selectors/auth.selectors';
import { authActions } from 'app/utils/enums/authActions';



@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule,
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule],
  providers: [AuthService],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss'
})
export class LoginFormComponent {


  isLoading = this.store.select(selectLoadingState);

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

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private dataExchange: DataExchangeService,
    private router: Router,
    private store: Store
  ) { }

  onTabSwitch() {
    this.router.navigate([Pathes.SIGN_UP])
  }

  onSubmit() {
    console.log('form :>> ', this.loginForm.value);
    this.store.dispatch(setLoadingAction({ loading: true }))
    this.authService.login(this.email.value, this.password.value)
      .pipe(take(1))
      .subscribe(res => {
        console.log("res-->", res);
        if (res && "token" in res) {
          this.store.dispatch(logInAction({ token: res.token, uid: res.uid, email: this.email.value }));
          this.dataExchange.setSuccess("You are logged now!", authActions.LOGIN);

          this.loginForm.reset();
        }
        else if (res && "type" in res) {
          this.dataExchange.setFail(res.message, authActions.LOGIN)
        }
        this.store.dispatch(setLoadingAction({ loading: false }))
      })
  }


}
