import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule,
    ButtonModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss'
})
export class ConfirmDialogComponent {

  @Output() confirmEvent = new EventEmitter<boolean>();
  @Output() cancelEvent = new EventEmitter<boolean>();

  @Input() show = false


  confirm() {
    this.confirmEvent.emit(true)
  }

  cancel() {
    this.cancelEvent.emit(false)
  }
}
