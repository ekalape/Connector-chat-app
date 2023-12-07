import { Pipe, PipeTransform } from '@angular/core';
import { ISingleGroup } from 'app/models/conversations.model';

@Pipe({
  name: 'ownGroups',
  standalone: true
})
export class OwnGroupsPipe implements PipeTransform {

  transform(groups: ISingleGroup[], filter: boolean, myGroupsIds: string[] | null): ISingleGroup[] {
    if (filter && myGroupsIds) {
      return groups.filter(us => myGroupsIds.includes(us.id))
    }
    else return groups

  }

}
