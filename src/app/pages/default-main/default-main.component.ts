import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GroupCardComponent } from 'app/components/group-card/group-card.component';
import { TitleControlsComponent } from 'app/components/title-controls/title-controls.component';
import { titleKinds } from 'app/utils/enums/title-controls';
import { Store } from '@ngrx/store';
import { addNewGroup, deleteGroup, getAllGroups } from 'app/store/actions/group.action';
import { selectFirstLoadedGroups, selectGroups, selectMyGroups } from 'app/store/selectors/group.selectors';
import { DialogModule } from 'primeng/dialog';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PeopleComponent } from 'app/pages/default-main/people/people.component';
import { OwnGroupsPipe } from 'app/pipes/own-groups.pipe';
import { first } from 'rxjs';


@Component({
  selector: 'app-default-main',
  standalone: true,
  imports: [CommonModule,
    RouterModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    GroupCardComponent,
    TitleControlsComponent,
    PeopleComponent,
    OwnGroupsPipe],
  templateUrl: './default-main.component.html',
  styleUrl: './default-main.component.scss'
})
export class DefaultMainComponent {
  titleKinds = titleKinds;

  allGroups = this.store.select(selectGroups);
  myGroups = this.store.select(selectMyGroups);

  groupName = new FormControl('', [Validators.required, Validators.maxLength(30)])

  openDialog = false;

  filtered = false;
  blockUpdateButton = false;

  constructor(private store: Store) {
  }

  ngOnInit() {
    this.store.select(selectFirstLoadedGroups).pipe(
      first(),
    )
      .subscribe(loaded => {
        if (!loaded) {
          this.updateContent();
          this.blockUpdateButton = true;
        }
      })
  }

  updateContent() {
    this.store.dispatch(getAllGroups())
  }

  addGroup() {
    this.openDialog = true;
  }
  confirmGroupCreation() {
    if (this.groupName.value?.trim()) {
      this.store.dispatch(addNewGroup({ groupName: this.groupName.value }))
      this.openDialog = false;
      this.groupName.reset()
    }
  }
  cancelGroupCreation() {
    this.openDialog = false;
    this.groupName.reset()
  }

  deleteGroup(groupId: string) {
    this.store.dispatch(deleteGroup({ groupId }))
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
