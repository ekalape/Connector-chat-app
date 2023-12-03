import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageComponent } from 'app/components/message/message.component';

@Component({
  selector: 'app-conversation',
  standalone: true,
  imports: [CommonModule, MessageComponent],
  templateUrl: './conversation.component.html',
  styleUrl: './conversation.component.scss'
})
export class ConversationComponent {

}
