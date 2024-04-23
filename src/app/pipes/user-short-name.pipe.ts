import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../models/User';

@Pipe({
  name: 'userShortName',
  pure: true
})
export class UserShortNamePipe implements PipeTransform {

  transform(user: User): string {
    if (user == null) {
      return '???';
    }

    let result = '';
    if (user.firstName != null && user.firstName !== '') {
      result = user.firstName;
    }

    if (user.lastName != null && user.lastName !== '') {
      result += ` ${user.lastName[0].toUpperCase()}.`;
    }

    return result;
  }

}
