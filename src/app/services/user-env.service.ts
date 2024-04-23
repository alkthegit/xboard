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
  public factorSteps: number = 10;
  public factorMin = 0.005;
  public factorMax = 0.02;

  /**
   * Величина, понижающая сетевую скорость - "ползунок" в UI с целыми значениями.
   * Чем больше подвинули ползунок, тем больше замедлили скорость.
   *
   * От данного значения далее расчитывается сетевой коэффициент
   */
  private _networkFactor = Math.trunc(this.factorSteps / 2); // изначально понижение скорости примерно пополам
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
    this.setFactorRanges();
  }

  private setFactorRanges(): void {
    // коэффициент для очередного шага "ползунка"
    let ratio: number = 1;
    for (let i = 0; i < this.factorSteps; i++) {
      ratio = this.factorMin + i * ((this.factorMax - this.factorMin) / (this.factorSteps - 1));
      this.speedValues.push(ratio * this.networkSpeed);
    }

    this.speedValues.reverse();
  }
}
