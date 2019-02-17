import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Legislator } from './../models/legislator';

import {DatashareService} from '../services/datashare.service';
import {AbstractService} from './abstract.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService extends AbstractService{
  result:any; 
  resultop:any;

  serviceUrl:string;// = "http://127.0.0.1:8080/profile/template";
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor (private http: HttpClient, private dataShareService:DatashareService) {
    super();

    this.serviceUrl = dataShareService.getServiceUrl() + "/profile/template";
  }
  

  getProfileTemplateData(profileTemplateId:String):Observable<any> {    
      let serviceUrl = this.serviceUrl + "/getProfileTemplate/" + profileTemplateId;
      console.log("getProfileTemplateData profile.service this.serviceUrl " + serviceUrl);
      let headers      = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
//      let options       = new RequestOptions({ headers: headers }); // Create a request option

      // return this.http.get(serviceUrl, options) // ...using post request
      //                  .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
      //                  .catch((error:any) => {
      //                    console.error('UI error handling' + JSON.stringify(error));
      //                    return Observable.throw(error.json().error || 'Server error')
      //                  });
      return this.http.get(serviceUrl, this.httpOptions)
      .pipe(
        //map((response:Response) => response.json()), 
        tap(_ => this.log(`fetched getProfileTemplateData`)),
        catchError(this.handleError<any>(`Error in getProfileTemplateData()`))
      );                            
  }


}
