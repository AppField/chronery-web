import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DayPickerPage } from './day-picker';

@NgModule({
  declarations: [
    DayPickerPage,
  ],
  imports: [
    IonicPageModule.forChild(DayPickerPage),
  ],
  exports: [
    DayPickerPage
  ]
})
export class DayPickerPageModule {}
