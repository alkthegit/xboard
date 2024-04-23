import { getRandomItem, getRandomNumberString, normalizeLimits } from './array-helper';
import { UserRecord } from '../models/UserRecord';
import { v4 as uuidv4 } from 'uuid';
import { PersonNames } from '../db/seeds/names';
import { LocationsData } from '../db/seeds/location';
import { facesCount } from '../config/constants';
/**
 * Создает случайный набор данных - популяцию (множество пользователей) для БД
 *
 * @param min минимум населения (по умолчанию - `15` - `20`)
 * @param max максимум населения (по умолчанию - `35` - `50`)
 * @xFactor 👽 чем больше значение, тем больше их в новой популяции. Значения: [5; 95]
 */
export function populateDb(
  min: number = 15 + Math.ceil(Math.random() * 5),
  max: number = 35 + Math.ceil(Math.random() * 15),
  xFactor: number = 5
): UserRecord[] {
  const result: UserRecord[] = [];

  // количество населения
  const limits = normalizeLimits(min, max);
  const populationSize = limits[0] + Math.trunc((Math.random() * (limits[1] - limits[0] + 1)))

  for (let i = 0; i < populationSize; i++) {
    result.push(produceEntity(xFactor));
  }

  return result;
}

/**
 * Порождает случайное сущство
 * @xFactor 👽 чем больше значение, тем больше их в новой популяции. Значения: [5; 95]
 * @returns
 */
function produceEntity(xFactor: number = 5): UserRecord {
  // есть вероятность, что ты не землянин
  let x = Math.random() * 100 < xFactor;

  const xNum = x ?
    `#${getRandomNumberString(3, 5)}` : '';
  const gender = x ?
    2 : getRandomItem([0, 1]);
  const genderName = gender === 0 ?
    'male' : gender === 1 ?
      'female' : gender === 2 ?
        'x' : 'male';
  const region = x ?
    LocationsData.find(e => e.code === 'milkyway') :
    getRandomItem(LocationsData.filter(l => l.code !== 'milkyway'));
  const location = getRandomItem(region?.cities ?? []);

  let user: UserRecord = {
    id: uuidv4(),
    first_name: x ? `Alien ${xNum}` : getRandomItem(PersonNames[genderName]?.firstName) ?? '????',
    middle_name: x ? 'Suspect' : getRandomItem(PersonNames[genderName]?.middleName) ?? '????',
    last_name: x ? 'X' : getRandomItem(PersonNames[genderName]?.lastName) ?? '????',
    gender,
    status: getRandomItem([0, 1, 2]),
    region_code: region.code,
    location_name: location,
    user_image: Math.trunc((Math.random() * facesCount)),
    updated: Date.now()
  };

  // заводим пользователя
  startUserBeat(user);

  return Object.seal(user);
}

/**
 * Начинает поток жизни пользователя.
 *
 * С течение времени с пользователем происходят разные изменения
 */
function startUserBeat(userRecord: UserRecord): number {
  if (window?.setInterval) {
    return window.setInterval(() => {
      // будет ли что-то меняться
      // пользователи сохрянют инерцию - скрее не меняются
      const toChange = Math.random() * 100 > 70;
      if (toChange) {
        // выбираем новые статус
        userRecord.status = getRandomItem(
          [0, 1, 2].filter(e => e != userRecord.status)
        );
      }
    }, nextBeat())
  }

  return undefined;
}

/**
 * Вариативность пульса: 600 - 1500 мс
 */
const nextBeat = () => 600 + Math.random() * 901;
