# Xboard
Демонстрационный проекта на Angular 10.2.4.

## Среда запуска

Гарантированно запускается в слудеющем окружении:

  - NodeJs v12.22.12

## Подробное описание

### 👽 / 👨🏻 Что происходит
Землю захватывают пришельцы

### Общая архитекрута

Приложение сотстоит из двух основных частей
  - фронтовая часть, которая управляет настройками и отображает состояние
  - имитации серверной части, в которой течет время популяции и происходят разные событий - реализована как сервис Angular

### Механика
Новая популяция (база данных с записями пользователей) создается либо при старте приложения на "сервере", либо по требованию пользователя из UI:

![image](https://github.com/alkthegit/xboard/assets/29691155/09d789af-d91d-46a1-ab99-88178fed4c7e)


Состав и численность регулируются настройками (сохраняются в локальном хранилище):
  - 👽 x-фактор - сколько чужих исходно в популяции
  - минимальная общая численность популяции
  - максимальная общая численность популяции
  - усточивость людей к попытке захвата - влияет на скорость, с которой в итоге будет колонизирована популяция

Для создания популяции используется набор фейковых данных, выбираются:
  - пол - значением этого параметра определяется ФИО, картинка, а так же то, человек ли это
  - картинка
  - ФИО
  - страна расположения и город
  - флаг
  - статус - онлайн, оффлайн, "отошел" - меняется с течение "серверного" времени
  - рейт (исходно - 0) - число показывает, сколько атак пережил человек (медальки)

#### 💓 Пульс пользователя
При создании члена популяции с ним свызявается "пульс" - поток изменений состояния члена популяции.
Сейчас со временем меняется только статус - онлайн, офлайн, отошел.

#### 💓 Пульс глобальный 
После создания всей популяции запускается глобальный пульс - поток событий, связанных с общим ходом истории.
В этом потоке время от времени на некоторое случайное количество пользователей совершается атака (контакт)

### 🧠 Процесс захвата
В глобальном потоке времени после случайного интервала выбираются несколько людей, на которых совершается попытка захвата - контакт.
Каждый контакт длится некоторое случайное время и завершается для пользователя либо превращением в чужого, либо победой и медалью.

На захват влияют:
  - общее количество чужих в популяции - чем больше, тем больше шансов на захват
  - исходная величина устойчивости людей - при создании новой популяции
  - рейт отдельного пользователя - чем он выше, тем больше шансов отбиться

### Режимы отображения
Список популяции имеет ва режима - плиточный и списочный

#### Плтики
![image](https://github.com/alkthegit/xboard/assets/29691155/b59a168e-e4d9-4665-bf76-8bbc8c4156a9)

#### Список
![image](https://github.com/alkthegit/xboard/assets/29691155/2ea25b86-f3fd-43ad-8f04-7392eddb1a83)

### Работа со списком
![image](https://github.com/alkthegit/xboard/assets/29691155/a05d41d9-c1e6-4f63-b062-326fcc0580a7)

Базовые возможности управления списком:
  - режим автобновления
  - кнопка обновить
  - поисковая строка запроса - **строка токенизируется по пробелам**, поиск по получившимся токенам происходит в полях ФИО записи в "БД"
  - пагинатор
  - удаление отдельных карточек
  - выбор нескольких карточек и одновременное удаление

    
![image](https://github.com/alkthegit/xboard/assets/29691155/751def4c-924c-48b7-bc38-1cd1d0b12d61)

### Настройки популяции
Влияют на ход событий, можно настроить:
  - исходные границы численности
  - x-фактор - как много в исходной популяции будет чужих
  - исходная устойчивость людей к атакам чужих

### Индикаторы процесса
#### Состояние пользователя
  - онлайн
  - офлайн
  - отошел
    
![image](https://github.com/alkthegit/xboard/assets/29691155/821bd099-f5ca-4908-bb82-93821062d8df)

#### Рейт
Опыт отражения атак

![image](https://github.com/alkthegit/xboard/assets/29691155/38a0ef53-cbf9-4121-b549-7e38bde7df58)

#### Пользователь в состоянии атаки на него

![image](https://github.com/alkthegit/xboard/assets/29691155/a5ccca3b-bdc9-4abf-8061-59fed4816980)

#### Общий ход коллонизации

![image](https://github.com/alkthegit/xboard/assets/29691155/d6b0c624-2741-4eab-8146-6d80a27d7ec1)

## Итог
Любая популяция в итоге полностью захватывается
