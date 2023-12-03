import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { IMessages, ISingleMessage } from 'app/models/conversations.model';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule, CardModule, PanelModule],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent {

  others = true;

  messageData: ISingleMessage | undefined;

  ngOnInit() {
    this.messageData = {
      authorID: "111111",
      createdAt: "1701534031539",
      message: "Hello friends!"
    }
  }

}
