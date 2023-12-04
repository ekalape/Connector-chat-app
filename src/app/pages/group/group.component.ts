import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TitleControlsComponent } from 'app/components/title-controls/title-controls.component';
import { titleKinds } from 'app/utils/enums/title-controls';
import { ISingleGroup } from 'app/models/conversations.model';
import { Store } from '@ngrx/store';
import { selectSingleGroup } from 'app/store/selectors/group.selectors';
import { Observable } from 'rxjs';
import { ChatContainerComponent } from 'app/components/chat-container/chat-container.component';

@Component({
  selector: 'app-group',
  standalone: true,
  imports: [CommonModule, TitleControlsComponent, ChatContainerComponent],
  templateUrl: './group.component.html',
  styleUrl: './group.component.scss'
})
export class GroupComponent {

  groupId: string | null;
  titleKinds = titleKinds;

  groupData: Observable<ISingleGroup | undefined> | undefined;

  constructor(private route: ActivatedRoute, private store: Store) {
    this.groupId = this.route.snapshot.paramMap.get('groupId');
  }

  ngOnInit() {
    console.log('groupId :>> ', this.groupId);
    if (this.groupId)
      this.groupData = this.store.select(selectSingleGroup(this.groupId))

  }

}
