import { Pageable } from '../models/Pageable';

/**
 * Приводит переданное значение Pageable к единообразию, учитывая пограничные случаи
 * @param p 
 */
export function normalizePageable(p: Pageable): Pageable {
    if (p == null) {
        return {
            page: 0,
            pageSize: Number.POSITIVE_INFINITY
        };
    }

    let { page, pageSize } = p;

    if ((page ?? 0) < 0) {
        page = 0;
    }
    if ((pageSize ?? 0) <= 0) {
        pageSize = Number.POSITIVE_INFINITY;
    }

    return ({
        page,
        pageSize
    });
}