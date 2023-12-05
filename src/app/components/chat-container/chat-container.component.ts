import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-chat-container',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonModule, InputTextModule],
  templateUrl: './chat-container.component.html',
  styleUrl: './chat-container.component.scss'
})
export class ChatContainerComponent {

  messageInput = new FormControl("");
  @Output() sendEvent = new EventEmitter<string>()


  sendMessage() {
    if (this.messageInput.value?.trim()) {
      this.sendEvent.emit(this.messageInput.value)
      this.messageInput.reset()
    }
  }

}
