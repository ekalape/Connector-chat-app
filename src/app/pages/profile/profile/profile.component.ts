import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectError, selectProfileData } from 'app/store/selectors/profile.selectors';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Location } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subscription, map, tap } from 'rxjs';
import { getProfileAction, setErrorAction, updateProfileAction } from 'app/store/actions/profile.action';
import { selectLoadingState } from 'app/store/selectors/auth.selectors';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { StorageKeys } from 'app/utils/enums/local-storage-keys';
import { IStorageInfo } from 'app/models/auth.model';



@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule,
    InputTextModule,
    ToastModule,
    ButtonModule,
    ReactiveFormsModule,
    FormsModule],
  providers: [MessageService],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  profileData$ = this.store.select(selectProfileData);
  loading$ = this.store.select(selectLoadingState);
  error$ = this.store.select(selectError);



  idField = new FormControl({ value: '', disabled: true });
  nameField = new FormControl({ value: '', disabled: true });
  emailField = new FormControl({ value: '', disabled: true });
  creationField = new FormControl({ value: '', disabled: true });

  savenabled = false;
  oldName = "";
  dateSeconds = "";

  sub: Subscription | undefined;
  errorsub: Subscription | undefined;

  constructor(private store: Store, private location: Location,
    private messageService: MessageService,) { }

  ngOnInit() {
    let profile;
    const storagedData = localStorage.getItem(StorageKeys.LOGIN_KEY);
    if (storagedData) {
      profile = JSON.parse(storagedData) as IStorageInfo;
      this.idField.setValue(profile.uid);
      this.emailField.setValue(profile.email);
    }


    this.sub = this.profileData$
      .subscribe(data => {
        this.oldName = data.name;
        this.nameField.setValue(data.name);
        this.dateSeconds = data.createdAt;

      })

    if (!this.nameField.value) {
      console.log("---name is missing make request---");

      this.store.dispatch(getProfileAction())
    }

    this.errorsub = this.error$
      .subscribe(x => {
        if (x)
          this.showError(x?.message)
      })
  }

  editField() {
    this.savenabled = true;
    if (this.nameField.disabled)
      this.nameField.enable()
    else this.nameField.disable()
  }

  goBack() {
    this.location.back()
  }
  ngOnDestroy() {
    this.sub?.unsubscribe();
    this.errorsub?.unsubscribe();
    this.store.dispatch(setErrorAction({ error: null }))
  }

  onSave() {
    if (this.nameField.value?.trim()) {
      this.savenabled = false;
      this.nameField.disable();
      this.store.dispatch(updateProfileAction({ name: this.nameField.value }))

    }
  }
  onCancel() {
    this.nameField.setValue(this.oldName);
    this.nameField.disable()
  }

  showError(errorMessage: string | undefined) {
    this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: errorMessage || "Something went wrong, try again" });
  }

}
