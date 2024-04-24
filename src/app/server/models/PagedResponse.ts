/**
 * Ответ сервера с данными - в постраничном виде
 */
export interface PagedResponse<T> {
  content: T[];
  pageable: {
    totalCount: number;
    pageSize: number;
    page: number
  }
}
