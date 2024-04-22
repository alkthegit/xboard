import { Pageable } from './Pageable';

/**
 * Типизирует тело запроса на получение списка пользователей
 */
export interface UserListRequest {
    pageabe?: Pageable;
    search?: string;
}