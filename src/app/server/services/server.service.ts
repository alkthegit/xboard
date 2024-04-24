import { Injectable } from '@angular/core';
import { UserRecord } from '../models/UserRecord';
import { populateDb } from '../helpers/populizer';
import { User } from 'src/app/models/User';
import { Observable, of, throwError } from 'rxjs';
import { concatMap, delay, tap } from 'rxjs/operators';
import { UserListRequest } from '../models/UserLIstRequest';
import { mapUserRecordToUser } from '../helpers/mappers';
import { normalizePageable } from '../helpers/pager-helper';
import { UserEnvService } from 'src/app/services/user-env.service';
import { userDataSize } from '../config/constants';

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  private data: UserRecord[] = [];

  constructor(
    private userEnvSercvice: UserEnvService,
  ) {
    this.generateData();
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
        if (search != null && search !== '' && search !== '*') {
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

    const users: User[] = records
      .map(record => mapUserRecordToUser(record));

    /**
     * Рассчитываем задержку - пропорционально сетевым возможностям и объему данных
     */
    const dataSize = users.length * userDataSize;
    const speed = this.userEnvSercvice.networkSpeedThrottled;
    const delayMs = (dataSize / speed) * 1000;

    // отдаем на фронт в приобразованном виде
    return (of(users)
      .pipe(delay(delayMs))
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
    // имитация серверной задержки
    const delayMs = 400 + Math.random() * 1401;
    return (
      of(void 0)
        .pipe(
          delay(delayMs),
          tap(() => {
            const userIndex = this.data.findIndex(r => r.id === id);
            if (userIndex !== -1) {
              window?.clearInterval(this.data[userIndex]?.beatInterval ?? 0);
              this.data.splice(userIndex, 1);
            }
          })
        )
    );
  }

  /**
   * Создает популяцию заново
   */
  public repopulate(): Observable<void> {
    // случайная задержка на работу сервера
    const delayMs = 600 + Math.random() * 1701;

    const populate$ = of(void 0)
      .pipe(
        delay(delayMs),
        concatMap(() => {
          // останаливаем пульс...
          if (this.data?.length > 0) {
            for (const record of this.data) {
              window?.clearInterval(record?.beatInterval ?? 0);
            }
          }

          this.generateData();

          return of(void 0);
        })
      );

    return populate$;
  }

  /**
   * Создание данных
   */
  private generateData(): void {
    this.data = populateDb({
      populationVolumeMin: this.userEnvSercvice.populationVolumeMin,
      populationVolumeMax: this.userEnvSercvice.populationVolumeMax,
      xFactor: this.userEnvSercvice.xFactor,
      humanPowerBase: this.userEnvSercvice.humanPowerBase,
    });
  }
}
