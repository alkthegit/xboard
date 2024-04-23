import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../models/User';

@Pipe({
  name: 'userFio',
  pure: true
})
export class UserFioPipe implements PipeTransform {

  transform(user: User): string {
    if (user == null) {
      return '???';
    }

    const fio = [
      user.lastName,
      user.firstName,
      user.middleName
    ]
      .map(e => e?.trim())
      .filter(e => e != null && e !== '')
      .join(' ')

    return fio;
  }

}
