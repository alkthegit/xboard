
/**
 * Страна - с наименованием и списком городов
 */
export interface LocationSeed {
  /**
   * Код/название на латинице
   */
  code: string;
  /**
   * Русское название
   */
  name: string;
  cities: string[];
  /**
   * 🌌 Экстратерриториальное месторасположения
   */
  exTerra?: boolean;
}

/**
 * Список стран и городов - для начала - только столица
 */
export const LocationsData: LocationSeed[] = [
  {
    code: 'russia',
    name: 'Россия',
    cities: [
      'Москва'
    ]
  },
  {
    code: 'ukraine',
    name: 'Украина',
    cities: [
      'Киев'
    ]
  },
  {
    code: 'australia',
    name: 'Австралия',
    cities: [
      'Канберра'
    ]
  },
  {
    code: 'austria',
    name: 'Австрия',
    cities: [
      'Вена'
    ]
  },
  {
    code: 'azerbaijan',
    name: 'Азербайджан',
    cities: [
      'Баку'
    ]
  },
  {
    code: 'angola',
    name: 'Ангола',
    cities: [
      'Луанда'
    ]
  },
  {
    code: 'armenia',
    name: 'Армения',
    cities: [
      'Ереван'
    ]
  },
  {
    code: 'afghanistan',
    name: 'Афганистан',
    cities: [
      'Кабул'
    ]
  },
  {
    code: 'belarus',
    name: 'Беларусь',
    cities: [
      'Минск'
    ]
  },
  {
    code: 'brazil',
    name: 'Бразилия',
    cities: [
      'Бразилиа'
    ]
  },
  {
    code: 'uk',
    name: 'Великобритания',
    cities: [
      'Лондон'
    ]
  },
  {
    code: 'venezuela',
    name: 'Венесуэла',
    cities: [
      'Каракас'
    ]
  },
  {
    code: 'germany',
    name: 'Германия',
    cities: [
      'Берлин'
    ]
  },
  {
    code: 'honduras',
    name: 'Гондурас',
    cities: [
      'Тегусигальпа'
    ]
  },
  {
    code: 'greece',
    name: 'Греция',
    cities: [
      'Афины'
    ]
  },
  {
    code: 'denmark',
    name: 'Дания',
    cities: [
      'Копенгаген'
    ]
  },
  {
    code: 'egypt',
    name: 'Египет',
    cities: [
      'Каир'
    ]
  },
  {
    code: 'bharata',
    name: 'Индия',
    cities: [
      'Дели'
    ]
  },
  {
    code: 'indonesia',
    name: 'Индонезия',
    cities: [
      'Джакарта'
    ]
  },
  {
    code: 'ireland',
    name: 'Ирландия',
    cities: [
      'Дублин'
    ]
  },
  {
    code: 'iceland',
    name: 'Исландия',
    cities: [
      'Рейкьявик'
    ]
  },
  {
    code: 'spain',
    name: 'Испания',
    cities: [
      'Мадрид'
    ]
  },
  {
    code: 'italy',
    name: 'Италия',
    cities: [
      'Рим'
    ]
  },
  {
    code: 'canada',
    name: 'Канада',
    cities: [
      'Оттава'
    ]
  },
  {
    code: 'cyprus',
    name: 'Кипр',
    cities: [
      'Никосия'
    ]
  },
  {
    code: 'china',
    name: 'Китай',
    cities: [
      'Пекин'
    ]
  },
  {
    code: 'cuba',
    name: 'Куба',
    cities: [
      'Гавана'
    ]
  },
  {
    code: 'kyrgyzstan',
    name: 'Кыргызстан',
    cities: [
      'Бишкек'
    ]
  },
  {
    code: 'luxembourg',
    name: 'Люксембург',
    cities: [
      'Люксембург'
    ]
  },
  {
    code: 'malaysia',
    name: 'Малайзия',
    cities: [
      'Куала-Лумпур'
    ]
  },
  {
    code: 'niger',
    name: 'Нигер',
    cities: [
      'Ниамей'
    ]
  },
  {
    code: 'netherlands',
    name: 'Нидерланды',
    cities: [
      'Амстердам'
    ]
  },
  {
    code: 'peru',
    name: 'Перу',
    cities: [
      'Лима'
    ]
  },
  {
    code: 'portugal',
    name: 'Португалия',
    cities: [
      'Лиссабон'
    ]
  },
  {
    code: 'romania',
    name: 'Румыния',
    cities: [
      'Бухарест'
    ]
  },
  {
    code: 'usa',
    name: 'США',
    cities: [
      'Вашингтон'
    ]
  },
  {
    code: 'saudi',
    name: 'Саудовская Аравия',
    cities: [
      'Эр-Рияд'
    ]
  },
  {
    code: 'seychelles',
    name: 'Сейшеллы',
    cities: [
      'Дакар'
    ]
  },
  {
    code: 'slovakia',
    name: 'Словакия',
    cities: [
      'Братислава'
    ]
  },
  {
    code: 'somalia',
    name: 'Сомали',
    cities: [
      'Могадишо'
    ]
  },
  {
    code: 'thailand',
    name: 'Таиланд',
    cities: [
      'Бангкок'
    ]
  },
  {
    code: 'turkey',
    name: 'Турция',
    cities: [
      'Анкара'
    ]
  },
  {
    code: 'uzbekistan',
    name: 'Узбекистан',
    cities: [
      'Ташкент'
    ]
  },
  {
    code: 'philippines',
    name: 'Филиппины',
    cities: [
      'Манила'
    ]
  },
  {
    code: 'finland',
    name: 'Финляндия',
    cities: [
      'Хельсинки'
    ]
  },
  {
    code: 'france',
    name: 'Франция',
    cities: [
      'Париж'
    ]
  },
  {
    code: 'croatia',
    name: 'Хорватия',
    cities: [
      'Загреб'
    ]
  },
  {
    code: 'czech',
    name: 'Чехия',
    cities: [
      'Прага'
    ]
  },
  {
    code: 'chile',
    name: 'Чили',
    cities: [
      'Сантьяго'
    ]
  },
  {
    code: 'switzerland',
    name: 'Швейцария',
    cities: [
      'Стокгольм'
    ]
  },
  {
    code: 'sweden',
    name: 'Швеция',
    cities: [
      'Берн'
    ]
  },
  {
    code: 'lanka',
    name: 'Шри-Ланка',
    cities: [
      'Шри-Джаяварденепура-Котте'
    ]
  },
  {
    code: 'estonia',
    name: 'Эстония',
    cities: [
      'Таллин'
    ]
  },
  {
    code: 'ethiopia',
    name: 'Эфиопия',
    cities: [
      'Аддис-Абеба'
    ]
  },
  {
    code: 'sar',
    name: 'ЮАР',
    cities: [
      'Претория'
    ]
  },
  {
    code: 'southkorea',
    name: 'Южная Корея',
    cities: [
      'Сеул'
    ]
  },
  {
    code: 'jamaica',
    name: 'Ямайка',
    cities: [
      'Кингстон'
    ]
  },
  {
    code: 'japan',
    name: 'Япония',
    cities: [
      'Токио'
    ]
  },
  {
    code: 'milkyway',
    name: 'Млечный путь',
    cities: [
      'Ригель',
      'Меркурий',
      'Марс',
    ]
  },
  {
    code: 'world1',
    name: 'Росс 128',
    cities: [
      'Ригель'
    ],
    exTerra: true,
  },
  {
    code: 'world2',
    name: 'Тигарден',
    cities: [
      'Тигарден b'
    ],
    exTerra: true,
  },
  {
    code: 'world3',
    name: 'Лейтен',
    cities: [
      'Лейтен b'
    ],
    exTerra: true,
  },
  {
    code: 'world4',
    name: 'Глизе 180',
    cities: [
      ' Глизе 180 b '
    ],
    exTerra: true,
  },
];
