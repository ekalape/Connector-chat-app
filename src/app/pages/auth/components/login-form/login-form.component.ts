import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthService } from 'app/services/auth.service';
import { Router } from '@angular/router';
import { Pathes } from 'app/utils/enums/pathes';



@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, ButtonModule,
    InputTextModule,

    ReactiveFormsModule],
  providers: [AuthService],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss'
})
export class LoginFormComponent {



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
    private httpService: AuthService,
    private router: Router,
  ) {

  }
  onTabSwitch() {
    this.router.navigate([Pathes.SIGN_UP])
  }

  onSubmit() {
    console.log('form :>> ', this.loginForm.value);
    const res = this.httpService.login(this.email.value, this.password.value)
    console.log('inside form :>> ', res);

  }


}
