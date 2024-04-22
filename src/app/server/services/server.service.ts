import { Injectable } from '@angular/core';
import { UserRecord } from '../models/UserRecord';
import { populateDb } from '../helpers/populizer';
import { User } from 'src/app/models/User';
import { Observable, of, throwError } from 'rxjs';
import { UserListRequest } from '../models/UserLIstRequest';
import { mapUserRecordToUser } from '../helpers/mappers';
import { normalizePageable } from '../helpers/pager-helper';

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  private data: UserRecord[] = [];

  constructor() {
    this.data = populateDb();
  }

  /**
   * Отдает список пользователей с учетом строки поиска и настройки пагинации
   * @param userListRequest 
   */
  public getList(userListRequest?: UserListRequest): Observable<User[]> {
    let records: ServerService['data'] = [...this.data];

    if (userListRequest != null) {
      const search = userListRequest?.search;
      if (search != null) {
        let tokens: string[];
        let fio: string;
        /**
         * Если указана строка поиска:
         *  1) "токенизируем" по пробельным символам
         *  2) для каждого токена ищем по подстроке в пользовательских полях ФИО
         */
        if (search != null && search !== '') {
          tokens = search.split(/\s/ig,)
            .map(e => e.trim().toLowerCase());

          if (tokens?.length > 0) {
            // фильтруем записи по совпадению любого токена в ФИО
            records = records
              .filter(record => {
                fio = [
                  record.last_name,
                  record.middle_name,
                  record.first_name
                ]
                  .join(' ').toLowerCase();

                return (
                  tokens
                    .some(token => fio.indexOf(token) !== -1)
                );
              });
          }

          /**
           * Если задана пагинация - выбираем окно данных
           */
          if (userListRequest?.pageabe != null) {
            const pageable = normalizePageable(userListRequest?.pageabe);
            const startIndex = Number.isFinite(pageable?.pageSize) ? pageable?.page * pageable?.pageSize : 0;
            const endIndex = Number.isFinite(pageable?.pageSize) ? startIndex + pageable?.pageSize : pageable?.pageSize;

            records = records.slice(startIndex, endIndex)
          }
        }
      }
    }

    // отдаем на фронт в приобразованном виде
    return of(records
      .map(record => mapUserRecordToUser(record))
    );
  }

  /**
   * Отдает пользователя с указанным id
   * @param id 
   */
  public getById(id: User['id']): Observable<User> {
    return throwError(new Error('удаление не реализовано'));
  }

  /**
   * Удаляет пользователя по указанному id
   * @param id 
   * @returns 
   */
  public remove(id: User['id']): Observable<void> {
    return throwError(new Error('удаление не реализовано'));
  }

}
