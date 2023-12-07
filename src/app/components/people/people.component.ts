import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleControlsComponent } from '../title-controls/title-controls.component';
import { Router, RouterModule } from '@angular/router';
import { titleKinds } from 'app/utils/enums/title-controls';
import { Store } from '@ngrx/store';
import { createConversation, getPeople, getPeopleAndConversations } from 'app/store/actions/people.action';
import { selectConversations, selectPeopleData, selectSingleConversation, selectUsers } from 'app/store/selectors/people.selectors';
import { IUser } from 'app/models/conversations.model';
import { Subscription } from 'rxjs';
import { ErrorHandlingService, IErrorHandle } from 'app/services/error-handling.service';
import { RequestStatus } from 'app/utils/enums/request-status';


@Component({
  selector: 'app-people',
  standalone: true,
  imports: [CommonModule,
    TitleControlsComponent,
    RouterModule],
  templateUrl: './people.component.html',
  styleUrl: './people.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PeopleComponent {


  people = this.store.select(selectUsers);

  myOpps: string[] = []
  allMyConvSub: Subscription | undefined;
  singleConvSub: Subscription | undefined;
  errorSub: Subscription | undefined;
  errorData: IErrorHandle | undefined;
  convID: string | undefined;

  constructor(private store: Store,
    private errorHandlingService: ErrorHandlingService,
    private router: Router) {

  }
  ngOnInit() {
    this.allMyConvSub = this.store.select(selectConversations).subscribe(data => {
      this.myOpps = data.map(d => d.companionID)
    })
    this.errorSub = this.errorHandlingService.errorHandling$
      .subscribe((errorData: IErrorHandle) => this.errorData = errorData)

  }


  updateContent(event: titleKinds) {
    console.log("update people", event);
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

    } else console.log('this.errorData :>> ', this.errorData);


    //create conv. If (error) showEror, else router.navigate('/conversation', convID)
  }



  ngOnDestroy() {
    this.allMyConvSub?.unsubscribe()
    this.errorSub?.unsubscribe()
    this.singleConvSub?.unsubscribe();
    this.errorHandlingService.reset()
  }
}
