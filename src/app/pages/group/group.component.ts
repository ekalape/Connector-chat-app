import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TitleControlsComponent } from 'app/components/title-controls/title-controls.component';
import { titleKinds } from 'app/utils/enums/title-controls';
import { ISingleGroup, ISingleMessage, IUser } from 'app/models/conversations.model';
import { Store } from '@ngrx/store';
import {
  selectFirstLoadedGroups,
  selectGroupLoadingState,
  selectPrivateGroupErrorState,
  selectSingleGroup,
  selectSingleGroupDialog
} from 'app/store/selectors/group.selectors';
import { Observable, Subscription, first, map } from 'rxjs';
import { ChatContainerComponent } from 'app/components/chat-container/chat-container.component';
import { deleteGroupPrivate, getAllGroups, getGroupMessages, sendGroupMessage } from 'app/store/actions/group.action';
import { MessageComponent } from 'app/components/message/message.component';
import { RequestStatus } from 'app/utils/enums/request-status';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { selectUsers } from 'app/store/selectors/people.selectors';
import { LoadingOverlayComponent } from 'app/components/loading-overlay/loading-overlay.component';
import { ConfirmDialogComponent } from 'app/components/confirm-dialog/confirm-dialog.component';
import { Pathes } from 'app/utils/enums/pathes';


@Component({
  selector: 'app-group',
  standalone: true,
  imports: [CommonModule, TitleControlsComponent,
    ChatContainerComponent,
    ToastModule,
    MessageComponent,
    ConfirmDialogComponent,
    LoadingOverlayComponent],
  providers: [MessageService],
  templateUrl: './group.component.html',
  styleUrl: './group.component.scss'
})
export class GroupComponent implements OnInit, OnDestroy {

  groupId: string | null;
  titleKinds = titleKinds;
  RequestStatus = RequestStatus

  groupData: Observable<ISingleGroup | undefined> | undefined;
  groupMessages: Observable<ISingleMessage[]> | undefined;

  allgroupUsers: IUser[] | undefined

  errorSUB: Subscription | undefined;

  errorData = this.store.select(selectPrivateGroupErrorState);
  allUsersSUB: Subscription | undefined;

  blockBtn = false;
  showConfirm = false;

  isLoading = this.store.select(selectGroupLoadingState)

  constructor(private route: ActivatedRoute,
    private router: Router,
    private store: Store,
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
    this.errorSUB = this.errorData.subscribe(data => {
      if (data.status === RequestStatus.ERROR) {
        this.showError(data.message || "Something went wrong");
        if (data.type === 'InvalidIDException') {
          setTimeout(() => { this.router.navigate([Pathes.HOME]) }, 800); // --> timeout is need to have time for error message

        }
      }
      if (data.status === RequestStatus.SUCCESS) {
        if (data.type === "update")
          this.blockBtn = true
        else if (data.type === "delete") {
          this.router.navigate([Pathes.HOME])
        }
        else if (data.type === "send") {
          this.updateGroupMessages()
        }
      }
    })

    this.allUsersSUB == this.store.select(selectUsers).subscribe(
      data => {
        this.allgroupUsers = data
      }
    )

    if (this.groupId) {
      this.updateGroupMessages()

      this.groupData = this.store.select(selectSingleGroup(this.groupId));
      this.groupMessages = this.store.select(selectSingleGroupDialog(this.groupId))
        .pipe(
          map((messages) => {
            if (messages && Array.isArray(messages))
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

  onDelete() {
    this.showConfirm = true;
  }
  onDeleteConfirmed() {
    if (this.groupId) {
      this.store.dispatch(deleteGroupPrivate({ groupId: this.groupId }));
    }
    this.showConfirm = false;
  }

  getAuthorOfMessage(message: ISingleMessage): string {
    const user = this.allgroupUsers?.find(us => us.uid === message.authorID);
    return user ? user.name : 'Unknown user';
  }
  showError(errorMessage: string | undefined) {
    this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: errorMessage || "Something went wrong, try again" });

  }
  ngOnDestroy() {
    this.errorSUB?.unsubscribe()
  }

}


