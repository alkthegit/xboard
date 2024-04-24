import { getRandomItem, getRandomNumberString, normalizeLimits } from './array-helper';
import { UserRecord } from '../models/UserRecord';
import { v4 as uuidv4 } from 'uuid';
import { PersonNames } from '../db/seeds/names';
import { LocationsData } from '../db/seeds/location';
import { facesCount } from '../config/constants';

/**
 * Настройки популяции
 */
export interface PopulationSetting {
  populationVolumeMin?: number;
  populationVolumeMax?: number;
  humanPowerBase?: number;
  xFactor?: number;
};

/**
 * Создает случайный набор данных - популяцию (множество пользователей) для БД
 *
 * @param min минимум населения (по умолчанию - `15` - `20`)
 * @param max максимум населения (по умолчанию - `35` - `50`)
 * @xFactor 👽 чем больше значение, тем больше их в новой популяции. Значения: [5; 95]
 */
export function populateDb(settings?: PopulationSetting): UserRecord[] {
  const {
    populationVolumeMin: populatioMin,
    populationVolumeMax: populatioMax,
    xFactor
  } = normalizePopulationSetting(settings);

  const result: UserRecord[] = [];

  // количество населения
  const limits = normalizeLimits(populatioMin, populatioMax);
  const populationSize = limits[0] + Math.trunc((Math.random() * (limits[1] - limits[0] + 1)))

  for (let i = 0; i < populationSize; i++) {
    result.push(produceEntity(settings));
  }

  startGlobalBeat(result, settings);

  return result;
}

/**
 * Порождает случайное сущство
 * @xFactor 👽 чем больше значение, тем больше их в новой популяции. Значения: [5; 95]
 * @returns
 */
function produceEntity(settings?: PopulationSetting): UserRecord {
  const { xFactor } = settings;

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
    updated: Date.now(),
    contact: false,
    alienated: false,
    rate: 0,
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

let globalBeatHandler = 0;
let humanAlienationBeatHandlers: number[] = [];
/**
 * Начинает глобальный пульс  жизни.
 *
 * На глобальном урочне инопланетяне пытаются захватить всех людей
 *
 * Исходно люди могут сопротивляться с успешностью 30 против 70,
 * но шансы на успех снижаются по мере увеличения присутствия чужих
 * в текущей популяции
 */
function startGlobalBeat(population: UserRecord[], settings?: PopulationSetting): void {
  settings = normalizePopulationSetting(settings);

  // базова способность человка сопротивляться атаке
  const humanPowerBase = settings?.humanPowerBase;
  // базовое значение шанса на захвата человека - увеличиывется с ростом числа уже захваченных
  const xPowerBase = 10 - humanPowerBase;

  if (!(population?.length > 0)) {
    return;
  }

  // очистка
  window?.clearTimeout(globalBeatHandler);
  if (humanAlienationBeatHandlers?.length > 0) {
    humanAlienationBeatHandlers.forEach(h => window?.clearTimeout(h));
    humanAlienationBeatHandlers.length = 0;
  }

  // интервал до следующей атаки
  const globalAlienationBeat = () => nextBeat(2000, 3000);
  // продолжительность атаки на очередного человека
  const humanAlienationBeat = () => nextBeat(1500, 2500);

  // через некоторое неизвестное заранее время начинается очередная попытка захвата
  const alienate = beat => {
    globalBeatHandler = window?.setTimeout(() => {
      // кто подвергся атаке
      const humansUnderAttack: UserRecord[] = [];
      const humans = [...population.filter(r => r.gender !== 2)];
      const aliens = [...population.filter(r => r.gender === 2)];

      // атаке подвергается от 1 до 5 процентов еще не захваченной популяции
      let targetCount = Math.trunc(
        Math.ceil(0.01 * humans.length) * Math.random() +
        Math.ceil(0.05 * humans.length) + 1
      );

      // для пограничных случаев
      targetCount = Math.min(targetCount, humans.length);

      humansUnderAttack.length = 0;
      for (let i = 1; i <= targetCount; i++) {
        humansUnderAttack.push(
          humans.splice(
            Math.trunc(Math.random() * humans.length), 1
          )[0]
        );
      }

      for (let human of humansUnderAttack) {
        // атака началась !
        human.contact = true;

        // каждый человек подвергается атаке в течение некоторого времен.
        // по истечении которого он либо захвачен, либо отбился
        humanAlienationBeatHandlers.push(
          window?.setTimeout(() => {
            const xPopulationRate = Math.max(0,
              (aliens.length / population.length) - 5 / 100
            );

            /**
             * итоговые шансы на атака складываются из показателей:
             *  - численность атакующих в текущей популяции:
             *   - при 5% шансы не меняются
             *   - при 95% - шансы увеличиваются до максимальных (но не до 100%)
             *  - рейт человека - сколько атак ему удалось пережить ранее
            */

            // текущая сопротивляемость человека - не может быть более 9
            const humanPowerTotal = Math.min(humanPowerBase + human.rate, 9);
            // сила атаки относительно текущей защиты человека
            const xPowerRelated = 10 - humanPowerTotal;
            const xPowerTotal = xPowerRelated + xPopulationRate * (9 - xPowerRelated);

            const theFate = Math.random();
            if (theFate < xPowerTotal / 10) {
              human.alienated = true;
              human.gender = 2;
            } else {
              // увеличиваем рейт человека, но не более, чем до 4
              human.rate = Math.min(3,
                (human.rate ?? 0) + 1
              );
            }

            // атака закончена
            human.contact = false;
          }, humanAlienationBeat())
        )
      }

      alienate(globalAlienationBeat());
    }, beat)
  };

  alienate(globalAlienationBeat());
}

/**
 * Вариативность пульса: [from; to] мс
 */
const nextBeat = (from: number = 600, to: number = 1500) => {
  [from, to] = normalizeLimits(from, to);

  return from + Math.random() * (to - from + 1);
};

/**
 * Приводит к единообразию настройки популяции
 */
function normalizePopulationSetting(settings: PopulationSetting): PopulationSetting {
  let populatioMin;
  let populatioMax;

  if (settings?.populationVolumeMin == null) {
    populatioMin = settings?.populationVolumeMin ?? 15 + Math.ceil(Math.random() * 5);
    populatioMax = populatioMin + Math.ceil(Math.random() * 20);
  } else {
    populatioMin = settings?.populationVolumeMin;
    populatioMax = settings?.populationVolumeMax;
  }

  settings.populationVolumeMin = populatioMin;
  settings.populationVolumeMax = populatioMax;
  settings.xFactor = settings.xFactor ?? 5;
  settings.humanPowerBase = settings.humanPowerBase ?? 3;

  return settings;
}
