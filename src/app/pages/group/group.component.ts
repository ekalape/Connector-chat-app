import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TitleControlsComponent } from 'app/components/title-controls/title-controls.component';
import { titleKinds } from 'app/utils/enums/title-controls';
import { IGroupMessage, ISingleGroup, ISingleMessage } from 'app/models/conversations.model';
import { Store } from '@ngrx/store';
import { selectGroupMessages, selectSingleGroup } from 'app/store/selectors/group.selectors';
import { Observable, tap } from 'rxjs';
import { ChatContainerComponent } from 'app/components/chat-container/chat-container.component';
import { getGroupMessages, sendGroupMessages } from 'app/store/actions/group.action';
import { MessageComponent } from 'app/components/message/message.component';

@Component({
  selector: 'app-group',
  standalone: true,
  imports: [CommonModule, TitleControlsComponent, ChatContainerComponent, MessageComponent],
  templateUrl: './group.component.html',
  styleUrl: './group.component.scss'
})
export class GroupComponent {

  groupId: string | null;
  titleKinds = titleKinds;

  groupData: Observable<ISingleGroup | undefined> | undefined;
  groupMessages: Observable<ISingleMessage[]> | undefined;

  constructor(private route: ActivatedRoute, private store: Store) {
    this.groupId = this.route.snapshot.paramMap.get('groupId');
  }

  ngOnInit() {
    console.log('groupId :>> ', this.groupId);
    if (this.groupId) {
      this.groupData = this.store.select(selectSingleGroup(this.groupId));
      this.groupMessages = this.store.select(selectGroupMessages(this.groupId)).pipe(tap((res) => console.log("inside group component", res)))

    }
    console.log("messages ", this.groupMessages);


  }
  updateGroupMessages() {
    if (this.groupId)
      this.store.dispatch(getGroupMessages({ groupId: this.groupId }))
  }

  sendMessage(message: string) {
    if (this.groupId && message.trim()) {
      this.store.dispatch(sendGroupMessages({ groupId: this.groupId, message }))
      console.log('message :>> ', message);
    }

  }

}
