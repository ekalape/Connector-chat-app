import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectError, selectProfileData } from 'app/store/selectors/profile.selectors';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Location } from '@angular/common';
import { AbstractControl, FormControl, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { getProfileAction, setErrorAction, updateProfileAction } from 'app/store/actions/profile.action';
import { selectLoadingState } from 'app/store/selectors/auth.selectors';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { StorageKeys } from 'app/utils/enums/local-storage-keys';
import { IHttpError, IStorageInfo } from 'app/models/auth.model';
import { FieldsetModule } from 'primeng/fieldset';



@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule,
    InputTextModule,
    ToastModule,
    ButtonModule,
    ReactiveFormsModule,
    FieldsetModule,
    FormsModule],
  providers: [MessageService],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit, OnDestroy {
  profileData$ = this.store.select(selectProfileData);
  loading$ = this.store.select(selectLoadingState);
  error$ = this.store.select(selectError);

  errors: IHttpError | null = null

  nameField = new FormControl('',
    [Validators.required, Validators.minLength(3), Validators.pattern(/^[A-Za-zА-Яа-я\s]*$/), Validators.maxLength(40)]);

  emailField = "";
  userIDField = "";


  savenabled = false;
  editEnabled = false;

  oldName = "";


  sub: Subscription | undefined;
  errorsub: Subscription | undefined;

  constructor(private store: Store, private location: Location,
    private messageService: MessageService,) {

  }

  ngOnInit() {
    let profile;
    const storagedData = localStorage.getItem(StorageKeys.LOGIN_KEY);
    if (storagedData) {
      profile = JSON.parse(storagedData) as IStorageInfo;
      this.userIDField = profile.uid;
      this.emailField = profile.email
    }


    this.sub = this.profileData$
      .subscribe(data => {
        this.oldName = data.name;
        this.nameField.setValue(data.name);

      })

    if (!this.nameField.value) {
      this.store.dispatch(getProfileAction())
    }

    this.errorsub = this.error$
      .subscribe(x => {
        if (x/*  && x.type !== "InvalidIDException" */) {
          this.showError(x?.message)

          this.errors = x
        }
      })
  }

  editField() {
    this.editEnabled = true;
    this.nameField.addValidators(this.notOldNameValidator(this.oldName));
    this.nameField.updateValueAndValidity({ emitEvent: false });
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
      this.store.dispatch(updateProfileAction({ name: this.nameField.value }))
      this.editEnabled = false;
      if (!this.errors) {
        this.showSuccess("You changed your name!")
        this.nameField
          .setValidators([Validators.required, Validators.minLength(3), Validators.pattern(/^[A-Za-zА-Яа-я\s]*$/), Validators.maxLength(40)])
        this.nameField.markAsUntouched();
        this.nameField.markAsPristine();
        this.nameField.updateValueAndValidity({ emitEvent: false });
      }

    }
  }
  onCancel() {
    this.editEnabled = false;
    this.nameField.setValue(this.oldName);
    this.nameField
      .setValidators([Validators.required, Validators.minLength(3), Validators.pattern(/^[A-Za-zА-Яа-я\s]*$/), Validators.maxLength(40)]);
    this.nameField.markAsUntouched();
    this.nameField.markAsPristine();
    this.nameField.updateValueAndValidity({ emitEvent: false });
  }

  showError(errorMessage: string | undefined) {
    this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: errorMessage || "Something went wrong, try again" });
  }
  showSuccess(message: string | undefined) {
    this.messageService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: message || 'Thank you!' });
  }
  notOldNameValidator(oldName: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const valid = new RegExp(`^(?!${oldName}$).*$`).test(control.value);
      return valid ? null : { 'notOldName': true };
    }
  }
}

