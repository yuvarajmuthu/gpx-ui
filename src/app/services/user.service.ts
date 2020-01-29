import { Injectable, isDevMode } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import {DatashareService} from '../services/datashare.service';
import {AbstractService} from './abstract.service';

import {User} from '../models/user';
import { Connection } from '../models/connection';

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
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'http://localhost:4200'})
  };

  constructor (private http: HttpClient, 
    private dataShareService:DatashareService) {
    super();
    //this.serviceUrl = dataShareService.getServiceUrl() + "/api/social";
    this.serviceUrl = this.getUserService();
    this.devMode = isDevMode();
  }

  getUserService():string{
    return this.dataShareService.getServiceUrl() + "/user";
  }
  
  getPostService():string{
    return this.dataShareService.getServiceUrl() + "/post";
  }
  
  getSocialService():string{
    return this.dataShareService.getServiceUrl() + "/api/social";
  }

  getUserData(userId:String, external:boolean):Observable<any> { 
    let url:string;
    
    if(userId === "CREATE"){ // invoked during page creation
      	//get available Templates for an user
    }

    //bioguideId is of length 7 - sunfoundataion
    //if(userId.length == 7){

    //legis represent legislator     
     
    if(external){  
      url = '/assets/json/fromService/user-legis.json';   
    }else{
      url = '/assets/json/fromService/user.json';
    }


    url = this.getUserService()+"/"+userId+"/";

    


    console.log("getUserData() " + url);
    
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
    let serviceUrl = this.getSocialService();
    serviceUrl = serviceUrl + "/followPerson";
    console.log("follow User user.service " + request + " serviceUrl " + serviceUrl);
   //let bodyString = JSON.stringify(post); // Stringify payload
    // let headers      = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
    // let options       = new RequestOptions({ headers: headers }); // Create a request option

    // return this.http.post(serviceUrl, request, options) // ...using post request
    //                  .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
    //                  .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    return this.http.post(serviceUrl, request, this.httpOptions)
    .pipe(
      //map((response:Response) => response.json()),
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

 getRelationStatus(userId:string, districtId:string):Observable<string>{
  let serviceUrl = this.getSocialService()+"/getRelation";
  //console.log("follow district user.service " + request + " this.serviceUrl " + serviceUrl);
 //let bodyString = JSON.stringify(post); // Stringify payload
  let headers      = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
  //let myParams = new URLSearchParams();
  let myParams = new HttpParams();
  myParams.append('sourceEntityId', userId);
  myParams.append('targetEntityId', districtId);
  // let options       = new RequestOptions({ headers: headers, search:myParams }); // Create a request option

  // return this.http.get() (serviceUrl, options) // ...using post request
  //                  .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
  //                  .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
                   
  // this.httpOptions = {
  //                   headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  //                 };

  return this.http.get(serviceUrl, { responseType: 'text', params: {
    sourceEntityId: userId,
    targetEntityId: districtId
  } });

  //.pipe(
  //  map(data => this.data = data),
   // tap(_ => this.log(`fetched getRelation`)),
   // catchError(this.handleError<any>(`Error in getRelation()`))
  //);                
}

getFollowersCount(entityId:string):Observable<string>{
  let serviceUrl = this.getSocialService()+"/getFollowersCount";

  let headers      = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON

  return this.http.get(serviceUrl, { responseType: 'text', params: {
    entityId: entityId
  } });

}

getFollowers(entityId:string):Observable<any>{
  let serviceUrl = this.getSocialService()+"/getFollowers";

  let headers      = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
  let myParams = new HttpParams();
  myParams.append('entityId', entityId);

  return this.http.get(serviceUrl, { responseType: 'json', params: {
    entityId: entityId
  } }).pipe(
    tap(_ => this.log(`fetched getFollowers`)),
    catchError(this.handleError<any>(`Error in getFollowers()`))
  );
  
}

getConnectionRequests(entityId:string):Observable<any>{
  let serviceUrl = this.getSocialService()+"/getConnectionsByStatus"+"/"+entityId+"/";

  return this.http.get(serviceUrl, { responseType: 'json', params: {
    status: 'REQUESTED'
  } }).pipe(
    tap(_ => this.log(`fetched getConnectionRequests`)),
    catchError(this.handleError<any>(`Error in getConnectionRequests()`))
  );
  
}

getBiodata(userId:string, userType:string):Observable<any>{ 
  let serviceUrl = this.getUserService() +"/legis/biodata/"+userId+"/";    


  //let headers      = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
  this.httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'userType': userType})
  };
  return this.http.get(serviceUrl, this.httpOptions)
  .pipe(
    //map((response:Response) => response.json()),
    tap(_ => this.log(`fetched getBiodata`)),
    catchError(this.handleError<any>(`Error in getBiodata()`))
  );                
}

