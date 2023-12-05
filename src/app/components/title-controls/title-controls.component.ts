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
  @Input() kind: titleKinds = titleKinds.PEOPLE;
  @Output() updateContent = new EventEmitter();
  @Output() addGroup = new EventEmitter();

  counterIsActive = false;
  count = 60;

  constructor(private location: Location) { }

  ngOnInit() {
    if (this.kind === titleKinds.PRIVATE_GROUP || this.kind === titleKinds.PRIVATE_CONVERSATION)
      this.update()
  }


  goBack() {
    this.location.back()
  }

  update() {
    this.updateContent.emit(this.kind);
    this.startCounter()
  }
  add() {
    this.addGroup.emit()
  }

  startCounter() {
    this.counterIsActive = true;
    let interval = setInterval(() => {
      this.count--;
      if (this.count === 0 && interval) {
        clearInterval(interval)
        this.counterIsActive = false;
        this.count = 60;
      };
    }, 1000)
  }

}
