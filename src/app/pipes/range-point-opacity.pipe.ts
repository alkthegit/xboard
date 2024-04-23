import { Pipe, PipeTransform } from '@angular/core';

/**
 * Регулирует значение css opacity в заисимости от состояние range input
 */
@Pipe({
  name: 'rangePointOpacity'
})
export class RangePointOpacityPipe implements PipeTransform {

  /**
   *
   * @param pointValue целевая точка - некоторое значение из диапазон, например в `input[type="range"]`
   * @param rangeValue текущее значение, выбранное в некотором диапазоне
   * @param e окрестность вокруг `pointValue`, вход в эту окрестность начинает уменьшать `opacity` при приближении к `pointValue`
   * @returns
   */
  transform(pointValue: number, rangeValue: number, e: number): unknown {
    // на 0 не делим
    if (e === 0) {
      return 1;
    }

    // delta - насколько текущее значение отстоит от целевой точки, для которой рассчитываем opacity
    const delta = Math.abs(rangeValue - pointValue);
    if (delta > e) {
      // если не вошли в окрестность, то opacity - нулевая
      return 0;
    } else {
      // если находимся ровно в целевой точке, то opacity - полная
      if (delta === 0) {
        return 1;
      } else {
        // иначе opacity нарастает по мере приближения к целевой точке
        return 1 - delta / e;
      }
    }
  }
}
