import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, ReplaySubject, Subject, from, interval, throwError } from 'rxjs';
import { catchError, filter, finalize, map, mergeAll, mergeMap, startWith, switchMap, takeUntil, tap, throttleTime, toArray } from 'rxjs/operators';
import { User } from 'src/app/models/User';
import { normalizeLimits } from 'src/app/server/helpers/array-helper';
import { UserListRequest } from 'src/app/server/models/UserLIstRequest';
import { ServerService } from 'src/app/server/services/server.service';
import { UserApiService } from 'src/app/services/user-api.service';
import { UserEnvService } from 'src/app/services/user-env.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit, OnDestroy {
  @Input() autoUpdate = true;

  private usersSubject = new ReplaySubject<User[]>(1);
  public users$ = this.usersSubject.asObservable();

  public pendingUsers = false;
  public pendingUserDelete = false;
  public pendingUserDeleteIdSet = new Set<User['id']>();
  public pendingUsersDelete = false;
  public pendingRepopulate = false;

  /**
   * Задержка автообновления в мс
   */
  private autoUpdateDelay = 5000;

  /**
   * Момент последнего обновления списка - на старте делаем "давно"
   */
  private userListLastUpdated: number = Date.now() - this.autoUpdateDelay - 1000;
  /**
   * Сигнал для обновления списка - автоматическое обновление
   */
  private autoUpdate$ = interval(300)
    .pipe(
      startWith(0),
      map(() => void 0),
      /**
       * Для автоматического обновления надо чтобы:
       *   - оно было включено
       *   - не было текущего обновления
       *   - последнее обновление списка было за пределами интервала
       */
      filter(() => (
        this.autoUpdate &&
        !this.pendingUsers &&
        !this.pendingUserDelete &&
        !this.pendingUsersDelete &&
        !this.pendingRepopulate &&
        this.userListLastUpdated + this.autoUpdateDelay < Date.now()
      ))
    );

  /**
   * Сигнал для обновления списка - операции со списком - обновление, пагинация, поиск
   */
  private usersSearchSubject = new Subject<UserListRequest>();

  /**
   * Признак первого обновления, чтоб не сообщать раньше времени, что список пустой
   */
  public firstUpdate = true;

  /**
   * Режим отображения списка
   */
  public listMode: 'card' | 'list' = 'card';

  /**
   * Карта выбранных пользователей - для удобства переключения
   */
  private listSelection: {
    [key: string]: boolean;
  } = {};

  /**
   * Массив выбранных пользователей - для быстроты действий
   */
  public selectedUsers: User[] = [];

  /**
   * Текущие настройки просмотра (сохраняются в хранилище)
   */
  public settings: {
    autoUpdate: boolean;
    populizerExpanded: boolean,
    listMode: 'card' | 'list',
  } = {
      autoUpdate: true,
      populizerExpanded: false,
      listMode: 'card',
    }

  private destroy$ = new Subject<void>();
  private usersListRequest: UserListRequest = undefined;
  private users: User[] = [];

  public get xFactorRange(): number[] {
    return this.userEnvService.xFactorRange;
  }

  public get xFactor(): number {
    return this.userEnvService.xFactor;
  }

  public get populationVolumeMin(): number {
    return this.userEnvService.populationVolumeMin;
  }

  public get populationVolumeMax(): number {
    return this.userEnvService.populationVolumeMax;
  }

  public get humanPowerBase(): number {
    return this.userEnvService.humanPowerBase;
  }

  constructor(
    private usersApiService: UserApiService,
    private userEnvService: UserEnvService,
    private server: ServerService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.subscribeToUsersListUpdateSignals();

    this.loadSettingFromStorage();
    this.listMode = this.settings.listMode;
    this.autoUpdate = this.settings.autoUpdate;

    this.cd.detectChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public onChangListMode(mode: 'card' | 'list'): void {
    this.listMode = mode;

    this.saveValueToLocalStorage('listMode', mode);
  }

  public onUserClick(user: User): void {
    user.selected = !user.selected;

    this.listSelection[user?.id] = user.selected;

    const selectedIndex = this.selectedUsers.findIndex(u => u.id === user.id);
    if (user.selected && selectedIndex === -1) {
      this.selectedUsers.push(user);
    } else if (!user.selected && selectedIndex !== -1) {
      this.selectedUsers.splice(selectedIndex, 1);
    }
  }

  /**
   * Нажатие кнопки - обновить список
   */
  public onRefreshList(): void {
    // простое обновление спика - это повтор текущего поиска
    this.usersSearchSubject.next(this.usersListRequest);
  }

  /**
   * Нажатие кнопки - удалить пользователя
   */

  public onDeleteUser(user: User): void {
    this.deleteUser(user)
      .subscribe();
  }
  /**
   * Нажатие кнопки - удалить выбранных
   */
  public onDeleteSelectedUsers(): void {
    this.deleteSelectedUsers()
      .subscribe();
  }

  /**
   * Изменение значения x-фкатора
   */
  public onXFactorChange(xFactorVal: string): void {
    let value = Number.parseInt(xFactorVal, 10);
    if (Number.isNaN(value)) {
      value = this.userEnvService.xFactorRange[0];
    }

    this.userEnvService.xFactor = value;
    this.saveValueToLocalStorage('xFactor', this.userEnvService.xFactor);
  }

  /**
   * Кнопка - слздать популяцию заново
   */
  public onRepopulate(): void {
    this.emptyWorld();

    this.pendingRepopulate = true;
    this.server.repopulate()
      .pipe(
        finalize(() => {
          this.pendingRepopulate = false;
        })
      )
      .subscribe(() => {
        // свежий запрос после пересоздания
        this.usersListRequest = undefined;
        this.usersSearchSubject.next(this.usersListRequest);
      });
  }

  /**
   * Изменение границ численности популяции
   */
  public onPopulationVolumesChange(minVal: string, maxVal: string) {
    let min = Number.parseInt(minVal, 10);
    let max = Number.parseInt(maxVal, 10);

    if (Number.isNaN(min)) {
      min = 5;
    }
    if (Number.isNaN(max)) {
      max = min + 5;
    }

    [min, max] = normalizeLimits(min, max);

    this.userEnvService.populationVolumeMin = min;
    this.userEnvService.populationVolumeMax = max;
  }

  public onHumanPowerBaseChange(powerValue: string): void {
    let value = Number.parseInt(powerValue, 10);

    if (Number.isNaN(value)) {
      value = 3;
    }

    this.userEnvService.humanPowerBase = value;
    this.saveValueToLocalStorage('humanPowerBase', this.userEnvService.humanPowerBase);
  }

  /**
   * Переключение группы для формы
   */
  public onLegendClick(value: boolean): void {
    this.saveValueToLocalStorage('populizerExpanded', value);
  }

  public onAutoUpdateChanges(value: boolean): void {
    this.autoUpdate = value;
    this.saveValueToLocalStorage('autoUpdate', value);
  }

  /**
   * Подписывается на все сигналы для обновления списка пользователей
   */
  private subscribeToUsersListUpdateSignals(): void {
    from([
      this.autoUpdate$
        .pipe(),
      this.usersSearchSubject
    ])
      .pipe(
        mergeAll(),
        takeUntil(this.destroy$),
        tap(() => this.pendingUsers = true),
        tap(() => this.pendingUsers = true),
        switchMap(userListRequest => {
          return this.usersApiService.getList(userListRequest ? userListRequest : null);
        }),
        tap(() => this.pendingUsers = false),
        tap(() => this.firstUpdate = false),
        // обновляем состояние - пользователь выбран
        tap(users => {
          for (const user of users) {
            if (this.listSelection[user.id] != null) {
              user.selected = this.listSelection[user.id];
            }
          }

          // сохраняем локально для возможности штучного удаления и т.п. без запроса в бэк
          this.users = users;
        }),
        tap(() => this.userListLastUpdated = Date.now())
      )
      .subscribe(this.usersSubject)
  }

  /**
   * Отправляет запрос на удаление пользователя
   * @param user
   * @param syncList если `true`, то автоматически синхронизирует текущий список в UI
   */
  private deleteUser(user: User, syncList: boolean = true): Observable<void> {
    const pendingId = user.id
    this.pendingUserDelete = true;
    this.pendingUserDeleteIdSet.add(pendingId);
    const delete$ = this.usersApiService.remove(user.id)
      .pipe(
        catchError(err => {
          console.error(`Не удалось удалить пользователя с id="${user.id}":`);
          console.error(err);

          return throwError(err);
        }),
        tap(() => {
          console.log(`Пользователь c id="${user.id}" удален`);

          if (syncList) {
            this.syncUserDelete(user);
          }
        }),
        finalize(() => {
          this.pendingUserDelete = false;
          this.pendingUserDeleteIdSet.delete(pendingId);
        })
      );
    return delete$;
  }

  /**
   * Отправляет запрос на удаление выбранных пользователей
   * @param user
   */
  private deleteSelectedUsers(): Observable<void[]> {
    this.pendingUsersDelete = true;
    if (!(this.selectedUsers?.length > 0)) {
      console.info('Удаление пользователей: пользователи не выбраны');
      return;
    }

    const deleteUsers$ = from(this.selectedUsers)
      .pipe(
        mergeMap(user => this.deleteUser(user, false)),
        toArray(),
        tap(() => this.syncUserDelete(this.selectedUsers)),
        finalize(() => {
          this.pendingUsersDelete = false;
        })
      )

    return deleteUsers$;
  }

  /**
   * Синхронизирует текущий список - удаление пользователя
   * @param users
   */
  private syncUserDelete(users: User | User[]): void {
    if (users == null) {
      return;
    }

    if (!(users instanceof Array)) {
      users = [users];
    } else {
      users = [...users];
    }

    let needUpdate = false;
    let userIndex;

    for (const user of users) {
      // выбранные
      userIndex = this.selectedUsers.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        this.selectedUsers.splice(userIndex, 1);
        needUpdate = true;
      }

      // в списке
      userIndex = this.users.findIndex(u => u.id === user.id);
      if (userIndex != null) {
        this.users.splice(userIndex, 1);
        needUpdate = true;
      }

    }

    if (needUpdate) {
      this.usersSubject.next(this.users);
    }
  }

  /**
   * Сбрасывает текущее состояние "мира"
  */
  private emptyWorld(): void {
    this.selectedUsers.length = 0;
    this.users.length = 0;
    this.usersSubject.next([]);
  }

  /**
   * Загружает настройки просмотра из хранилища
   */
  private loadSettingFromStorage(): void {
    let storageValue: any;
    if (localStorage) {
      storageValue = localStorage.getItem('autoUpdate');
      this.settings.autoUpdate = storageValue === 'true';

      storageValue = localStorage.getItem('listMode');
      this.settings.listMode = storageValue === 'card' || storageValue === 'list' ? storageValue : 'card';

      storageValue = localStorage.getItem('populizerExpanded');
      this.settings.populizerExpanded = storageValue === 'true';
    }
  }

  /**
   * Сохраняет значение в хранилище
   */
  private saveValueToLocalStorage(name: string, value: any): void {
    if (localStorage) {
      localStorage.setItem(name ?? '???', value)
    }
  }
}
