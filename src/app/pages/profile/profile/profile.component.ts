import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectError, selectProfileData } from 'app/store/selectors/profile.selectors';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Location } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, Subscription, map, take, tap } from 'rxjs';
import { setErrorAction, updateProfileAction } from 'app/store/actions/profile.action';
import { selectLoadingState } from 'app/store/selectors/auth.selectors';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { IHttpError } from 'app/models/auth.model';
import { HttpErrorResponse } from '@angular/common/http';


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



  nameField = new FormControl({ value: '', disabled: true });
  emailField = new FormControl({ value: '', disabled: true });
  creationField = new FormControl({ value: '', disabled: true });

  savenabled = false;
  oldName = ""

  sub: Subscription | undefined;
  errorsub: Subscription | undefined;

  constructor(private store: Store, private location: Location,
    private messageService: MessageService,) { }

  ngOnInit() {

    this.sub = this.profileData$
      .subscribe(data => {
        this.oldName = data.name;
        this.nameField.setValue(data.name);
        this.emailField.setValue(data.email);
        this.creationField.setValue(data.createdAt)
      })

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
