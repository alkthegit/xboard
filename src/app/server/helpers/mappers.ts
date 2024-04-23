import { User, UserStatus, } from 'src/app/models/User'
import { UserRecord } from '../models/UserRecord'
import { LocationsData } from '../db/seeds/location';

/**
 * Отображение - пользователь
 * UserRecord -> User
 */
export function mapUserRecordToUser(record: UserRecord): User {
    if (record == null) {
        return null;
    }

    const location = LocationsData.find(e => e?.code === record.region_code);
  const assetsUrl = '/assets/svg';

    let user: User = {
        id: record.id,
        firstName: record.first_name,
        middleName: record.middle_name,
        lastName: record.last_name,
        status: mapUserStatus(record.status),
        gender: record.gender === 0 ? 'male' :
            record.gender === 1 ? 'female' :
                record.gender === 2 ? 'x' :
                    'male',
        location: location != null ? {
            region: {
                code: location.code,
                name: location.name
            },
          name: record.location_name,
          flag: `${assetsUrl}/flag/${location.code}.svg`
        } : undefined,
      imageUrl: record?.gender === 2 ? `${assetsUrl}/face/x.svg` :
        record?.gender === 0 ? `${assetsUrl}/face/m/f-m-${record.user_image}.svg` :
          `${assetsUrl}/face/fem/f-fm-${record.user_image}.svg`

    };

    return user;
}

/**
 * Отображение - статус пользователя
 * number -> UserStatus
 */
function mapUserStatus(status: number): UserStatus {
    return (
        status === 0 ? UserStatus.Online :
            status === 1 ? UserStatus.Offline :
                status === 2 ? UserStatus.Recent :
                    UserStatus.Offline
    );
}
