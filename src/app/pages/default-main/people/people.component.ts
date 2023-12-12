import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleControlsComponent } from '../../../components/title-controls/title-controls.component';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { createConversation, getPeopleAndConversations } from 'app/store/actions/people.action';
import {
  selectConversationByCompanion, selectFirstLoadedPeople,
  selectMainPeopleErrorState,
  selectMyConversations, selectPeopleLoadingState,
  selectUsers
} from 'app/store/selectors/people.selectors';
import { IUser } from 'app/models/conversations.model';
import { first, tap } from 'rxjs';
import { RequestStatus } from 'app/utils/enums/request-status';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ChatPartnersPipe } from 'app/pipes/chat-partners.pipe';
import { LoadingOverlayComponent } from 'app/components/loading-overlay/loading-overlay.component';
import { IErrorState } from 'app/store/models/store.model';
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
  providers: [MessageService],
  templateUrl: './people.component.html',
  styleUrl: './people.component.scss',

})
export class PeopleComponent {

  RequestStatus = RequestStatus;
  titleKinds = titleKinds

  people = this.store.select(selectUsers);
  errorState = this.store.select(selectMainPeopleErrorState);
  myConvs = this.store.select(selectMyConversations);

  myOpps: string[] = [];
  convID: string | undefined;

  errorData: IErrorState | undefined;

  isLoading = this.store.select(selectPeopleLoadingState);
  filtered = false;

  constructor(private store: Store,
    private router: Router,
    private messageService: MessageService,) {

  }
  ngOnInit() {
    this.myConvs.pipe(
      tap(data => { this.myOpps = data.map(x => x.companionID) })
    )
    this.errorState.pipe(
      first()
    ).subscribe((data: IErrorState) => {
      if (data.status === RequestStatus.ERROR) {
        this.showError(data.message || "Something went wrong")
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
    if (this.myOpps.includes(user.uid)) {
      this.myConvs.pipe(tap(
        data => {
          this.convID = data.find(x => x.companionID === user.uid)?.id;
          this.router.navigate([`/conversation/${this.convID}`])
        }
      ))
    } else {
      this.store.dispatch(createConversation({ companion: user.uid }))
      if (this.errorData?.status === RequestStatus.SUCCESS) {
        this.store.select(selectConversationByCompanion(user.uid))
          .subscribe(data => {
            if (data) this.router.navigate([`/conversation/${data}`]);
          }

          )

      }
    }

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
