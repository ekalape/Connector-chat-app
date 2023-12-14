import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageKeys } from 'app/utils/enums/local-storage-keys';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss'
})
export class NotFoundComponent implements OnInit {

  darkTheme: boolean = false;


  ngOnInit() {
    const currentTheme = localStorage.getItem(StorageKeys.THEME_KEY);
    if (currentTheme) this.darkTheme = JSON.parse(currentTheme);
    else this.darkTheme = false;
  }

}
