import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
//import { ReactiveFormsModule }    from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
//import { HttpModule } from '@angular/http';
import { HttpClientModule, HttpClientJsonpModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';

import {AuthenticationService} from '../app/services/authentication.service';
import { AuthGuard } from '../app/auth/auth.guard';
import {AppHttpInterceptor} from '../app/auth/app-http-interceptor';

//import {NgbTabsetModule, NgbDropdownModule, NgbTypeaheadModule} from '@ng-bootstrap/ng-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularFontAwesomeModule } from 'angular-font-awesome';

import { AppRoutingModule } from './app-routing.module';
import {SecurityModule} from './components/security/security.module';
import {PostModule} from './components/post/post.module';
import {GpxUIComponentsModule} from './components/gpx-uicomponents/gpx-uicomponents.module';

import { AppComponent } from './app.component';

import { BannerComponent } from './components/banner/banner.component';
import { TypeaheadComponent } from './components/typeahead/typeahead.component';
import { SearchlegislatorsComponent } from './components/searchlegislators/searchlegislators.component';
import { LegislatorComponent } from './components/legislator/legislator.component';
import { PositionComponent } from './components/position/position.component';
import { PartyComponent } from './components/party/party.component';
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
export function tokenGetter() {
  return localStorage.getItem('currentUserToken');
}

@NgModule({
  declarations: [
    AppComponent,
    BannerComponent,
    TypeaheadComponent,
    SearchlegislatorsComponent,
    LegislatorComponent,
    PositionComponent,
    PartyComponent,
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
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ['localhost:5000'],
        blacklistedRoutes: ['localhost:5000/login']
      }
    }),
    AngularFontAwesomeModule,
    SecurityModule,
    PostModule,
    GpxUIComponentsModule
    // RouterModule.forRoot(
    //   appRoutes,
    //   { enableTracing: true } // <-- debugging purposes only
    // )
  ],
  providers: [
    //{
    //provide: HTTP_INTERCEPTORS,
    //useClass: AppHttpInterceptor,
    //multi: true
  //},
  AuthenticationService,
  AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { 

}
