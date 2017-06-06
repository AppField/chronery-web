import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WorkCardComponent } from './work-card';

@NgModule({
  declarations: [
    WorkCardComponent,
  ],
  imports: [
    IonicPageModule.forChild(WorkCardComponent),
  ],
  exports: [
    WorkCardComponent
  ]
})
export class WorkCardComponentModule {}
