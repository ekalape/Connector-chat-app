import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectProfileData } from 'app/store/selectors/profile.selectors';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Location } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subscription, map } from 'rxjs';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, InputTextModule, ButtonModule, ReactiveFormsModule, FormsModule],

  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  profileData$ = this.store.select(selectProfileData);

  nameField = new FormControl({ value: '', disabled: true });
  emailField = new FormControl({ value: '', disabled: true });
  creationField = new FormControl({ value: '', disabled: true });

  savenabled = false;
  oldName = ""

  sub: Subscription | undefined

  constructor(private store: Store, private location: Location) { }

  ngOnInit() {
    this.sub = this.profileData$.subscribe(data => {
      this.oldName = data.name;
      this.nameField.setValue(data.name);
      this.emailField.setValue(data.email);
      this.creationField.setValue(data.createdAt)
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
    this.sub?.unsubscribe()
  }

  onSave() {
    this.savenabled = false;
    //todo http profile update + save to store
  }
  onCancel() {
    this.nameField.setValue(this.oldName);
    this.nameField.disable()
  }



}
