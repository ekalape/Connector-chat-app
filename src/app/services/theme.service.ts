import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor(@Inject(DOCUMENT) private document: Document) { }

  switchTheme(theme: boolean) {
    let themeLink = this.document.getElementById('app-theme-link') as HTMLLinkElement;
    if (theme) themeLink.href = 'vela-green.css';
    else themeLink.href = 'saga-green.css'
  }
}
