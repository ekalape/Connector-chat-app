import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleControlsComponent } from '../../../components/title-controls/title-controls.component';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { createConversation, getPeopleAndConversations } from 'app/store/actions/people.action';
import {
  selectFirstLoadedPeople,
  selectMainPeopleErrorState,
  selectMyConversations, selectPeopleLoadingState,
  selectUsers
} from 'app/store/selectors/people.selectors';
import { ISingleUserConversation, IUser } from 'app/models/conversations.model';
import { Subscription, first } from 'rxjs';
import { RequestStatus } from 'app/utils/enums/request-status';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ChatPartnersPipe } from 'app/pipes/chat-partners.pipe';
import { LoadingOverlayComponent } from 'app/components/loading-overlay/loading-overlay.component';
import { IErrorState } from 'app/store/models/store.model';
import { titleKinds } from 'app/utils/enums/title-controls';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ConversationFilterPipe } from 'app/pipes/conversation-filter.pipe';
import { InputTextModule } from 'primeng/inputtext';



@Component({
  selector: 'app-people',
  standalone: true,
  imports: [CommonModule,
    TitleControlsComponent,
    RouterModule,
    ToastModule,
    ReactiveFormsModule,
    ChatPartnersPipe,
    ConversationFilterPipe,
    InputTextModule,
    LoadingOverlayComponent],
  providers: [MessageService],
  templateUrl: './people.component.html',
  styleUrl: './people.component.scss',

})
export class PeopleComponent implements OnInit, OnDestroy {

  RequestStatus = RequestStatus;
  titleKinds = titleKinds
  blockBtn = false;

  filterWord = "";

  people = this.store.select(selectUsers);
  errorState = this.store.select(selectMainPeopleErrorState);
  myConvs = this.store.select(selectMyConversations);

  myConvsSUB: Subscription | undefined;
  errorsSUB: Subscription | undefined;
  loadingSUB: Subscription | undefined;

  myconvsIDs: ISingleUserConversation[] | undefined;
  myOpps: string[] = [];

  userToChatID: string | undefined;

  peopleFilterInput = new FormControl("")

  errorData: IErrorState | undefined;

  isLoading = false;
  filtered = false;

  constructor(private store: Store,
    private router: Router,
    private messageService: MessageService,) {

  }
  ngOnInit() {
    this.loadingSUB = this.store.select(selectPeopleLoadingState).pipe(
    ).subscribe(data => {
      this.isLoading = data
    })

    this.myConvsSUB = this.myConvs.subscribe(data => {
      this.myOpps = data.map(x => x.companionID);
      this.myconvsIDs = data
    })

    this.errorsSUB = this.errorState
      .subscribe((data: IErrorState) => {
        if (data.status === RequestStatus.ERROR) {
          this.showError(data.message || "Something went wrong");
          this.userToChatID = undefined;

        }
        else if (data.status === RequestStatus.SUCCESS) {
          if (data.type === "create") {
            const id = this.myconvsIDs?.find(c => c.companionID === this.userToChatID)?.id;
            if (id) this.router.navigate([`/conversation/${id}`])
          }
          else if (data.type === "update") {
            this.blockBtn = true
          }
        }
      })


    this.store.select(selectFirstLoadedPeople).pipe(
      first())
      .subscribe(loaded => {
        if (!loaded) {
          this.updateContent();
        }
      })
  }

  updateContent() {
    this.store.dispatch(getPeopleAndConversations())
  }

  openConversation(user: IUser) {
    this.userToChatID = user.uid;

    if (this.myOpps.includes(user.uid)) {
      const convID = this.myconvsIDs?.find(x => x.companionID === user.uid)?.id;
      this.router.navigate([`/conversation/${convID}`])

    } else {
      this.store.dispatch(createConversation({ companion: user.uid }))

    }

  }

  showError(errorMessage: string | undefined) {
    this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: errorMessage || "Something went wrong, try again" });

  }
  filterPeople() {

    this.filterWord = this.peopleFilterInput.value || ""
  }

  chooseFilter(opt: number) {
    switch (opt) {
      case 0:
        this.filtered = false;
        break;
      case 1:
        this.filtered = true;
        break;
      default: return;
    }

  }

  ngOnDestroy() {
    this.myConvsSUB?.unsubscribe();
    this.errorsSUB?.unsubscribe();
    this.loadingSUB?.unsubscribe()
  }
}
