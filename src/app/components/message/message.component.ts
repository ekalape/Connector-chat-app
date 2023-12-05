import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { IMessages, ISingleMessage } from 'app/models/conversations.model';
import { Store } from '@ngrx/store';
import { selectMyID } from 'app/store/selectors/profile.selectors';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule, CardModule, PanelModule],

  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent {

  mine = false;

  @Input() messageData: ISingleMessage | undefined;

  myData: { id: string, name: string } | undefined;
  sub: Subscription | undefined;

  constructor(private store: Store) { }

  ngOnInit() {
    console.log("message created, ", this.messageData?.message);
    this.sub == this.store.select(selectMyID).subscribe(data => {
      this.myData = data;
      if (this.messageData?.authorID === data.id)
        this.mine = true;
    })
    //TODO change authorID with authorName from people part of the store

  }


  ngOnDestroy() {
    this.sub?.unsubscribe()
  }

}
