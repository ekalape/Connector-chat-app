import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { ISingleMessage } from 'app/models/conversations.model';
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
export class MessageComponent implements OnInit, OnDestroy {

  mine = false;

  @Input() messageData: ISingleMessage | undefined;
  @Input() userName: string | undefined

  myData: { id: string, name: string } | undefined;
  sub: Subscription | undefined;


  constructor(private store: Store) { }

  ngOnInit() {
    this.sub == this.store.select(selectMyID).subscribe(data => {
      this.myData = data;
      if (this.messageData?.authorID === data.id)
        this.mine = true;
    })

  }


  ngOnDestroy() {
    this.sub?.unsubscribe()
  }

}
