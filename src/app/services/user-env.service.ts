import { Injectable } from '@angular/core';

/**
 * Данный сервис помогает имитировать текущее окружение пользователя - скорость сети и т.п.
 */
@Injectable({
  providedIn: 'root'
})
export class UserEnvService {
  /**
   * 👽 чем больше значение, тем больше их в новой популяции. Значения: [5; 95]
   */
  public xFactor: number = 5;

  /**
   * Предустановки для выбора в UI;
   *
   * шкала 5, 10, ..., 95
   */
  public xFactorRange: number[] = ''.padEnd((95 - 5) / 5, '.')
    .split('.')
    .map((_, i) => 5 + i * 5);

  /**
   * Границы для случайной выборки численности популяции.
   * Выбирается случайное число в этом промежутке
   */
  public populationVolumeMin: number = 15;
  public populationVolumeMax: number = 35;

  /**
   * Скорость сети в нормальном значении - как бывает в жизни, в байтах
   */
  public networkSpeed = 1100 * 1024;

  /**
   * Сколько шагов в ползунке управления сетью
   */
  public netFactorSteps: number = 10;
  public netFactorMin = 0.005;
  public netFactorMax = 0.02;

  /**
   * Базовая сопротивляемость человека попытке захвата
   */
  public humanPowerBase = 3;

  /**
   * Величина, понижающая сетевую скорость - "ползунок" в UI с целыми значениями.
   * Чем больше подвинули ползунок, тем больше замедлили скорость.
   *
   * От данного значения далее расчитывается сетевой коэффициент
   */
  private _networkFactor = Math.trunc(this.netFactorSteps / 2); // изначально понижение скорости примерно пополам
  public get networkFactor(): number {
    return this._networkFactor;
  }
  public set networkFactor(value: number) {
    this._networkFactor = (value ?? 0) === 0 ? 1 : value;
  }

  /**
   * Скорость сети с понижением, в байтах
   */
  public get networkSpeedThrottled(): number {
    return this.speedValues[this.networkFactor - 1];
  }

  private speedValues: number[] = [];
  constructor() {
    this.setNetworkFactorRanges();
    this.loadSettingFromStorage();
  }

  private setNetworkFactorRanges(): void {
    // коэффициент для очередного шага "ползунка"
    let ratio: number = 1;
    for (let i = 0; i < this.netFactorSteps; i++) {
      ratio = this.netFactorMin + i * ((this.netFactorMax - this.netFactorMin) / (this.netFactorSteps - 1));
      this.speedValues.push(ratio * this.networkSpeed);
    }

    this.speedValues.reverse();
  }

  /**
 * Загружает настройки просмотра из хранилища
 */
  private loadSettingFromStorage(): void {
    let storageValue: any;
    if (localStorage) {
      storageValue = Number.parseInt(localStorage.getItem('humanPowerBase'));
      this.humanPowerBase = !Number.isNaN(storageValue) ? storageValue : 3;

      storageValue = Number.parseInt(localStorage.getItem('xFactor'));
      this.xFactor = !Number.isNaN(storageValue) ? storageValue : 3;
    }
  }
}
