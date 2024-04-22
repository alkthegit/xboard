import { Injectable } from '@angular/core';
import { ServerService } from '../server/services/server.service';
import { UserListRequest } from '../server/models/UserLIstRequest';
import { Observable } from 'rxjs';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {

  constructor(
    private server: ServerService
  ) { }

  /**
   * Получает список пользователей по указанному запросу поиска
   * @param userListRequest 
   */
  public getList(userListRequest?: UserListRequest): Observable<User[]> {
    return this.server.getList(userListRequest);
  }

  /**
   * Возвращает пользователя с указанным id
   * @param id 
   */
  public getById(id: User['id']): Observable<User> {
    return this.server.getById(id);
  }

  /**
   * Удаляет пользователя по указанному id
   * @param id 
   */
  public remove(id: User['id']): Observable<void> {
    return this.server.remove(id);
  }
}
