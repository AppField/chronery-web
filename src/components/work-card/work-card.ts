import { Component } from '@angular/core';

/**
 * Generated class for the WorkCardComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'work-card',
  templateUrl: 'work-card.html'
})
export class WorkCardComponent {

  text: string;

  constructor() {
    console.log('Hello WorkCardComponent Component');
    this.text = 'Hello World';
  }

}
