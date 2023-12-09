import { Component } from '@angular/core';
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


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, PanelModule, MenubarModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  menuItems: MenuItem[] = [];
  loggedIn = false;
  sub: Subscription | undefined

  constructor(private router: Router, private store: Store) {

  }

  ngOnInit() {
    this.sub = this.store.select(selectLoggedIn).subscribe(x => this.loggedIn = x.loggedIn)
  }

  isActive(): boolean {
    const routes = ["/signin", "/signup", "group", "conversation", "/"]
    return routes.some(r => this.router.url === r)
  }

  logout() {
    if (this.loggedIn) {
      this.store.dispatch(logOutAction())
      this.router.navigate([Pathes.SIGN_IN])

    }
  }

}
