import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleControlsComponent } from '../title-controls/title-controls.component';
import { RouterModule } from '@angular/router';
import { titleKinds } from 'app/utils/enums/title-controls';
import { Store } from '@ngrx/store';
import { getPeople, getPeopleAndConversations } from 'app/store/actions/people.action';
import { selectConversations, selectPeopleData, selectUsers } from 'app/store/selectors/people.selectors';

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
  myConversations = this.store.select(selectConversations);


  constructor(private store: Store) {
  }



  updateContent(event: titleKinds) {
    console.log("update people", event);
    this.store.dispatch(getPeopleAndConversations())
  }

}
