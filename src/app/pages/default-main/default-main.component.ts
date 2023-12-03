import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MessageComponent } from 'app/components/message/message.component';



@Component({
  selector: 'app-default-main',
  standalone: true,
  imports: [CommonModule, RouterModule, MessageComponent],
  templateUrl: './default-main.component.html',
  styleUrl: './default-main.component.scss'
})
export class DefaultMainComponent {

}
