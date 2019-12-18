import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UserComponent } from './user/user.component';
import { UsertemplateComponent } from './usertemplate/usertemplate.component';

import {UserRoutingModule} from './user-routing.module';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { BannerComponent } from '../banner/banner.component';

import { UserbannertemplateComponent } from './usertemplate/userbannertemplate/userbannertemplate.component';
import { UsercommitteetemplateComponent } from './usertemplate/usercommitteetemplate/usercommitteetemplate.component';
import { UserbiodatatemplateComponent } from './usertemplate/userbiodatatemplate/userbiodatatemplate.component';
import { UserroletemplateComponent } from './usertemplate/userroletemplate/userroletemplate.component';
import { UserofficetemplateComponent } from './usertemplate/userofficetemplate/userofficetemplate.component';
import { Usercard1Component } from './usercard1/usercard1.component';

import { PostModule } from '../post/post.module';
import {GpxUIComponentsModule} from '../../components/gpx-uicomponents/gpx-uicomponents.module';


import { UserstageComponent } from './userstage/userstage.component';

@NgModule({
  imports: [
    CommonModule, 
    FormsModule,
    ReactiveFormsModule,
    UserRoutingModule,
    GpxUIComponentsModule,
    NgbModule,
    PostModule
  ],
  declarations: [
    UserComponent, 
    UsertemplateComponent, 
    //BannerComponent, 
    UserbannertemplateComponent, UsercommitteetemplateComponent, UserbiodatatemplateComponent, 
    UserroletemplateComponent, UserofficetemplateComponent, Usercard1Component, UserstageComponent
  ],
  entryComponents:[UserstageComponent,UserbannertemplateComponent, UsercommitteetemplateComponent, 
    UserbiodatatemplateComponent, UserroletemplateComponent, UserofficetemplateComponent],
  //exports:[UserstageComponent]
})
export class UserModule { }
