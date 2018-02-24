import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material';
import { TranslatePipe } from '../app/pipes/translate/translate.pipe';

@Injectable()
export class MatPaginatorIntlI18n extends MatPaginatorIntl {
  itemsPerPageLabel;
  nextPageLabel;
  previousPageLabel;
  getRangeLabel = (function (page: number, pageSize: number, length: number) {
    if (length === 0 || pageSize === 0) {
      return `0 ${this.translate.transform('of')} ${length}`;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    return `${startIndex + 1} - ${endIndex} ${this.translate.transform('of')} ${length}`;
  }).bind(this);

  constructor(private translate: TranslatePipe) {
    super();
    this.itemsPerPageLabel = translate.transform('itemsPerPageLabel');
    this.nextPageLabel = translate.transform('nextPageLabel');
    this.previousPageLabel = translate.transform('previousPageLabel');
  }

}
