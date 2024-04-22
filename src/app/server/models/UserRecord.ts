/**
 * Модель записи в таблице Пользователи.
 * Моделируем наличие БД, тз которой данные отдаются на фронт немного в другом виде - более JS-образном
 */
export interface UserRecord {
    id: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    /**
     * 0 - онлайн
     * 1 - оффлайн
     * 2 - отошел
     */
    status: number;
    /**
     * Пол:
     *   - 0 - м
     *   - 1 - ж
     *   - 2 - 👽
     */
    gender: number;
    /**
     * Код cтраны/региона пользователя
     */
    region_code: string;
    /**
     * Наименование месторасположения пользователя - город и т.п.
     */
    location_name: string;
    /**
     * Изображение пользователя - для простоты - индекс svg-файла с изображением
     */
    user_image: number;
}