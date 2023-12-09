import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageComponent } from 'app/components/message/message.component';
import { titleKinds } from 'app/utils/enums/title-controls';
import { TitleControlsComponent } from 'app/components/title-controls/title-controls.component';
import { ChatContainerComponent } from 'app/components/chat-container/chat-container.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectFirstLoadedPeople, selectMessagesByConversationId, selectSingleUser } from 'app/store/selectors/people.selectors';
import { Observable, Subscription, first, map } from 'rxjs';
import { ISingleMessage, IUser } from 'app/models/conversations.model';
import { deleteConversation, getPeopleAndConversations, getPrivateMessages, sendPrivateMessage } from 'app/store/actions/people.action';
import { Pathes } from 'app/utils/enums/pathes';
import { ErrorHandlingService, IErrorHandle } from 'app/services/error-handling.service';
import { RequestStatus } from 'app/utils/enums/request-status';

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
  errorSub: Subscription | undefined;
  errors: IErrorHandle | undefined;

  constructor(private route: ActivatedRoute,
    private store: Store,
    private router: Router,
    private errorHandlingService: ErrorHandlingService) {
    this.convID = this.route.snapshot.paramMap.get('convID');
    console.log('this.convID :>> ', this.convID);
    /*      if (this.convID)
         this.updatePrivateMessages() */
  }

  ngOnInit() {
    this.errorSub = this.errorHandlingService.errorHandling$
      .subscribe(data => {
        //  console.log("errors: ", data)
        this.errors = data
      })
    this.store.select(selectFirstLoadedPeople).pipe(
      first(),
    )
      .subscribe(loaded => {
        if (!loaded) {
          this.store.dispatch(getPeopleAndConversations());

        }
      })
    if (this.convID) {

      this.updatePrivateMessages();


      this.opponent = this.store.select(selectSingleUser(this.convID));
      this.privateMessages = this.store.select(selectMessagesByConversationId(this.convID))
        .pipe(
          map(messages => {
            if (messages)
              return [...messages]?.sort((a, b) => Number(b.createdAt) - Number(a.createdAt));
            return []
          }))
    }

  }

  /*   ngAfterContentInit() {
      this.updatePrivateMessages();

    } */
  sendMessage(message: string) {
    if (this.convID) { this.store.dispatch(sendPrivateMessage({ conversationID: this.convID, message })) }
  }
  updatePrivateMessages() {
    if (this.convID) {
      console.log('conversationID :>> ', this.convID);
      this.store.dispatch(getPrivateMessages({ conversationID: this.convID }))
    }
  }
  deleteConversation(conversationID: string) {
    this.store.dispatch(deleteConversation({ conversationID }));
    this.router.navigate([Pathes.HOME])
  }
  ngOnDestroy() {
    this.errorHandlingService.reset()
    this.errorSub?.unsubscribe()
  }

}
