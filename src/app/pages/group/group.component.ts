import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TitleControlsComponent } from 'app/components/title-controls/title-controls.component';
import { titleKinds } from 'app/utils/enums/title-controls';
import { ISingleGroup, ISingleMessage } from 'app/models/conversations.model';
import { Store } from '@ngrx/store';
import { selectGroupMessages, selectSingleGroup } from 'app/store/selectors/group.selectors';
import { Observable } from 'rxjs';
import { ChatContainerComponent } from 'app/components/chat-container/chat-container.component';
import { getGroupMessages } from 'app/store/actions/group.action';
import { MessageComponent } from 'app/components/message/message.component';

@Component({
  selector: 'app-group',
  standalone: true,
  imports: [CommonModule, TitleControlsComponent, ChatContainerComponent, MessageComponent],
  templateUrl: './group.component.html',
  styleUrl: './group.component.scss'
})
export class GroupComponent {

  groupId: string | null = "";
  titleKinds = titleKinds;

  groupData: Observable<ISingleGroup | undefined> | undefined;
  groupMessages = this.store.select(selectGroupMessages(this.groupId))

  constructor(private route: ActivatedRoute, private store: Store) {
    this.groupId = this.route.snapshot.paramMap.get('groupId');
  }

  ngOnInit() {
    console.log('groupId :>> ', this.groupId);
    if (this.groupId)
      this.groupData = this.store.select(selectSingleGroup(this.groupId));
    //this.groupMessages
    console.log("messages ", this.groupMessages);

  }
  updateGroupMessages(event: string) {
    console.log('event :>> ', event);

    if (this.groupId)
      this.store.dispatch(getGroupMessages({ groupId: this.groupId }))
  }

  sendMessage(message: string) {
    console.log('message :>> ', message);

  }

}
