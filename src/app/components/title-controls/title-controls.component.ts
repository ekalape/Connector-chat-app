import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Location } from '@angular/common';
import { titleKinds } from 'app/utils/enums/title-controls';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription, first } from 'rxjs';
import { setGroupCounter } from 'app/store/actions/group.action';
import { setPeopleCounter } from 'app/store/actions/people.action';
import { selectGroupMainCounterState, selectGroupPrivateCounterStateByID } from 'app/store/selectors/group.selectors';
import { selectPeopleMainCounterState, selectPeoplePrivateCounterStateByID } from 'app/store/selectors/people.selectors';


@Component({
  selector: 'app-title-controls',
  standalone: true,
  imports: [CommonModule, ButtonModule, RouterModule],
  templateUrl: './title-controls.component.html',
  styleUrl: './title-controls.component.scss'
})
export class TitleControlsComponent implements OnInit, OnDestroy {
  @Input() kind: titleKinds = titleKinds.PEOPLE;
  @Output() updateContent = new EventEmitter();
  @Output() addGroup = new EventEmitter();
  @Output() deleteConversation = new EventEmitter();
  @Input() blockBtn = false


  counterIsActive = false;
  count = 60;

  counterSUB: Subscription | undefined;
  interval: NodeJS.Timeout | undefined | null;
  convID: string | undefined | null;

  constructor(private location: Location,
    private route: ActivatedRoute,
    private store: Store
  ) {
  }

  ngOnInit() {
    if (this.kind === titleKinds.PRIVATE_CONVERSATION)
      this.convID = this.route.snapshot.paramMap.get('convID')
    if (this.kind === titleKinds.PRIVATE_GROUP)
      this.convID = this.route.snapshot.paramMap.get('groupId')
    switch (this.kind) {
      case titleKinds.GROUPS:
        this.store.select(selectGroupMainCounterState)
          .pipe(first())
          .subscribe(data => {
            if (data.active) {
              const diff = Math.round((Date.now() - data.time) / 1000);
              if (diff < data.current && diff > 0) {
                this.count = data.current - diff;
                this.startCounter(this.count)
              }
            }
          })
        break;
      case titleKinds.PEOPLE:
        this.store.select(selectPeopleMainCounterState)
          .pipe(first())
          .subscribe(data => {
            if (data.active) {
              const diff = Math.round((Date.now() - data.time) / 1000);
              if (diff < data.current && diff > 0) {
                this.count = data.current - diff;
                this.startCounter(this.count)
              }
            }

          })
        break;
      case titleKinds.PRIVATE_GROUP:
        if (this.convID) {
          this.store.select(selectGroupPrivateCounterStateByID(this.convID))
            .pipe(first())
            .subscribe(data => {
              if (data && data.active) {
                const diff = Math.round((Date.now() - data.time) / 1000);
                if (diff < data.current && diff > 0) {
                  this.count = data.current - diff;
                  this.startCounter(this.count)
                }
              }
            })
        }
        break;
      case titleKinds.PRIVATE_CONVERSATION:
        if (this.convID) {
          this.store.select(selectPeoplePrivateCounterStateByID(this.convID))
            .pipe(first())
            .subscribe(data => {
              if (data && data.active) {
                const diff = Math.round((Date.now() - data.time) / 1000);
                if (diff < data.current && diff > 0) {
                  this.count = data.current - diff;
                  this.startCounter(this.count)
                }
              }
            })
        }
        break;
    }
  }

  goBack() {
    this.location.back()
  }

  update() {
    this.updateContent.emit(this.kind);
    if (this.blockBtn)
      this.startCounter(this.count)
  }

  add() {
    this.addGroup.emit()
  }

  startCounter(start: number) {
    this.counterIsActive = true;
    this.interval = setInterval(() => {
      this.count--;
      if (this.count === 0 && this.interval) {
        clearInterval(this.interval)
        this.counterIsActive = false;
        this.count = 60;
      };
    }, 1000)

  }

  delete() {
    this.deleteConversation.emit(this.convID)
  }

  ngOnDestroy() {
    this.saveCounterValue()
    if (this.interval)
      clearInterval(this.interval)

  }
  saveCounterValue() {
    if (this.counterIsActive) {
      switch (this.kind) {
        case titleKinds.GROUPS:
          this.store.dispatch(setGroupCounter({ counterType: 'main', time: Date.now(), current: this.count, active: this.counterIsActive }));
          break;
        case titleKinds.PEOPLE:
          this.store.dispatch(setPeopleCounter({ counterType: 'main', time: Date.now(), current: this.count, active: this.counterIsActive }));
          break;
        case titleKinds.PRIVATE_GROUP:

          if (this.convID)
            this.store.dispatch(setGroupCounter({ counterType: 'private', time: Date.now(), active: this.counterIsActive, current: this.count, id: this.convID }));
          break;
        case titleKinds.PRIVATE_CONVERSATION:
          if (this.convID)
            this.store.dispatch(setPeopleCounter({ counterType: 'private', time: Date.now(), active: this.counterIsActive, current: this.count, id: this.convID }));
          break;
      }
    }
  }
}
