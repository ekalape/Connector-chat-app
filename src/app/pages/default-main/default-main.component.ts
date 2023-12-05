import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GroupCardComponent } from 'app/components/group-card/group-card.component';
import { TitleControlsComponent } from 'app/components/title-controls/title-controls.component';
import { titleKinds } from 'app/utils/enums/title-controls';
import { Store } from '@ngrx/store';
import { addNewGroup, deleteGroup, getAllGroups } from 'app/store/actions/group.action';
import { selectGroups, selectMyGroups } from 'app/store/selectors/group.selectors';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';


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
    TitleControlsComponent],
  templateUrl: './default-main.component.html',
  styleUrl: './default-main.component.scss'
})
export class DefaultMainComponent {
  titleKinds = titleKinds;

  allGroups = this.store.select(selectGroups);
  myGroups = this.store.select(selectMyGroups);

  groupName = new FormControl('', [Validators.required, Validators.maxLength(30)])

  openDialog = false;

  constructor(private store: Store) {

  }

  updateContent(value: titleKinds) {
    console.log("this titleKind = ", value);
    this.store.dispatch(getAllGroups())
  }

  addGroup() {
    this.openDialog = true;
  }
  confirmGroupCreation() {
    console.log('groupName :>> ', this.groupName.value);
    if (this.groupName.value?.trim()) {
      this.store.dispatch(addNewGroup({ groupName: this.groupName.value }))
      console.log("added new group");
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


}
