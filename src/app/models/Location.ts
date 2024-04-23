/**
 * Расположение пользователя
 */
export interface Location {
    /**
     * В каком регионе мира
     */
    region: Region;
    /**
     * Наименование месторасположения - город и т.д.
     */
    name: string;
    /**
     * Иконка флага
     */
    flag: string;
}

/**
 * Страна/регион
 */
export interface Region {
    code: string;
    name: string;
}
