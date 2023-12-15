import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GroupCardComponent } from 'app/components/group-card/group-card.component';
import { TitleControlsComponent } from 'app/components/title-controls/title-controls.component';
import { titleKinds } from 'app/utils/enums/title-controls';
import { Store } from '@ngrx/store';
import { addNewGroup, deleteGroup, getAllGroups } from 'app/store/actions/group.action';
import {
  selectFirstLoadedGroups, selectGroupLoadingState,
  selectGroupsList, selectMainGroupErrorState,
  selectMyGroups
} from 'app/store/selectors/group.selectors';
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
import { ConfirmDialogComponent } from 'app/components/confirm-dialog/confirm-dialog.component';
import { GroupsFilterPipe } from 'app/pipes/groups-filter.pipe';



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
    ConfirmDialogComponent,
    LoadingOverlayComponent,
    GroupsFilterPipe,
    OwnGroupsPipe],
  providers: [MessageService],
  templateUrl: './default-main.component.html',
  styleUrl: './default-main.component.scss'
})
export class DefaultMainComponent implements OnInit, OnDestroy {
  titleKinds = titleKinds;
  RequestStatus = RequestStatus;
  blockBtn = false;
  showConfirm = false;
  groupToDelete: string | undefined

  groupFilterInput = new FormControl("");
  filterWord = ""

  allGroups = this.store.select(selectGroupsList);
  myGroups = this.store.select(selectMyGroups);
  errorState: IErrorState | undefined

  isLoading = this.store.select(selectGroupLoadingState)

  groupName = new FormControl('', [Validators.required, Validators.maxLength(30)]);

  errorSUB: Subscription | undefined;
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

    this.errorSUB = this.store.select(selectMainGroupErrorState).subscribe((data) => {
      this.errorState = data;
      if (data.status === RequestStatus.ERROR) this.showError(data.message || "Something went wrong");
      if (data.status === RequestStatus.SUCCESS) {
        if (data.type === "update")
          this.blockBtn = true;
        if (data.type === "delete") { this.showSuccess("The group was deleted") }
        if (data.type === "create") { this.showSuccess("The group was created") }
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

  deleteGroupConfirmed() {
    if (this.groupToDelete) {
      this.store.dispatch(deleteGroup({ groupId: this.groupToDelete }));
      this.groupToDelete = undefined;
    }
    this.showConfirm = false;
  }

  deleteGroup(groupId: string) {
    this.showConfirm = true;
    this.groupToDelete = groupId;

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

  filterGroups() {
    this.filterWord = this.groupFilterInput.value || ""
  }

  showError(errorMessage: string | undefined) {
    this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: errorMessage || "Something went wrong, try again" });
  }
  showSuccess(message: string | undefined) {
    this.messageService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: message || 'Thank you!' });
  }

  ngOnDestroy() {
    this.errorSUB?.unsubscribe()
  }
}
