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
    location: string;
}

/**
 * Страна/регион
 */
export interface Region {
    code: string;
    name: string;
}