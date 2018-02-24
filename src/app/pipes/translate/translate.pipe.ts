import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'translate'
})
export class TranslatePipe implements PipeTransform {
  private lang: string;

  constructor(@Inject(LOCALE_ID) locale: string) {
    this.lang = locale;
  }

  transform(textId: string): string {

    switch (textId) {
      case 'printdate':
        switch (this.lang) {
          case 'de':
            return 'Druckdatum';
          default:
            return 'Printdate';
        }
      case 'date':
        switch (this.lang) {
          case 'de':
            return 'Datum';
          default:
            return 'Date';
        }
      case 'projectNumber':
        switch (this.lang) {
          case 'de':
            return 'Projektnummer';
          default:
            return 'Project Number';
        }
      case 'projectName':
        switch (this.lang) {
          case 'de':
            return 'Projektname';
          default:
            return 'Project Name';
        }
      case 'comment':
        switch (this.lang) {
          case 'de':
            return 'Kommentar';
          default:
            return 'Comment';
        }
      case 'from':
        switch (this.lang) {
          case 'de':
            return 'Von';
          default:
            return 'Bis';
        }
      case 'to':
        switch (this.lang) {
          case 'de':
            return 'Bis';
          default:
            return 'To';
        }
      case 'hours':
        switch (this.lang) {
          case 'de':
            return 'Stunden';
          default:
            return 'Hours';
        }
      case 'total':
        switch (this.lang) {
          case 'de':
            return 'Gesamt';
          default:
            return 'Total';
        }
      case 'page':
        switch (this.lang) {
          case 'de':
            return 'Seite';
          default:
            return 'Page';
        }
      case 'of':
        switch (this.lang) {
          case 'de':
            return 'von';
          default:
            return 'of';
        }
      case 'report':
        switch (this.lang) {
          case 'de':
            return 'Bericht';
          default:
            return 'Report';
        }
      case 'itemsPerPageLabel':
        switch (this.lang) {
          case 'de':
            return 'Einträge pro Seite';
          default:
            return 'Items per page';
        }
      case 'nextPageLabel':
        switch (this.lang) {
          case 'de':
            return 'Nächste Seite';
          default:
            return 'Next page';
        }
      case 'previousPageLabel':
        switch (this.lang) {
          case 'de':
            return 'Vorherige Seite';
          default:
            return 'Previous page';
        }
      default:
        return textId;
    }
  }

}
