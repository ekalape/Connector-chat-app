import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageComponent } from 'app/components/message/message.component';
import { titleKinds } from 'app/utils/enums/title-controls';
import { TitleControlsComponent } from 'app/components/title-controls/title-controls.component';
import { ChatContainerComponent } from 'app/components/chat-container/chat-container.component';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectMessagesByConversationId, selectSingleUser } from 'app/store/selectors/people.selectors';
import { Observable } from 'rxjs';
import { ISingleMessage, IUser } from 'app/models/conversations.model';
import { getPrivateMessages, sendPrivateMessage } from 'app/store/actions/people.action';

@Component({
  selector: 'app-conversation',
  standalone: true,
  imports: [CommonModule, TitleControlsComponent, ChatContainerComponent, MessageComponent],
  templateUrl: './conversation.component.html',
  styleUrl: './conversation.component.scss'
})
export class ConversationComponent {

  titleKinds = titleKinds
  convID: string | null;

  opponent: Observable<IUser | undefined> | undefined;
  privateMessages: Observable<ISingleMessage[] | undefined> | undefined;


  constructor(private route: ActivatedRoute, private store: Store) {
    this.convID = this.route.snapshot.paramMap.get('convID');
  }

  ngOnInit() {
    if (this.convID) {
      this.opponent = this.store.select(selectSingleUser(this.convID));
      this.privateMessages = this.store.select(selectMessagesByConversationId(this.convID))
    }
    this.updatePrivateMessages()
    //TODO if the page was refreshed need to request by convId?
  }

  sendMessage(message: string) {
    if (this.convID) { this.store.dispatch(sendPrivateMessage({ conversationID: this.convID, message })) }
  }
  updatePrivateMessages() {
    if (this.convID) { this.store.dispatch(getPrivateMessages({ conversationID: this.convID })) }
  }

}
