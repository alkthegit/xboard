/**
 * Модель текущего значения в пагинаторе
 */
export interface PaginatorValue {
  /**
   * Общее глобальное количество записей
   */
  totalCount: number;
  /**
   * Кол-во записей на одной странице
   */
  pageSize: number;
  /**
   * Текущая страница просмотра
   */
  page: number;
}
