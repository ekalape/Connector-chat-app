import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ISingleGroup } from 'app/models/conversations.model';
import { ButtonModule } from 'primeng/button';
import { Store } from '@ngrx/store';
import { selectProfileData } from 'app/store/selectors/profile.selectors';
import { map, take } from 'rxjs';

@Component({
  selector: 'app-group-card',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './group-card.component.html',
  styleUrl: './group-card.component.scss'
})
export class GroupCardComponent {

  @Input() groupData: ISingleGroup | undefined;

  @Output() clickGroup = new EventEmitter()

  mine: boolean = false;

  constructor(private store: Store) {
  }

  ngOnInit() {
    /*     this.store.select(selectProfileData).pipe(
          take(1),
          map(x=>{if(x.id===this.groupData?.id) this.mine=true;})) */
  }

  deleteGroup() {
    console.log("delete group", this.groupData?.id);
  }

  onClick() {
    this.clickGroup.emit(this.groupData?.id)
  }
}
