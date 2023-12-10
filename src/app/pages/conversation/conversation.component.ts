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

import { RequestStatus } from 'app/utils/enums/request-status';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { selectErrorState } from 'app/store/selectors/error.selectors';
import { resetErrorAction, setMainLoadingState } from 'app/store/actions/error-handle.action';
import { LoadingOverlayComponent } from 'app/components/loading-overlay/loading-overlay.component';
import { IErrorHandle } from 'app/store/models/store.model';

@Component({
  selector: 'app-conversation',
  standalone: true,
  imports: [CommonModule,
    TitleControlsComponent,
    ChatContainerComponent,
    MessageComponent,
    ToastModule,
    LoadingOverlayComponent],
  templateUrl: './conversation.component.html',
  providers: [MessageService],
  styleUrl: './conversation.component.scss'
})
export class ConversationComponent {

  titleKinds = titleKinds
  RequestStatus = RequestStatus
  convID: string | null;
  errorState = this.store.select(selectErrorState);
  opponent: Observable<IUser | undefined> | undefined;
  privateMessages: Observable<ISingleMessage[] | undefined> | undefined;
  errorSub: Subscription | undefined;
  errors: IErrorHandle | undefined;

  constructor(private route: ActivatedRoute,
    private store: Store,
    private router: Router,
    private messageService: MessageService) {
    this.convID = this.route.snapshot.paramMap.get('convID');
  }

  ngOnInit() {
    this.errorSub = this.errorState.subscribe((data: IErrorHandle) => {
      console.log("data", data);
      if (data.status === RequestStatus.ERROR) {
        this.showError(data.errorMessage || "Something went wrong")
      }
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

  sendMessage(message: string) {
    if (this.convID) { this.store.dispatch(sendPrivateMessage({ conversationID: this.convID, message })) }
  }
  updatePrivateMessages() {
    this.store.dispatch(setMainLoadingState({ isLoading: true }))
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
    this.errorSub?.unsubscribe()
  }

  showError(errorMessage: string | undefined) {
    this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: errorMessage || "Something went wrong, try again" });

  }
}
