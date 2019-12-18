import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams, HttpResponse} from "@angular/common/http";

import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

//import { Legislator } from './../models/legislator';
import { User } from './../models/user';

import {AbstractService} from './abstract.service';
import {DatashareService} from "./datashare.service";
import { ComponentcommunicationService }     from './componentcommunication.service';
import { AlertService } from './alert.service';

import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService extends AbstractService{
  serviceUrl:string;

//  private currentUserSubject = new BehaviorSubject<User>(new User()); 
 // private currentUser = this.currentUserSubject.asObservable();

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      observe: 'response' as 'response'
  };

  constructor (private http: HttpClient, 
    private dataShareService:DatashareService,
    private componentcommunicationService: ComponentcommunicationService,
    private alertService: AlertService,
    private jwtHelper: JwtHelperService) {
      super();
      this.serviceUrl = dataShareService.getServiceUrl();
      if(localStorage.getItem('currentUserToken')){
        //this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUserToken')));
        let user = new User();
        user.token = localStorage.getItem('currentUserToken');
        //this.currentUserSubject = new BehaviorSubject<User>(user); 
        //this.currentUser = this.currentUserSubject.asObservable();
        dataShareService.setCurrentUser(user);
      }
    }    
  /*
  public get currentUserValue(): User {
      return this.currentUserSubject.value;
  }
*/
  login(user:User) {

      let bodyString = JSON.stringify(user); // Stringify payload

      //let headers      = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
      //let options       = new RequestOptions({ headers: headers }); // Create a request option
      
      //this.serviceUrl = this.serviceUrl + '/login';
      //options = { username: username, password: password };
      let loginServiceUrl = this.serviceUrl + '/login';
      console.log("login::authentication.service invoking service " + loginServiceUrl);
      
      //return this.http.post<{token: string}>(loginServiceUrl, user, this.httpOptions);


      return this.http.post<{token: string}>(loginServiceUrl, user, this.httpOptions)
      .pipe(
        map((res: HttpResponse<any>) => {
          //console.log("res.headers.get('Authorization') ", res.headers.get('Authorization'));
          if(res.headers.get('Authorization')){
            var tokenBearer = res.headers.get('Authorization').split(' ');
            if(tokenBearer.length === 2){
              localStorage.setItem('currentUserToken', tokenBearer[1]);          
            }
          }

          let userObj = new User();
          userObj.token = localStorage.getItem('currentUserToken');
          userObj.username = user.username; 
          this.dataShareService.setCurrentUser(userObj);

//          this.componentcommunicationService.loginChanged(true);
          this.alertService.success('Login successful', true);
          
          return true;
        })
      );
/*
return this.http.post(loginServiceUrl, user, this.httpOptions)
            .do(res => this.setSession) 
            .shareReplay();
*/
/*
      return this.http.post<any>(loginServiceUrl, user, this.httpOptions)
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        user = <User>result;
        if (user && user.token) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
        }

        return user;
    }));
*/
      // return this.http.post(this.serviceUrl + '/login', bodyString, options) // ...using post request
      // .map(user => {
      //     // login successful if there's a jwt token in the response
      //     if (user) {
      //         // store user details and jwt token in local storage to keep user logged in between page refreshes
      //         localStorage.setItem('currentUser', JSON.stringify(user));
      //     }

      //     return user;
      // })
      // .catch((error:any) => Observable.throw(error.error || error.json() || error || 'Server error'));


      /*
      return this.http.post(this.serviceUrl, request, options)
          .map(user => {
              // login successful if there's a jwt token in the response
              if (user && user.token) {
                  // store user details and jwt token in local storage to keep user logged in between page refreshes
                  localStorage.setItem('currentUser', JSON.stringify(user));
              }

              return user;
          });
          */
  }
//  private setSession(authResult) {
    //const expiresAt = moment().add(authResult.expiresIn,'second');

 //   localStorage.setItem('id_token', authResult.idToken);
    //localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()) );
//}

  logout() {
      // remove user from local storage to log user out
      localStorage.removeItem('currentUserToken');
      //this.currentUserSubject.next(null);
      this.dataShareService.setCurrentUser(null);
  //    this.componentcommunicationService.loginChanged(false);
      this.alertService.success('Logout successful', true);
  }

  //OBSOLETE
  getBearerToken():string{
    return localStorage.getItem('currentUserToken');
  }

}
