import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleControlsComponent } from '../../../components/title-controls/title-controls.component';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { createConversation, getPeopleAndConversations, getPrivateMessages } from 'app/store/actions/people.action';
import { selectConversations, selectFirstLoadedPeople, selectSingleConversation, selectUsers } from 'app/store/selectors/people.selectors';
import { ISingleUserConversation, IUser } from 'app/models/conversations.model';
import { Observable, Subscription, first, tap } from 'rxjs';
import { ErrorHandlingService } from 'app/services/error-handling.service';
import { RequestStatus } from 'app/utils/enums/request-status';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ChatPartnersPipe } from 'app/pipes/chat-partners.pipe';
import { selectErrorState } from 'app/store/selectors/error.selectors';
import { resetErrorAction, setMainLoadingState } from 'app/store/actions/error-handle.action';
import { LoadingOverlayComponent } from 'app/components/loading-overlay/loading-overlay.component';
import { IErrorHandle } from 'app/store/models/store.model';
import { titleKinds } from 'app/utils/enums/title-controls';



@Component({
  selector: 'app-people',
  standalone: true,
  imports: [CommonModule,
    TitleControlsComponent,
    RouterModule,
    ToastModule,
    ChatPartnersPipe,
    LoadingOverlayComponent],
  providers: [ErrorHandlingService, MessageService],
  templateUrl: './people.component.html',
  styleUrl: './people.component.scss',

})
export class PeopleComponent {

  RequestStatus = RequestStatus;
  titleKinds = titleKinds

  people = this.store.select(selectUsers);
  errorState = this.store.select(selectErrorState);

  myOpps: string[] = [];
  myConvs: ISingleUserConversation[] = [];
  allMyConvSub: Subscription | undefined;
  singleConvSub: Subscription | undefined;
  errorSub: Subscription | undefined;
  errorData: RequestStatus | undefined;
  convID: string | undefined;

  isLoading = false;


  filtered = false;

  constructor(private store: Store,
    private errorHandlingService: ErrorHandlingService,
    private router: Router,
    private messageService: MessageService,) {

  }
  ngOnInit() {
    this.allMyConvSub = this.store.select(selectConversations).subscribe(data => {
      this.myOpps = data.map(d => d.companionID);
      this.myConvs = data
    })
    this.errorSub = this.errorState.subscribe((data: IErrorHandle) => {
      this.errorData = data.status;
      if (data.status === RequestStatus.ERROR) {
        this.showError(data.errorMessage || "Something went wrong")
      }
    })


    this.store.select(selectFirstLoadedPeople).pipe(
      first(),
    )
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
    if (this.myOpps.includes(user.uid)) {
      const convID = this.myConvs.find(c => c.companionID === user.uid)?.id
      this.router.navigate([`/conversation/${convID}`])
    }
    else {
      this.store.dispatch(setMainLoadingState({ isLoading: true }))
      this.store.dispatch(createConversation({ companion: user.uid }))

      if (this.errorData !== RequestStatus.ERROR) {
        this.singleConvSub = this.store.select(selectSingleConversation(user.uid))
          .subscribe(data => {
            if (data) {
              console.log('coversationID for navigation:>> ', data.id);
              this.router.navigate([`/conversation/${data.id}`]);
            }
          })
      }
    }

  }

  ngOnDestroy() {
    this.allMyConvSub?.unsubscribe()
    this.errorSub?.unsubscribe()
    this.singleConvSub?.unsubscribe();
    this.errorHandlingService.reset()
  }
  showError(errorMessage: string | undefined) {
    this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: errorMessage || "Something went wrong, try again" });

    //this.store.dispatch(resetErrorAction())
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
}
