import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelModule } from 'primeng/panel';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem, MenuItemCommandEvent } from 'primeng/api';
import { Router } from '@angular/router';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, PanelModule, MenubarModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  menuItems: MenuItem[] = [];


  constructor(private router: Router) {

  }

  ngOnInit() {
    this.menuItems = [
      {
        label: 'Home',
        icon: 'pi pi-fw pi-home',
        //routerLink: '/home',
        command: (event: MenuItemCommandEvent) => {
          this.router.navigate(['/home']);

        },
        disabled: this.checkactivestate("home"),

        routerLinkActiveOptions: { exact: true }

      },
      {
        label: 'Profile',
        icon: 'pi pi-fw pi-user',
        //routerLink: '/profile',
        command: (event: MenuItemCommandEvent) => {
          this.router.navigate(['/profile'])
        },
        disabled: this.checkactivestate("profile"),
        routerLinkActiveOptions: { exact: true }
      },
      {
        label: 'Log-out',
        icon: 'pi pi-fw pi-sign-out',
        //routerLink: '/profile',
        command: (event: MenuItemCommandEvent) => {
          this.router.navigate(['/profile'])
        },
        disabled: this.checkactivestate("profile"),
        routerLinkActiveOptions: { exact: true }
      },
    ]
  }

  checkactivestate(givenlink: string) {
    console.log(this.router.url);
    if (this.router.url.indexOf(givenlink) === -1) {
      return false;
    } else {
      return true;
    }
  }

}
