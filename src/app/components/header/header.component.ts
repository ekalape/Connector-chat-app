import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelModule } from 'primeng/panel';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { logOutAction } from 'app/store/actions/auth.action';
import { Subscription } from 'rxjs';
import { selectLoggedIn } from 'app/store/selectors/auth.selectors';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FormsModule } from '@angular/forms';
import { StorageKeys } from 'app/utils/enums/local-storage-keys';
import { ThemeService } from 'app/services/theme.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { selectError } from 'app/store/selectors/profile.selectors';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, PanelModule,
    FormsModule,
    ConfirmDialogComponent,
    ToastModule,
    MenubarModule, InputSwitchModule],
  providers: [MessageService],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  menuItems: MenuItem[] = [];
  loggedIn = false;
  sub: Subscription | undefined;
  errorSUB: Subscription | undefined;
  darkTheme: boolean;

  showConfirm = false;

  @Output() theme = new EventEmitter<boolean>()


  constructor(private router: Router,
    private store: Store,
    private themeService: ThemeService,
    private messageService: MessageService
  ) {
    const currentTheme = localStorage.getItem(StorageKeys.THEME_KEY);
    if (currentTheme) this.darkTheme = JSON.parse(currentTheme);
    else this.darkTheme = false;
  }

  ngOnInit() {
    this.sub = this.store.select(selectLoggedIn).subscribe(x => this.loggedIn = x.loggedIn)
    this.switchTheme(this.darkTheme)
    this.errorSUB = this.store.select(selectError).subscribe(data => {
      if (data) this.showError(data.message)
    })


  }

  isActive(): boolean {
    const routes = ["/signin", "/signup", "group", "conversation", "/"]

    return routes.some(r => this.router.url === r)
  }

  logout() {
    this.showConfirm = true;
  }
  logoutConfirmed() {
    if (this.loggedIn) {
      this.store.dispatch(logOutAction())
    }
    this.showConfirm = false;
  }

  switchTheme(dark: boolean) {
    this.darkTheme = dark;
    this.theme.emit(dark);
    this.themeService.switchTheme(dark)
    localStorage.setItem(StorageKeys.THEME_KEY, JSON.stringify(this.darkTheme))
  }
  showError(errorMessage: string | undefined) {
    this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: errorMessage || "Something went wrong, try again" });
  }
}
