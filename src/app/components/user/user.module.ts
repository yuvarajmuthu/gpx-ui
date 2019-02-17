import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UserComponent } from './user/user.component';
import { UsertemplateComponent } from './usertemplate/usertemplate.component';

import {UserRoutingModule} from './user-routing.module';
//import {GpxUIComponentsModule} from '../gpx-uicomponents/gpx-uicomponents.module';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { BannerComponent } from '../banner/banner.component';

import { UserbannertemplateComponent } from './usertemplate/userbannertemplate/userbannertemplate.component';
import { UsercommitteetemplateComponent } from './usertemplate/usercommitteetemplate/usercommitteetemplate.component';
import { UserbiodatatemplateComponent } from './usertemplate/userbiodatatemplate/userbiodatatemplate.component';


@NgModule({
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    UserRoutingModule,
    //GpxUIComponentsModule,
    NgbModule
  ],
  declarations: [
    UserComponent, 
    UsertemplateComponent, 
    BannerComponent, UserbannertemplateComponent, UsercommitteetemplateComponent, UserbiodatatemplateComponent
  ],
  entryComponents:[UserbannertemplateComponent, UsercommitteetemplateComponent, UserbiodatatemplateComponent]
})
export class UserModule { }
