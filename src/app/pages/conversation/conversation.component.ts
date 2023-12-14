import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageComponent } from 'app/components/message/message.component';
import { titleKinds } from 'app/utils/enums/title-controls';
import { TitleControlsComponent } from 'app/components/title-controls/title-controls.component';
import { ChatContainerComponent } from 'app/components/chat-container/chat-container.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  selectFirstLoadedPeople, selectMessagesByConversationId,
  selectPeopleLoadingState,
  selectPrivatePeopleErrorState,
  selectUserByConversationID
} from 'app/store/selectors/people.selectors';
import { Observable, Subscription, first, map } from 'rxjs';
import { ISingleMessage, IUser } from 'app/models/conversations.model';
import { deleteConversation, getPeopleAndConversations, getPrivateMessages, sendPrivateMessage } from 'app/store/actions/people.action';
import { Pathes } from 'app/utils/enums/pathes';
import { RequestStatus } from 'app/utils/enums/request-status';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { LoadingOverlayComponent } from 'app/components/loading-overlay/loading-overlay.component';
import { ConfirmDialogComponent } from 'app/components/confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'app-conversation',
  standalone: true,
  imports: [CommonModule,
    TitleControlsComponent,
    ChatContainerComponent,
    MessageComponent,
    ToastModule,
    ConfirmDialogComponent,
    LoadingOverlayComponent],
  templateUrl: './conversation.component.html',
  providers: [MessageService],
  styleUrl: './conversation.component.scss'
})
export class ConversationComponent implements OnInit, OnDestroy {

  titleKinds = titleKinds
  RequestStatus = RequestStatus

  showConfirm = false;

  errorSUB: Subscription | undefined;

  convID: string | null;
  blockUpdateBtn = false
  errorData = this.store.select(selectPrivatePeopleErrorState);
  isLoading = this.store.select(selectPeopleLoadingState)

  opponent: Observable<IUser | undefined> | undefined;
  privateMessages: Observable<ISingleMessage[] | undefined> | undefined;


  constructor(private route: ActivatedRoute,
    private store: Store,
    private router: Router,
    private messageService: MessageService) {
    this.convID = this.route.snapshot.paramMap.get('convID');
  }

  ngOnInit() {
    this.errorSUB = this.errorData.subscribe(data => {
      if (data.status === RequestStatus.ERROR) {
        this.showError(data.message || "Something went wrong")
        if (data.type === 'InvalidIDException') {
          setTimeout(() => { this.router.navigate([Pathes.HOME]) }, 800); // --> timeout is need to have time for error message
        }
      }
      if (data.status === RequestStatus.SUCCESS) {
        if (data.type === "delete") {
          this.router.navigate([Pathes.HOME])
        }
        else if (data.type === "update") { this.blockUpdateBtn = true; }
        else if (data.type === "send") { this.updatePrivateMessages(); }
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

      this.opponent = this.store.select(selectUserByConversationID(this.convID));
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
    if (this.convID) {
      this.store.dispatch(sendPrivateMessage({ conversationID: this.convID, message }))
    }
  }

  updatePrivateMessages() {
    if (this.convID) {
      this.store.dispatch(getPrivateMessages({ conversationID: this.convID }))
    }

  }
  deleteConversation() {
    this.showConfirm = true;

  }

  deleteConfirmed() {
    if (this.convID) {
      this.store.dispatch(deleteConversation({ conversationID: this.convID }));
      this.showConfirm = false
    }
  }


  showError(errorMessage: string | undefined) {
    this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: errorMessage || "Something went wrong, try again" });

  }

  ngOnDestroy() {
    this.errorSUB?.unsubscribe()
  }
}
