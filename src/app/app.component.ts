import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { HeaderComponent } from './components/header/header.component';
import { StorageKeys } from './utils/enums/local-storage-keys';
import { Store } from '@ngrx/store';
import { logInAction, logOutSuccessAction } from './store/actions/auth.action';
import { Subscription } from 'rxjs';
import { selectError } from './store/selectors/profile.selectors';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ButtonModule, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'connector app';
  errorSUB: Subscription | undefined;

  constructor(private store: Store, private router: Router) {
  }

  ngOnInit() {
    const personalData = localStorage.getItem(StorageKeys.LOGIN_KEY);
    if (personalData) {
      const { token, email, uid } = JSON.parse(personalData)
      this.store.dispatch(logInAction({ token, email, uid }))
    }
    this.errorSUB = this.store.select(selectError).subscribe((data) => {
      if (data?.type === "InvalidIDException" || data?.type === "InvalidTokenException") {
        localStorage.removeItem(StorageKeys.LOGIN_KEY);
        this.store.dispatch(logOutSuccessAction())
      }
    })

  }


  switchTheme(dark: boolean) {
    if (dark) { document.body.classList.add('dark') }
    else document.body.classList.remove('dark')
  }


  ngOnDestroy() {
    this.errorSUB?.unsubscribe()
  }
}
