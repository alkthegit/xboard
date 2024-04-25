import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PaginatorValue } from './models/Paginator';

export type PaginatorButtonAction = 'first' |
  'prev' |
  'next' |
  'last';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnInit {
  @Input() disabled = false;
  @Input() pageSizes: number[] = [5, 10, 15, 50, 100];

  @Input() public set value(paginatorValue: PaginatorValue) {
    this._value = {
      totalCount: paginatorValue?.totalCount ?? 0,
      page: paginatorValue?.page ?? 0,
      pageSize: paginatorValue?.pageSize ?? 5
    };

    if (this.value.pageSize !== 0) {
      this.lastPage = Math.ceil((this.value.totalCount / this.value.pageSize)) - 1;
    }
  };
  public get value(): PaginatorValue {
    return this._value;
  }
  _value: PaginatorValue;

  @Output() paginate = new EventEmitter<PaginatorValue>();

  /**
   * Номер последней страницы - для удобства
   */
  public lastPage = 0;

  constructor() { }

  ngOnInit(): void {
  }

  public onPageAction(action: PaginatorButtonAction): void {
    switch (action) {
      case 'first':
        if (this.value.page <= 0) {
          return;
        }

        this.value = {
          page: 0,
          pageSize: this.value.pageSize,
          totalCount: this.value.totalCount,
        };
        break;
      case 'prev':
        if (this.value.page <= 0) {
          return;
        }

        this.value = {
          page: this.value.page - 1,
          pageSize: this.value.pageSize,
          totalCount: this.value.totalCount,
        };
        break;
      case 'next':
        if (this.value.page >= this.lastPage) {
          return;
        }

        this.value = {
          page: this.value.page + 1,
          pageSize: this.value.pageSize,
          totalCount: this.value.totalCount,
        };
        break;
      case 'last':
        if (this.value.page >= this.lastPage) {
          return;
        }

        this.value = {
          page: this.lastPage,
          pageSize: this.value.pageSize,
          totalCount: this.value.totalCount,
        };
        break;
      default:
        console.warn('Пагинатор: неизвестное действие');
        break;
    }

    this.paginate.emit(this.value);
  }

  /**
   * Изменение размера страницы
   */
  public onPageSizeChange(event: InputEvent): void {
    const selectEl = event.target as HTMLSelectElement;
    const pageSize = Number.parseInt(selectEl.value, 10);
    if (!Number.isNaN(pageSize)) {
      this.value.pageSize = pageSize;
    }

    this.paginate.emit(this.value);
  }
}
