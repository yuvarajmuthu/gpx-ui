import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpxInputComponent } from './gpx-input/gpx-input.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [GpxInputComponent],
  exports: [GpxInputComponent]

}) 
export class GpxUIComponentsModule { }
