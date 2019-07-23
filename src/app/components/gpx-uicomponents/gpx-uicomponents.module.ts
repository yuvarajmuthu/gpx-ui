import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpxInputComponent } from './gpx-input/gpx-input.component';
import { GpxFileuploadComponent } from './gpx-fileupload/gpx-fileupload.component';
import { AlertComponent } from './alert/alert.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [GpxInputComponent, GpxFileuploadComponent, AlertComponent],
  exports: [GpxInputComponent, GpxFileuploadComponent, AlertComponent]

}) 
export class GpxUIComponentsModule { }
