import { Pipe, PipeTransform } from '@angular/core';
import { IUser } from 'app/models/conversations.model';

@Pipe({
  name: 'chatPartners',
  standalone: true
})
export class ChatPartnersPipe implements PipeTransform {

  constructor() {
  }
  transform(users: IUser[], filter: boolean, partners: string[]): IUser[] {

    if (filter) {
      return users.filter(us => partners.includes(us.uid))
    }
    else return users

  }



}
