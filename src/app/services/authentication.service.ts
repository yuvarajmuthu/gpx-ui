import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

//import { Legislator } from './../models/legislator';
import { User } from './../models/user';

import {AbstractService} from './abstract.service';
import {DatashareService} from "./datashare.service";


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService extends AbstractService{
  serviceUrl:string;

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor (private http: HttpClient, private dataShareService:DatashareService) {
      super();
      this.serviceUrl = dataShareService.getServiceUrl();
    }    

  login(user:User) {

      let bodyString = JSON.stringify(user); // Stringify payload

      let headers      = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
      //let options       = new RequestOptions({ headers: headers }); // Create a request option
      
      //this.serviceUrl = this.serviceUrl + '/login';
      //options = { username: username, password: password };

      console.log("login::authentication.service invoking service " + this.serviceUrl+ '/login');

      return this.http.post(this.serviceUrl, user, this.httpOptions)
      .pipe(
        map((response:Response) => response.json()),
        tap(_ => this.log(`successful login`)),
        catchError(this.handleError<any>(`Error in login()`))
      );

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

  logout() {
      // remove user from local storage to log user out
      localStorage.removeItem('currentUser');
  }
}
