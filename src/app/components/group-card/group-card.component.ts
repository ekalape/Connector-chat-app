import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ISingleGroup } from 'app/models/conversations.model';
import { ButtonModule } from 'primeng/button';
import { Store } from '@ngrx/store';
import { selectProfileData } from 'app/store/selectors/profile.selectors';
import { map, take } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-group-card',
  standalone: true,
  imports: [CommonModule, ButtonModule, RouterModule],
  templateUrl: './group-card.component.html',
  styleUrl: './group-card.component.scss'
})
export class GroupCardComponent {

  @Input() groupData: ISingleGroup | undefined;


  mine: boolean = false;

  constructor(private store: Store) {
  }

  ngOnInit() {
    console.log('object :>> ', this.groupData, "mine? ", this.mine);
  }

  deleteGroup() {
    console.log("delete group", this.groupData?.id);
  }


}
