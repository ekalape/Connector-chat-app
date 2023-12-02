import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { HeaderComponent } from './components/header/header.component';
import { StorageKeys } from './utils/enums/local-storage-keys';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ButtonModule, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'connector app';

  ngOnInit() {
    window.addEventListener('beforeunload', this.clearLocalStorage);
  }

  ngOnDestroy() {
    window.removeEventListener('beforeunload', this.clearLocalStorage);
  }

  clearLocalStorage() {
    localStorage.removeItem(StorageKeys.LOGIN_KEY);
  }

}
