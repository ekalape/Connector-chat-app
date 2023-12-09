import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Location } from '@angular/common';
import { titleKinds } from 'app/utils/enums/title-controls';
import { ActivatedRoute, RouterModule } from '@angular/router';


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
  @Output() deleteConversation = new EventEmitter();

  @Input() blockUpdateButton: boolean = false;


  counterIsActive = false;
  count = 60;

  constructor(private location: Location, private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    if (this.blockUpdateButton) this.startCounter()
    /*
        if (this.kind === titleKinds.PRIVATE_GROUP || this.kind === titleKinds.PRIVATE_CONVERSATION)
          this.update() */
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

  delete() {
    this.deleteConversation.emit(this.route.snapshot.paramMap.get('convID'))
  }

}
