import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
//import { ReactiveFormsModule }    from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
//import { HttpModule } from '@angular/http';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';

//import {NgbTabsetModule, NgbDropdownModule, NgbTypeaheadModule} from '@ng-bootstrap/ng-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import {SecurityModule} from './components/security/security.module';

import { AppComponent } from './app.component';

//import { BannerComponent } from './components/banner/banner.component';
import { TypeaheadComponent } from './components/typeahead/typeahead.component';
import { SearchlegislatorsComponent } from './components/searchlegislators/searchlegislators.component';
import { LegislatorComponent } from './components/legislator/legislator.component';
//import {UserComponent} from './components/user/user/user.component';

//import { GpxInputComponent } from './gpx-input/gpx-input.component';

// const appRoutes: Routes = [
//   { path: 'user', component: TypeaheadComponent },
//   // { path: 'distrcit',      component: HeroDetailComponent },
//   // {
//   //   path: 'heroes',
//   //   component: HeroListComponent,
//   //   data: { title: 'Heroes List' }
//   // },
//   // { path: '',
//   //   redirectTo: '/heroes',
//   //   pathMatch: 'full'
//   // },
//   // { path: '**', component: PageNotFoundComponent }
//   { path: '**', component: SearchlegislatorsComponent }
// ];

@NgModule({
  declarations: [
    AppComponent,
    //BannerComponent,
    TypeaheadComponent,
    SearchlegislatorsComponent,
    LegislatorComponent,
    //UserComponent
    //GpxInputComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    HttpClientJsonpModule,
    FormsModule,
    //ReactiveFormsModule, // formGroup
     //NgbTabsetModule, 
     //NgbDropdownModule, 
     //NgbTypeaheadModule,
    //HttpModule,
    NgbModule,
    SecurityModule
    // RouterModule.forRoot(
    //   appRoutes,
    //   { enableTracing: true } // <-- debugging purposes only
    // )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { 

}
