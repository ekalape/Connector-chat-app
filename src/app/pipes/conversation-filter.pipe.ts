import { Pipe, PipeTransform } from '@angular/core'
import { IUser } from 'app/models/conversations.model'

@Pipe({
  name: 'conversationFilter',
  standalone: true
})
export class ConversationFilterPipe implements PipeTransform {

  constructor() {
  }
  transform(users: IUser[], word: string): IUser[] {

    if (!word.trim()) return users;
    return users.filter(us => us.name.includes(word));

  }



}
