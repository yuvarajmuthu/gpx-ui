import { Component, OnInit, Input } from '@angular/core';
import { Router } from "@angular/router";

import {UserService} from '../../../services/user.service';
import {DatashareService} from '../../../services/datashare.service';


import {User} from '../../../models/user'; 

@Component({
  selector: 'app-usercard1',
  templateUrl: './usercard1.component.html',
  styleUrls: ['./usercard1.component.css']
})
export class Usercard1Component implements OnInit {
  @Input() user: User;
  @Input() username:string;
  profileSmImage:any;
  isImageLoading:boolean = false;
  loggedUser:User = null;

  following:boolean = false;
  requestedToFollow:boolean = false;
  followRequestRejected:boolean = false;


  constructor(private  router: Router, 
    private userService:UserService, private datashareService:DatashareService    ) { }

  ngOnInit() {
    if(this.user && this.user.username){
      this.getProfileSmImage(this.user.username);
    }  

    this.loggedUser = this.datashareService.getCurrentUser();
  } 

  getProfileSmImage(userId:string) {
    this.isImageLoading = true;
    this.userService.getImage(userId).subscribe(data => {
      this.createImageFromBlob(data);
      this.isImageLoading = false;
    }, error => {
      this.isImageLoading = false;
      console.log(error);
    });
  } 
  
  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      this.profileSmImage = reader.result;
    }, false);
  
    if (image) {
      reader.readAsDataURL(image);
    }
  }

  loadUser(){
    let url = '/user/' + this.user.username;
    this.router.navigate([url]);
    return false;
  }

  followEntity(){

    var followURequest = {};
    var sourceEntity={};
    var targetEntity={}; 
    
    /*MAY NOT BE REQUIRED - BEGIN */
    followURequest["userId"] = this.loggedUser.username;// this.datashareService.getCurrentUserId();
    followURequest["connectionUserId"] = this.user.username;
    /*MAY NOT BE REQUIRED - END */

    followURequest["sourceEntityId"] = this.loggedUser.username;//this.datashareService.getCurrentUserId();
    followURequest["sourceEntityType"] = "USER";
    followURequest["targetEntityId"] = this.user.username;
    
    followURequest["targetEntityType"] = "USER";
    followURequest["status"] = "REQUESTED";            
    console.log("Profile data " + JSON.stringify(followURequest));      

    this.userService.followPerson(JSON.stringify(followURequest))
    .subscribe(
      (result) => {
          console.log("followDistrict response " + result);

          if(result.status == "REQUESTED"){
            this.requestedToFollow = true;
          }else if(result.status == "FOLLOWING"){
            this.following = true;
          }else if(result.status == "REJECTED"){
            this.followRequestRejected = true; 
          }

        },
      (err) => {
        console.log("Error ", err);
      });
      return false;
  }


}
