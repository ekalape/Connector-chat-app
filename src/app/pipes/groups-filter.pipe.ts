import { Pipe, PipeTransform } from '@angular/core'
import { ISingleGroup, IUser } from 'app/models/conversations.model'

@Pipe({
  name: 'groupsFilter',
  standalone: true
})
export class GroupsFilterPipe implements PipeTransform {

  constructor() {
  }
  transform(groups: ISingleGroup[], word: string): ISingleGroup[] {

    if (!word.trim()) return [...groups];
    return groups.filter(us => us.name.includes(word));
  }
}
