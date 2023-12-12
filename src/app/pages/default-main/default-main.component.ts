import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { GroupCardComponent } from 'app/components/group-card/group-card.component';
import { TitleControlsComponent } from 'app/components/title-controls/title-controls.component';
import { titleKinds } from 'app/utils/enums/title-controls';
import { Store } from '@ngrx/store';
import { addNewGroup, deleteGroup, getAllGroups } from 'app/store/actions/group.action';
import { selectFirstLoadedGroups, selectGroupLoadingState, selectGroups, selectGroupsList, selectMainGroupErrorState, selectMyGroups } from 'app/store/selectors/group.selectors';
import { DialogModule } from 'primeng/dialog';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PeopleComponent } from 'app/pages/default-main/people/people.component';
import { OwnGroupsPipe } from 'app/pipes/own-groups.pipe';
import { Subscription, first } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { LoadingOverlayComponent } from 'app/components/loading-overlay/loading-overlay.component';

import { RequestStatus } from 'app/utils/enums/request-status';
import { IErrorState } from 'app/store/models/store.model';



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
    ToastModule,
    LoadingOverlayComponent,
    OwnGroupsPipe],
  providers: [MessageService],
  templateUrl: './default-main.component.html',
  styleUrl: './default-main.component.scss'
})
export class DefaultMainComponent {
  titleKinds = titleKinds;
  RequestStatus = RequestStatus;

  allGroups = this.store.select(selectGroupsList);
  myGroups = this.store.select(selectMyGroups);
  errorState: IErrorState | undefined

  isLoading = this.store.select(selectGroupLoadingState)

  groupName = new FormControl('', [Validators.required, Validators.maxLength(30)]);

  errorSub: Subscription | undefined;
  openDialog = false;
  filtered = false;

  constructor(private store: Store, private messageService: MessageService) {
  }

  ngOnInit() {
    this.store.select(selectFirstLoadedGroups).pipe(
      first(),
    )
      .subscribe(loaded => {
        if (!loaded) {
          this.updateContent();
        }
      })

    this.errorSub = this.store.select(selectMainGroupErrorState).subscribe((data) => {
      this.errorState = data;
      if (data.status === RequestStatus.ERROR) this.showError(data.message || "Something went wrong")
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
    //TODO modal with confirmation
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
  showError(errorMessage: string | undefined) {
    this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: errorMessage || "Something went wrong, try again" });

  }
}
