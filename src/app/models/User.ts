import { Location } from './Location';

export interface User {
    /**
     * Guid
     */
    id: string;
    firstName: string;
    middleName: string;
    lastName: string;
    status: UserStatus;
    gender: 'male' | 'female' | 'x';
    location: Location | undefined;
    imageUrl: string;

    /**
     * Фронтовые расширения
     */
    selected?: boolean;
}

/**
 * Статусы пользователя
 */
export enum UserStatus {
    /**
     * В сети
     */
    Online = 'Online',
    /**
     * Не в сети
     */
    Offline = 'Offline',
    /**
     * Отошел...
     */
    Recent = 'Recent',
}
