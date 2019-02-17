import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import {DatashareService} from '../services/datashare.service';
import {AbstractService} from './abstract.service';

import {User} from '../models/user';

// Import RxJs required methods:
//import 'rxjs/add/operator/map';
//import 'rxjs/add/operator/catch';

@Injectable({
  providedIn: 'root'
})
export class UserService extends AbstractService{
  serviceUrl:string;// = "http://127.0.0.1:8080/api/social";
  devMode:boolean = true;
  result:any; 
  resultop:any;

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor (private http: HttpClient, 
    private dataShareService:DatashareService) {
    super();
    this.serviceUrl = dataShareService.getServiceUrl() + "/api/social";
  }

  getUserData(userId:String, external:boolean):Observable<any> { 
    /*
    let groupData = this.http.get('/app/data/json/fromService/group.json')
                             .map((response:Response) => response.json());
    console.log("group data " + groupData);
    return groupData;
*/
    let url:string;
    
    //bioguideId is of length 7 - sunfoundataion
    //if(userId.length == 7){

    //legis represent legislator      
    if(external){  
      url = '/assets/json/fromService/user-legis.json';
    }else{
      url = '/assets/json/fromService/user.json';
    }
    console.log("getUserData() " + url);
    // return this.http.get(url)
    //                          .map((response:Response) => response.json());
    return this.http.get(url, this.httpOptions)
    .pipe(
      //map((response:Response) => response.json()), 
      tap(_ => this.log(`fetched getUserData`)),
      catchError(this.handleError<any>(`Error in getUserData()`))
    );                         
  }

  followDistrict(request:string):Observable<any>{
    let serviceUrl = this.serviceUrl+"/followDistrict";
    console.log("follow district user.service " + request + " this.serviceUrl " + serviceUrl);
   //let bodyString = JSON.stringify(post); // Stringify payload
    // let headers      = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
    // let options       = new RequestOptions({ headers: headers }); // Create a request option

    // return this.http.post(serviceUrl, request, options) // ...using post request
    //                  .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
    //                  .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    return this.http.post(serviceUrl, request, this.httpOptions)
    .pipe(
      map((response:Response) => response.json()),
      tap(_ => this.log(`posted followDistrict`)),
      catchError(this.handleError<any>(`Error in followDistrict()`))
    );                 
  }

  followPerson(request:string):Observable<any>{
    let serviceUrl = this.serviceUrl+"/followPerson";
    console.log("follow User user.service " + request + " this.serviceUrl " + serviceUrl);
   //let bodyString = JSON.stringify(post); // Stringify payload
    // let headers      = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
    // let options       = new RequestOptions({ headers: headers }); // Create a request option

    // return this.http.post(serviceUrl, request, options) // ...using post request
    //                  .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
    //                  .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    return this.http.post(serviceUrl, request, this.httpOptions)
    .pipe(
      map((response:Response) => response.json()),
      tap(_ => this.log(`posted followPerson`)),
      catchError(this.handleError<any>(`Error in followPerson()`))
    );                 
  }
/*
  getRelation(userId:string, groupId:string):Observable<any>{
    console.log("getRelation()::UserService " + userId + " , " + groupId);
    let response = {};
    response['data'] = true;
    return response.json();

  }
  */
  getRelation(userId:string, districtId:string):Observable<any>{
    let serviceUrl = this.serviceUrl+"/getRelation";
    //console.log("follow district user.service " + request + " this.serviceUrl " + serviceUrl);
   //let bodyString = JSON.stringify(post); // Stringify payload
    let headers      = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
    //let myParams = new URLSearchParams();
    let myParams = new HttpParams();
    myParams.append('userId', userId);
    myParams.append('districtId', districtId);
    // let options       = new RequestOptions({ headers: headers, search:myParams }); // Create a request option

    // return this.http.get() (serviceUrl, options) // ...using post request
    //                  .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
    //                  .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
                     
    // this.httpOptions = {
    //                   headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    //                 };

    return this.http.get(serviceUrl, {params: myParams, headers: new HttpHeaders({ 'Content-Type': 'application/json' })})
    .pipe(
      map((response:Response) => response.json()),
      tap(_ => this.log(`fetched getRelation`)),
      catchError(this.handleError<any>(`Error in getRelation()`))
    );                
  }

getAll() {
    //return this.http.get<User[]>('/api/users');
  return this.http.get('/api/users');
}

getById(id: number) {
  //return this.http.get('/api/users/' + id);
}

registerUser(user: User) {
//        return this.http.post('/register', user);

    //console.log("registering user user.service");
  let bodyString = JSON.stringify(user); // Stringify payload
   let headers      = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
   //let options       = new RequestOptions({ headers: headers }); // Create a request option

   console.log("registerUser::user.service invoking service " + this.serviceUrl);

   return this.http.post(this.serviceUrl, user, this.httpOptions)
    .pipe(
      map((response:Response) => response.json()),
      tap(_ => this.log(`Successfully registered User`)),
      catchError(this.handleError<any>(`Error in registering User()`))
    );

  //  return this.http.post(this.serviceUrl, bodyString, options) // ...using post request
  //                   .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
  //                   .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
}

update(user: User) {
    //return this.http.put('/api/users/' + user.id, user);
}

delete(id: number) {
    //return this.http.delete('/api/users/' + id);
}

}
