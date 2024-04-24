import { PageData } from '../models/Pageable';

const defaultPageSize = 100;
/**
 * Приводит переданное значение Pageable к единообразию, учитывая пограничные случаи
 * @param p
 */
export function normalizePageable(p: PageData): PageData {
  if (p == null) {
    return {
      page: 0,
      pageSize: defaultPageSize,
    };
  }

  let { page, pageSize } = p;

  if ((page ?? 0) < 0) {
    page = 0;
  }
  if ((pageSize ?? 0) <= 0) {
    pageSize = defaultPageSize;
  }

  return ({
    page,
    pageSize
  });
}
