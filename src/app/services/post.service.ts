import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import {DatashareService} from '../services/datashare.service';
import {AbstractService} from './abstract.service';

import {Post} from '../models/post';

@Injectable({
  providedIn: 'root'
})
export class PostService  extends AbstractService{

  serviceUrl:string;// = "http://127.0.0.1:8080/post";	
  
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor (private http: HttpClient, 
    private dataShareService:DatashareService) {
      super();
      this.serviceUrl = dataShareService.getServiceUrl() + "/post";
  }

  //deprecated
  getPost():Post[] { 
  	var postJson = {};
  	var posts:JSON[];
	var postsPromise : Post[] = [];

	var localPost:string;
	if(localPost = localStorage.getItem("userPosts")){
		console.log('from Post Service - localPost ' + localPost);
		postJson = JSON.parse(localPost);
		posts = postJson['postArray'];
		console.log('from Post Service - parsed Post ' + posts);

		for (var i = 0; i < posts.length; i++) {
		    var post = {};
		    var postPromise : Post = {} as Post;
		    post = posts[i];
		    console.log('reading properties - ' + post['txtPost']);

		    postPromise.userId = 'ymuthu';
		    postPromise.postText = post['txtPost'];

		    postsPromise.push(postPromise);
		}


	}
  	//typecast to post object
  	console.log('returning posts ' + postsPromise.length);
  	return postsPromise;  
  }


  getActivities(requestData:string) {
    var postJson = {};
  	var posts:JSON[];
	  var postsPromise : Post[] = [];
    
    var serviceUrl = this.serviceUrl + "/getAllPosts";
    serviceUrl = '/assets/json/fromService/post.json';
/////////
    let requestJson = JSON.parse(requestData);
    let requestParams = new URLSearchParams();
    requestParams.set("entityId", requestJson['entityId']);
    requestParams.set("entityType", requestJson['entityType']);

    let headers      = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
    //let options       = new RequestOptions({ headers: headers, search:requestParams }); // Create a request option
    console.log("gonna get posts");
    return this.http.get(serviceUrl, this.httpOptions)
    .pipe(
//      map((response:Response) => response.json()),
      map((result) => {
        let posts = [];
        posts = result["results"];  

        //posts = data['results'];
        console.log('from Post Service - parsed Post length ' + posts.length);

        for (var i = 0; i < posts.length; i++) {
            //var post : Post = {} as Post;
            console.log('reading properties - ' + JSON.stringify(posts[i]));                        
            //post = Post.decodePost(posts[i]);
            //console.log('reading properties - ' + post.id);

            postsPromise.push(posts[i]);
        }

            return postsPromise;      
              }), 
      tap(_ => this.log(`fetched getActivities`)),
      catchError(this.handleError<any>(`Error in getActivities()`))
    );                         
  }

  //post the comment to the server
  //postComment(post:Post):Observable<any>{
  postComment(postFormData:FormData):Observable<any>{  
    //console.log("postComment post.service " + JSON.stringify(post));
  console.log("postComment post.service " + JSON.stringify(postFormData));  
  console.log("formData.get('file')", postFormData.get('file'));
  console.log("formData.get('post')", postFormData.get('post'));
 	//let bodyString = JSON.stringify(post); // Stringify payload
  //let headers      = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
  /*
  let headers      = new Headers(
    { 'Content-Type': 'multipart/form-data' 
    }
    );
  */
   const httpOptions = {
      headers: new HttpHeaders({ "Accept": "application/json" })
    }  
//'authorization':'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbjEiLCJleHAiOjE1NTIzMzQwMjB9.oc3UvgnfGqVsy_sWdEcdAQrZjuv10p6IxPoDwp_Z9A0-d-ZRBRy8WcIOictG427B6D6DKOTf5MvrFPzKCr0rCA'  
	console.log("postComment::post.service invoking service " + this.serviceUrl);
  return this.http.post(this.serviceUrl, postFormData, httpOptions)
  .pipe(
    map((response:Response) => response.json()),
    tap(_ => this.log(`posted Comment`)),
    catchError(this.handleError<any>(`Error in postComment()`))
  );                 


  }



}
