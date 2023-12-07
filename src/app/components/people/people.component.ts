import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleControlsComponent } from '../title-controls/title-controls.component';
import { Router, RouterModule } from '@angular/router';
import { titleKinds } from 'app/utils/enums/title-controls';
import { Store } from '@ngrx/store';
import { createConversation, createConversationSuccess, getPeople, getPeopleAndConversations } from 'app/store/actions/people.action';
import { selectConversations, selectPeopleData, selectSingleConversation, selectUsers } from 'app/store/selectors/people.selectors';
import { ISingleUserConversation, IUser } from 'app/models/conversations.model';
import { Subscription, map } from 'rxjs';
import { ErrorHandlingService, IErrorHandle } from 'app/services/error-handling.service';
import { RequestStatus } from 'app/utils/enums/request-status';
import { IState } from 'app/store/models/store.model';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ChatPartnersPipe } from 'app/pipes/chat-partners.pipe';



@Component({
  selector: 'app-people',
  standalone: true,
  imports: [CommonModule,
    TitleControlsComponent,
    RouterModule,
    ToastModule,
    ChatPartnersPipe],
  providers: [ErrorHandlingService, MessageService],
  templateUrl: './people.component.html',
  styleUrl: './people.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PeopleComponent {


  people = this.store.select(selectUsers)

  myOpps: string[] = []
  allMyConvSub: Subscription | undefined;
  singleConvSub: Subscription | undefined;
  errorSub: Subscription | undefined;
  errorData: IErrorHandle | undefined;
  convID: string | undefined;

  filtered = false;

  constructor(private store: Store,
    private errorHandlingService: ErrorHandlingService,
    private router: Router,
    private messageService: MessageService,) {

  }
  ngOnInit() {
    this.allMyConvSub = this.store.select(selectConversations).subscribe(data => {
      this.myOpps = data.map(d => d.companionID)
    })
    this.errorSub = this.errorHandlingService.errorHandling$
      .subscribe((errorData: IErrorHandle) => this.errorData = errorData);

    //this.updateContent()

  }


  updateContent() {
    this.store.dispatch(getPeopleAndConversations())
  }

  openConversation(user: IUser) {
    console.log('this.myOpps :>> ', this.myOpps);
    this.store.dispatch(createConversation({ companion: user.uid }))
    if (this.errorData?.status !== RequestStatus.ERROR || this.errorData?.errorType === "DuplicationNotAllowedException") {
      this.singleConvSub = this.store.select(selectSingleConversation(user.uid))
        .subscribe(data => {
          if (data) {
            console.log('data inside singleConvSubscr:>> ', data);
            this.router.navigate([`/conversation/${data.id}`])
          }
        })

    } else {
      console.log('this.errorData :>> ', this.errorData);
      this.showError(this.errorData.errorMessage || "Something went wrong")
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
