import { Component, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Location } from '@angular/common';
import { titleKinds } from 'app/utils/enums/title-controls';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription, first, tap } from 'rxjs';
import { RequestStatus } from 'app/utils/enums/request-status';
import { setGroupCounter } from 'app/store/actions/group.action';
import { setPeopleCounter } from 'app/store/actions/people.action';
import { selectGroupMainCounterState, selectGroupPrivateCounterState } from 'app/store/selectors/group.selectors';
import { selectPeopleMainCounterState, selectPeoplePrivateCounterState } from 'app/store/selectors/people.selectors';


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


  counterIsActive = false;
  count = 20;  //TODO don't forget to change!!

  constructor(private location: Location,
    private route: ActivatedRoute,
    private store: Store
  ) {
  }

  ngOnInit() {
    let counter;
    switch (this.kind) {
      case titleKinds.GROUPS:
        this.store.select(selectGroupMainCounterState)
          .pipe(first())
          .subscribe(time => {
            if (time > 0) {
              this.counterIsActive = true;
              this.count = time;
              this.startCounter()
            }
          })
        break;
      case titleKinds.PEOPLE:
        this.store.select(selectPeopleMainCounterState)
          .pipe(first())
          .subscribe(time => {
            if (time > 0) {
              this.counterIsActive = true;
              this.count = time;
              this.startCounter()
            }
          })
        break;
      case titleKinds.PRIVATE_GROUP:
        this.store.select(selectGroupPrivateCounterState)
          .pipe(first())
          .subscribe(time => {
            if (time > 0) {
              this.counterIsActive = true;
              this.count = time;
              this.startCounter()
            }
          })
        break;
      case titleKinds.PRIVATE_CONVERSATION:
        this.store.select(selectPeoplePrivateCounterState)
          .pipe(first())
          .subscribe(time => {
            if (time > 0) {
              this.counterIsActive = true;
              this.count = time;
              this.startCounter()
            }
          })
        break;
    }


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
        this.count = 20;
      };
    }, 1000)

  }

  delete() {
    this.deleteConversation.emit(this.route.snapshot.paramMap.get('convID'))
  }

  ngOnDestroy() {
    if (this.counterIsActive) {
      switch (this.kind) {
        case titleKinds.GROUPS:
          this.store.dispatch(setGroupCounter({ counterType: 'main', time: this.count }));
          break;
        case titleKinds.PEOPLE:
          this.store.dispatch(setPeopleCounter({ counterType: 'private', time: this.count }));
          break;
        case titleKinds.PRIVATE_GROUP:
          this.store.dispatch(setGroupCounter({ counterType: 'main', time: this.count }));
          break;
        case titleKinds.PRIVATE_CONVERSATION:
          this.store.dispatch(setPeopleCounter({ counterType: 'private', time: this.count }));
          break;
      }
    }



  }

}
