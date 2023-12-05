import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ISingleGroup } from 'app/models/conversations.model';
import { ButtonModule } from 'primeng/button';
import { Store } from '@ngrx/store';
import { selectMyID, selectProfileData } from 'app/store/selectors/profile.selectors';
import { Subscription, map, take } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-group-card',
  standalone: true,
  imports: [CommonModule, ButtonModule, RouterModule],
  templateUrl: './group-card.component.html',
  styleUrl: './group-card.component.scss'
})
export class GroupCardComponent {

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
    console.log('event :>> ', event);
    if (this.groupData?.id) {
      event.preventDefault();
      this.deleteGroup.emit(this.groupData.id)
      console.log("delete group", this.groupData?.id);
    }
  }

  ngOnDestroy() {
    this.sub?.unsubscribe()
  }


}
