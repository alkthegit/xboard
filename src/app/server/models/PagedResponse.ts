/**
 * Ответ сервера с данными - в постраничном виде
 */
export interface PagedResponse<T> {
  content: T[];
  pageable: {
    totalCount: number;
    pageSize: number;
    page: number,
  },
  stats?: PopulationStatistics;
}

/**
 * Текущая статистика популяции
 */
export interface PopulationStatistics {
  total: number,
  /**
   * Люди
   */
  humans: number,
  /**
   * Они
   */
  x: number
}
