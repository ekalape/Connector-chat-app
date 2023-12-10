import { Component, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Location } from '@angular/common';
import { titleKinds } from 'app/utils/enums/title-controls';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectErrorState } from 'app/store/selectors/error.selectors';
import { Subscription, first, tap } from 'rxjs';
import { RequestStatus } from 'app/utils/enums/request-status';


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
  @Input() blockBtn = false


  errorSub: Subscription | undefined;
  status: RequestStatus | undefined

  counterIsActive = false;
  count = 10;

  constructor(private location: Location,
    private route: ActivatedRoute,
    private store: Store
  ) {
  }

  ngOnInit() {
  }

  goBack() {
    this.location.back()

  }

  update() {
    this.updateContent.emit(this.kind);
    console.log('this.blockBtn :>> ', this.blockBtn);

    if (this.blockBtn)
      this.startCounter()
  }

  /*   ngOnChanges() {
      if (this.blockBtn)
        this.startCounter()
    } */



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
        this.count = 10;
      };
    }, 1000)

  }

  delete() {
    this.deleteConversation.emit(this.route.snapshot.paramMap.get('convID'))
  }

  ngOnDestroy() {
    this.errorSub?.unsubscribe()
  }

}
