import { PageData } from './Pageable';

/**
 * Типизирует тело запроса на получение списка пользователей
 */
export interface UserListRequest {
  pageabe?: PageData;
  search?: string;
}