getRoles(userId:string, isCongress:boolean):Observable<any>{ 
  let serviceUrl = this.getUserService() +"/legisv1/congress/roles/"+userId;

  let headers      = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
  return this.http.get(serviceUrl, this.httpOptions)
  .pipe(
//    map((response:Response) => response.json()),
    tap(_ => this.log(`fetched getRoles`)),
    catchError(this.handleError<any>(`Error in getRoles()`))
  );                
}

getOffices(userId:string, isCongress:boolean):Observable<any>{ 
  
  let serviceUrl = this.getUserService() +"/legisv1/congress/offices/"+userId;

  let headers      = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
  return this.http.get(serviceUrl, this.httpOptions)
  .pipe(
//    map((response:Response) => response.json()),
    tap(_ => this.log(`fetched getOffices`)),
    catchError(this.handleError<any>(`Error in getOffices()`))
  );                
}

/*
getProfileImage(userId:string):Observable<any>{ 
  let serviceUrl = this.getUserService() +"/legisv1/roles/"+userId;
  let headers      = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
  return this.http.get(serviceUrl, this.httpOptions)
  .pipe(
    //map((response:Response) => response.json()),
    tap(_ => this.log(`fetched getRoles`)),
    catchError(this.handleError<any>(`Error in getRoles()`))
  );                
}
*/
  /* OBSOLETED BY getRelationStatus()*/
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

registerUser(user: User):Observable<any> {
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

updateUserSmProfileImage(request:FormData):Observable<any>{
  let serviceUrl = this.getUserService() + "/uploadUserSmProfileImage";
  console.log("uploadUserSmProfileImage user.service " + request + " this.serviceUrl " + serviceUrl);
  
  this.httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'multipart/form-data'})
  };

  return this.http.post(serviceUrl,  request )
  .pipe(
    map((response:Response) => response.json()),
    tap(_ => this.log(`User profile image got uploaded successfully`)),
    catchError(this.handleError<any>(`Error in updateUserSmProfileImage()`))
  );
}

updateConnectionAction(request:Connection):Observable<any>{
  let serviceUrl = this.getSocialService()+"/connectionAction";
  console.log("updateConnectionAction user.service " + request + " serviceUrl " + serviceUrl);
 
  return this.http.post(serviceUrl, request, this.httpOptions)
  .pipe(
    map((response:Response) => response.json()),
    tap(_ => this.log(`posted updateConnectionAction`)),
    catchError(this.handleError<any>(`Error in updateConnectionAction()`))
  );
}

updateProfileData(request:any):Observable<any>{
  let serviceUrl = this.getUserService()+"/profileData/update";
  console.log("updateProfileData user.service " + request + " serviceUrl " + serviceUrl);
 
  return this.http.post(serviceUrl, request, this.httpOptions)
  .pipe(
    map((response:Response) => response.json()),
    tap(_ => this.log(`posted updateProfileData`)),
    catchError(this.handleError<any>(`Error in updateProfileData()`))
  );
}

update(user: User) {
    //return this.http.put('/api/users/' + user.id, user);
}

delete(id: number) {
    //return this.http.delete('/api/users/' + id);
}

getImage(userId: string): Observable<Blob> {
  let serviceUrl = this.getPostService() + "/downloadFile/user/" + userId + "/";
  console.log("getImage user.service " + serviceUrl);

  return this.http.get(serviceUrl, { responseType: 'blob' });
}




}
