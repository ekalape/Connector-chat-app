import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Location } from '@angular/common';
import { titleKinds } from 'app/utils/enums/title-controls';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-title-controls',
  standalone: true,
  imports: [CommonModule, ButtonModule, RouterModule],
  templateUrl: './title-controls.component.html',
  styleUrl: './title-controls.component.scss'
})
export class TitleControlsComponent {
  @Input() kind: titleKinds = titleKinds.PEOPLE
  @Output() updateContent = new EventEmitter()
  @Output() addGroup = new EventEmitter()

  constructor(private location: Location) { }

  goBack() {
    this.location.back()
  }

  update() {
    this.updateContent.emit(this.kind)
  }
  add() {
    this.addGroup.emit()
  }

}
