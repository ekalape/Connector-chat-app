import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleControlsComponent } from '../title-controls/title-controls.component';
import { RouterModule } from '@angular/router';
import { titleKinds } from 'app/utils/enums/title-controls';
import { Store } from '@ngrx/store';
import { createConversation, getPeople, getPeopleAndConversations } from 'app/store/actions/people.action';
import { selectConversations, selectPeopleData, selectUsers } from 'app/store/selectors/people.selectors';
import { IUser } from 'app/models/conversations.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-people',
  standalone: true,
  imports: [CommonModule,
    TitleControlsComponent,
    RouterModule],
  templateUrl: './people.component.html',
  styleUrl: './people.component.scss'
})
export class PeopleComponent {


  people = this.store.select(selectUsers);
  conversations = this.store.select(selectConversations);
  myOpps: string[] = []
  sub: Subscription | undefined

  constructor(private store: Store) {

  }
  ngOnInit() {
    this.sub = this.conversations.subscribe(data => {
      this.myOpps = data.map(d => d.companionID)
    })
  }


  updateContent(event: titleKinds) {
    console.log("update people", event);
    this.store.dispatch(getPeopleAndConversations())
  }

  openConversation(user: IUser) {
    this.store.dispatch(createConversation({ companion: user.uid }))
    //create conv. If (error) showEror, else router.navigate('/conversation', convID)
  }
}
