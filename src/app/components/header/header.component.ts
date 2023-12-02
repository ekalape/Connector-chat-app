import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelModule } from 'primeng/panel';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem, MenuItemCommandEvent } from 'primeng/api';
import { Router } from '@angular/router';
import { Pathes } from 'app/utils/enums/pathes';

import { AuthService } from 'app/services/auth.service';
import { Store } from '@ngrx/store';
import { logOutAction } from 'app/store/actions/auth.action';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, PanelModule, MenubarModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  menuItems: MenuItem[] = [];


  constructor(private router: Router, private store: Store) {

  }

  ngOnInit() {
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }

  logout() {
    this.store.dispatch(logOutAction())
    this.router.navigate([Pathes.SIGN_IN])
  }

}
