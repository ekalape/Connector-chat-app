import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GroupCardComponent } from 'app/components/group-card/group-card.component';
import { TitleControlsComponent } from 'app/components/title-controls/title-controls.component';
import { titleKinds } from 'app/utils/enums/title-controls';
import { Store } from '@ngrx/store';
import { getAllGroups } from 'app/store/actions/group.action';
import { selectGroups, selectMyGroups } from 'app/store/selectors/group.selectors';



@Component({
  selector: 'app-default-main',
  standalone: true,
  imports: [CommonModule, RouterModule, GroupCardComponent, TitleControlsComponent],
  templateUrl: './default-main.component.html',
  styleUrl: './default-main.component.scss'
})
export class DefaultMainComponent {
  titleKinds = titleKinds;

  allGroups = this.store.select(selectGroups);
  myGroups = this.store.select(selectMyGroups)

  constructor(private store: Store) {

  }

  updateContent(value: titleKinds) {
    console.log("this titleKind = ", value);
    this.store.dispatch(getAllGroups())
  }

  addGroup() {
    console.log("add new group");
  }



}
