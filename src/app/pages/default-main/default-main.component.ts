import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GroupCardComponent } from 'app/components/group-card/group-card.component';
import { TitleControlsComponent } from 'app/components/title-controls/title-controls.component';
import { titleKinds } from 'app/utils/enums/title-controls';



@Component({
  selector: 'app-default-main',
  standalone: true,
  imports: [CommonModule, RouterModule, GroupCardComponent, TitleControlsComponent],
  templateUrl: './default-main.component.html',
  styleUrl: './default-main.component.scss'
})
export class DefaultMainComponent {
  titleKinds = titleKinds;


  updateContent(value: titleKinds) {
    console.log("this titleKind = ", value);
  }

  addGroup() {
    console.log("add new group");
  }

}
