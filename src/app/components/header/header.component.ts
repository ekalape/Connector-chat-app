import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelModule } from 'primeng/panel';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { Pathes } from 'app/utils/enums/pathes';
import { Store } from '@ngrx/store';
import { logOutAction } from 'app/store/actions/auth.action';
import { Subscription } from 'rxjs';
import { selectLoggedIn } from 'app/store/selectors/auth.selectors';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FormsModule } from '@angular/forms';
import { StorageKeys } from 'app/utils/enums/local-storage-keys';
import { ThemeService } from 'app/services/theme.service';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, PanelModule,
    FormsModule,
    MenubarModule, InputSwitchModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  menuItems: MenuItem[] = [];
  loggedIn = false;
  sub: Subscription | undefined;
  darkTheme: boolean;

  @Output() theme = new EventEmitter<boolean>()


  constructor(private router: Router,
    private store: Store,
    private themeService: ThemeService
  ) {
    const currentTheme = localStorage.getItem(StorageKeys.THEME_KEY);
    if (currentTheme) this.darkTheme = JSON.parse(currentTheme);
    else this.darkTheme = false;
  }

  ngOnInit() {
    this.sub = this.store.select(selectLoggedIn).subscribe(x => this.loggedIn = x.loggedIn)
    this.switchTheme(this.darkTheme)

  }

  isActive(): boolean {
    const routes = ["/signin", "/signup", "group", "conversation", "/"]

    return routes.some(r => this.router.url === r)
  }

  logout() {
    if (this.loggedIn) {
      this.store.dispatch(logOutAction())

    }
  }
  switchTheme(dark: boolean) {
    this.darkTheme = dark;
    this.theme.emit(dark);
    this.themeService.switchTheme(dark)
    localStorage.setItem(StorageKeys.THEME_KEY, JSON.stringify(this.darkTheme))
  }

}
