import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { HeaderComponent } from './components/header/header.component';
import { StorageKeys } from './utils/enums/local-storage-keys';
import { Store } from '@ngrx/store';
import { logInAction } from './store/actions/auth.action';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ButtonModule, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'connector app';

  constructor(private store: Store) {
  }

  ngOnInit() {
    const personalData = localStorage.getItem(StorageKeys.LOGIN_KEY);
    if (personalData) {
      const { token, email, uid } = JSON.parse(personalData)
      this.store.dispatch(logInAction({ token, email, uid }))
    }
  }


  switchTheme(dark: boolean) {
    if (dark) { document.body.classList.add('dark') }
    else document.body.classList.remove('dark')
  }

}
