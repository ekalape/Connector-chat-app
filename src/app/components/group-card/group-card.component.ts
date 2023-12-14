import { Component, Input, Output, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ISingleGroup } from 'app/models/conversations.model';
import { ButtonModule } from 'primeng/button';
import { Store } from '@ngrx/store';
import { selectMyID } from 'app/store/selectors/profile.selectors';
import { Subscription } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-group-card',
  standalone: true,
  imports: [CommonModule, ButtonModule, RouterModule],
  templateUrl: './group-card.component.html',
  styleUrl: './group-card.component.scss'
})
export class GroupCardComponent implements OnInit, OnDestroy {

  @Input() groupData: ISingleGroup | undefined;

  @Output() deleteGroup = new EventEmitter<string>()


  mine: boolean = false;
  myData = this.store.select(selectMyID);
  sub: Subscription | undefined

  constructor(private store: Store) {
  }

  ngOnInit() {
    this.sub = this.myData.subscribe(data => {
      if (data.id === this.groupData?.createdBy) this.mine = true;
    })
  }

  delete(event: Event) {
    if (this.groupData?.id) {
      event.preventDefault();
      this.deleteGroup.emit(this.groupData.id)
    }
  }

  ngOnDestroy() {
    this.sub?.unsubscribe()
  }

}
