import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TitleControlsComponent } from 'app/components/title-controls/title-controls.component';
import { titleKinds } from 'app/utils/enums/title-controls';
import { ISingleGroup, ISingleMessage } from 'app/models/conversations.model';
import { Store } from '@ngrx/store';
import { selectFirstLoadedGroups, selectGroupMessages, selectSingleGroup } from 'app/store/selectors/group.selectors';
import { Observable, Subscription, first, map } from 'rxjs';
import { ChatContainerComponent } from 'app/components/chat-container/chat-container.component';
import { getAllGroups, getGroupMessages, sendGroupMessage } from 'app/store/actions/group.action';
import { MessageComponent } from 'app/components/message/message.component';
import { RequestStatus } from 'app/utils/enums/request-status';
import { selectErrorState } from 'app/store/selectors/error.selectors';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { IErrorHandle } from 'app/store/models/store.model';


@Component({
  selector: 'app-group',
  standalone: true,
  imports: [CommonModule, TitleControlsComponent,
    ChatContainerComponent,
    ToastModule,
    MessageComponent],
  providers: [MessageService],
  templateUrl: './group.component.html',
  styleUrl: './group.component.scss'
})
export class GroupComponent {

  groupId: string | null;
  titleKinds = titleKinds;
  RequestStatus = RequestStatus
  errorState = this.store.select(selectErrorState);
  groupData: Observable<ISingleGroup | undefined> | undefined;
  groupMessages: Observable<ISingleMessage[]> | undefined;
  errorSub: Subscription | undefined;

  constructor(private route: ActivatedRoute, private store: Store,
    private messageService: MessageService) {
    this.groupId = this.route.snapshot.paramMap.get('groupId');
  }

  ngOnInit() {
    this.store.select(selectFirstLoadedGroups).pipe(
      first(),
    )
      .subscribe(loaded => {
        if (!loaded) {
          this.store.dispatch(getAllGroups())

        }
      })
    this.errorSub = this.errorState.subscribe((data: IErrorHandle) => {
      if (data.status === RequestStatus.ERROR) {
        this.showError(data.errorMessage || "Something went wrong")
      }
    })

    if (this.groupId) {
      this.updateGroupMessages()

      this.groupData = this.store.select(selectSingleGroup(this.groupId));
      this.groupMessages = this.store.select(selectGroupMessages(this.groupId))
        .pipe(
          map(messages => {
            if (messages)
              return [...messages]?.sort((a, b) => Number(b.createdAt) - Number(a.createdAt));
            return []
          }))
    }

  }

  updateGroupMessages() {
    if (this.groupId)
      this.store.dispatch(getGroupMessages({ groupId: this.groupId }))
  }

  sendMessage(message: string) {
    if (this.groupId && message.trim()) {
      this.store.dispatch(sendGroupMessage({ groupId: this.groupId, message }))
    }
  }
  showError(errorMessage: string | undefined) {
    this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: errorMessage || "Something went wrong, try again" });

  }

}
