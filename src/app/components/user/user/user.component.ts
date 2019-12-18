import {Component, ViewContainerRef, ViewChild, ElementRef, Renderer, ChangeDetectorRef, ComponentRef, Input, OnInit, isDevMode} from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";

// import { TAB_DIRECTIVES } from 'ng2-bootstrap/components/tabs';
// import { CollapseDirective } from 'ng2-bootstrap/components/collapse';
// import {RatingComponent} from 'ng2-bootstrap/components/rating';
// import { DROPDOWN_DIRECTIVES } from 'ng2-bootstrap/components/dropdown';

import { Legislator } from '../../../models/legislator';
import {User} from '../../../models/user'; 

//import {BannerGPXComponent} from './banner.component';

//import {PeopleComponentGPX} from './people.component';
//import {NdvEditComponent} from './editableText.component';
//import {LegislatorComponentGPX} from './legislator.component';
//import {DynamicContentComponent} from './userProfile.template.component';
import {UsertemplateComponent} from '../usertemplate/usertemplate.component';
//import {PostComponent} from '../../post/post.component';

import {DatashareService} from '../../../services/datashare.service';
import {UserService} from '../../../services/user.service';
import { LegislatorService } from '../../../services/legislator.service';
import { ComponentcommunicationService }     from '../../../services/componentcommunication.service';
import { AlertService } from '../../../services/alert.service'; 

//import {TopnavbarComponent} from '../../nav/topnavbar/topnavbar.component';

@Component({
  selector: 'app-user',
  templateUrl: './user3.component.html',
  styleUrls: ['./user2.component.css']
})
export class UserComponent implements OnInit {

  @Input() profileUserId:string = "";
  legisId:string = "";

	public isCollapsed:boolean = false;
	public isCMCollapsed:boolean = false;
	public isPartiesCollapsed:boolean = false;
  private isProfileEditMode:boolean = false;
	public electedPersonsOld=[];
  public electedPersons:Array<Legislator>;
	public contestedPersons=[];
	public parties=[];
  public connections=[];
  templateType = [];
  private componentRef: ComponentRef<{}>;
  private userData = {};
  private viewingUser={};  
  private firstName;
  private lastName;
  public profilesTemplates = [];
  public profilesData = [];
  public isLegislator = false;
  operation:string = "";
  profileImage:string="";
  profileSmImage:any;
  bannerImage:any;
  isImageLoading:boolean = false;
  isProfileCollapsed:boolean = false;
  isActivityCollapsed:boolean = true;

  activities:number = 0;  
      //private populationComponent: TemplatePopulationComponent;
  profileEditOption:string;

  following:boolean = false;
  requestedToFollow:boolean = false;
  followRequestRejected:boolean = false;

  currentUser:User = null;
  loggedUser:User = null;
  postFormData:FormData;
  editLabel:string = null;
  followersCount:string = null;
  followers:User[] = [];
  selectedProfileSmImage : File;
  profileSmImageChanged : boolean = false;
  paramUsername:string = "";
  profileTabSelected:boolean = true;
  activitiesTabSelected:boolean = false; 
  isSelfProfile:boolean = false;

  constructor(//private  router: Router,
    private route: ActivatedRoute,
    private userService:UserService, 
    private missionService: ComponentcommunicationService, 
    //private elementRef:ElementRef, 
    //private renderer: Renderer, 
    private legislatorsService:LegislatorService, 
    //private peopleService: PeopleService, 
    //private partyService: PartyService, 
    private datashareService:DatashareService) {  
      this.currentUser = this.datashareService.getCurrentUser();  
      
      missionService.userProfileEditChanged$.subscribe(
        mission => {
          console.log("Received edit-save Profile message " + mission);
          if(!mission){
            this.saveProfile();
          }

        });

  }
  
  //MAY BE OBSOLETE
  //get invoked automatically before ngOnInit()
  //routerOnActivate(curr: RouteSegment): void {
    routerOnActivate(): void {
    // if(curr.getParam("id")){
    //   if(curr.getParam("id") == "CREATE"){
    //     this.operation = curr.getParam("id");
    //   }else{
    //     this.profileUserId = curr.getParam("id");
    //     //this.dataShareService.setSelectedLegislatorId(this.profileUserId);
    //     console.log("from userProfile Param value - id " + this.profileUserId);
    //   }
    // }

/*    if(curr.getParam("legisId")){
      this.legisId = curr.getParam("legisId");
      this.profileUserId = this.legisId;
      console.log("from userProfile Param value - legisId " + this.legisId);      
    }  */
    console.log("from user.component routerOnActivate()");      

  }

  ngOnInit(){
    this.route.params.subscribe((params: Params) => {
      this.paramUsername = params['id'];
      console.log("from user.component route params changed " + this.paramUsername);      
      this.loadComponent(this.paramUsername);

      this.loggedUser = this.datashareService.getCurrentUser();
    

      if(this.paramUsername === this.loggedUser.username){
        this.isSelfProfile = true;
      }

   });

    this.bannerImage = "assets/images/user-banner1.jpg";
  }
  
  loadComponent(id:string){
    this.profileEditOption = this.getPermission(); 
    this.loggedUser = this.datashareService.getCurrentUser();
    //this.editProfile();
    //let id = this.route.snapshot.paramMap.get('id');
    this.editLabel = "Edit Profile";

    if(id){
      if(id == "CREATE"){
        this.operation = id;
      }else{
        this.profileUserId = id;
        //this.dataShareService.setSelectedLegislatorId(this.profileUserId);
        console.log("from userProfile Param value - id " + this.profileUserId);
      }
    }

//    console.log("User type: ", this.userData['userType']);
    if(this.operation == "CREATE"){
//      this.loadProfileTemplate();      
      this.datashareService.setPermission("Editor");  

      this.loadProfileTemplates(this.operation);


    }else{  
      if(this.profileUserId == 'external'){
        //TODO
        //determine congress or state legislator
        //get bioguide id
        this.isLegislator = true; // may not be required
        this.viewingUser['isLegislator'] = true;
        //*** LEGISLATOR SELECTED FROM SEARCH SCREEN IS SET AS VIEWINGUSER - IN LEGISLATOR.COMPONENT ***/
        this.viewingUser['externalData'] = this.datashareService.getViewingUser();


        if(!this.viewingUser['externalData']['leg_id']){ //CONGRESS
          this.viewingUser['isCongress'] = true;
          let photoUrl = this.viewingUser['externalData']['photo_url'];
          let fileName = photoUrl.substring(photoUrl.lastIndexOf('/')+1);
          let bioguideId = fileName.substring(0, fileName.lastIndexOf('.'));
          console.log('bioguideId ', bioguideId);
          this.viewingUser['bioguideId'] = bioguideId;
          this.profileUserId = bioguideId;


        }else{//OPENSTATE
          this.viewingUser['isCongress'] = false;
          this.profileUserId = this.viewingUser['externalData']['id'];
        }
        this.viewingUser['external'] = true;
        //this.viewingUser['userId'] = this.profileUserId;
      } else{
         this.isLegislator = false; // may not be required
         this.viewingUser['external'] = false;
        this.viewingUser['isLegislator'] = false;             
      }
      this.viewingUser['userId'] = this.profileUserId;
      //console.log("User isLegislator: ", this.viewingUser['isLegislator']);



      //the user that is being viewed
      //this.dataShareService.setViewingUserId(this.profileUserId);
      
      this.getRelationStatus(this.loggedUser.username, this.profileUserId);
      this.getFollowersCount(this.profileUserId);
      this.getFollowers(this.profileUserId);
      
      
      this.userService.getUserData(this.viewingUser['userId'], this.viewingUser['external']).subscribe(
          data => {
            this.userData = data;
            console.log("User data from service: ", this.userData);

            //this may not be required as getRelationStatus() can be used
            //this.viewingUser['connections'] = this.userData['connections'];



            //this.viewingUser['followers'] = this.userData['followers'];
            
            if(this.viewingUser['external']){ // and not persisted
              if(isDevMode()){
                this.profileSmImage = "assets/images/temp/user-avatar.jpg";
              }else{
                this.profileSmImage = this.userData["photo_url"];
              }
            }else{
              this.getProfileSmImage(this.viewingUser['userId']);
            } 
            //getting the available profile templates for this user type - publicUser
            this.profilesTemplates = this.viewingUser['profileTemplates'] = data['profile'];
            console.log("profile templates: ", this.profilesTemplates);

            //getting the data for this user profile
            //this.profilesData = this.viewingUser['profilesData'] = this.userData['profileData'];
            this.profilesData = this.userData['profileData'];
            console.log("profile data: ", this.profilesData);

            //identifying the profile selected for this user profile, so those components shall be loaded
            let compTypes = [];
            for (let profileData of this.profilesData){
              console.log("loading template component: ", profileData['profile_template_id']);
              //this.templateType.push(profileData['profile_template_id']);
              compTypes.push(profileData['profile_template_id']); 
              if(profileData['profile_template_id'] === "upCongressLegislatorExternal"){ 
                //let profileItemData = profileData['data'][0];
                let profileItemData = profileData['data'];
                this.firstName = profileItemData['firstName'];
                this.lastName = profileItemData['lastName'];

              }
            }

            if(compTypes.length > 0){
              this.templateType = compTypes;
            }
            
            //setting here so it can be accessed globally
            this.datashareService.setViewingUser(this.viewingUser);
            console.log("this.dataShareService.getViewingUser() " + JSON.stringify(this.datashareService.getViewingUser()));  
          }
      );
    }

  }

  showProfile(){
    this.isProfileCollapsed=false; 
    this.isActivityCollapsed=true;
    this.profileTabSelected = true;
    this.activitiesTabSelected = false;
    return false;
  }
  
  showActivities(){
    this.isProfileCollapsed=true; 
    this.isActivityCollapsed=false;
    this.profileTabSelected = false;
    this.activitiesTabSelected = true;
    return false;
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


  editProfile(){
    //loggedin? and edited?, then set edit as true
    //loggedin? and not edited?, then set edit as false
    
    let edit:boolean = false;
    if(this.editLabel === "Edit Profile"){//Enabling to update the profile
      edit = true;
    }else{//Saving profile 
      edit = false;
    }
    
    this.datashareService.editProfile(edit);
    
    if(edit){
      this.editLabel = "Save";
    }else{
      this.editLabel = "Edit Profile";
    }
    this.missionService.userProfileChanged(edit);

  }
  
  cancelEditProfile(){
    
    this.editLabel = "Edit Profile";
    
    this.datashareService.editProfile(false);
    this.missionService.userProfileChanged(false);



  }

  isProfileEditable(){
    return this.datashareService.isProfileEditable() && this.loggedUser;//and     //logged in?
  }

  isUserLogged(){
    return (this.loggedUser != null && this.loggedUser['token'] != null); // and token expired ?
  }

  onProfileSmImageSelected(event) {
    console.log("file object ", event);
    let reader = new FileReader();
//      let formData = new FormData();  

    
    if (event.target.files && event.target.files[0]) {
        this.selectedProfileSmImage = event.target.files[0];
        reader.readAsDataURL(this.selectedProfileSmImage);
        reader.onload = (event) => {
          this.profileSmImage = event.target["result"]; 
        }
        this.profileSmImageChanged = true;
    } 
  }

  loadProfileTemplates(operation:string){
      this.userService.getUserData(operation, false).subscribe(
        data => {
        this.userData = data;
        console.log("loadTemplate()::userprofile.template - User data from service: ", this.userData);


          //getting the available profile templates for this user type
          this.profilesTemplates = this.viewingUser['profileTemplates'] = this.userData['profile'];
          console.log("loadTemplate()::userprofile.template - profile templates: ", this.profilesTemplates);

          //indicate the dynamic loaded to load th default template
          let compTypes = [];
            compTypes.push("upCongressLegislatorDefault");

          if(compTypes.length > 0){
            this.templateType = compTypes;
          }

          this.viewingUser['operation'] = this.operation;
          //setting here so it can be accessed globally
          this.datashareService.setViewingUser(this.viewingUser);



        }
    );
  }

  saveProfile(){
    console.log("Saving user.component Profile");
    /*
    this.missionService.announceMission("{'districtID':'d001'}");
    this.data["profile_template_id"] = this.id;
    this.data["user_id"] = this.profileUserId;
    this.data["data"] = this.getData();

    console.log("Data " + JSON.stringify(this.data));
    */
   //if image got change, submit that image
   if(this.profileSmImageChanged){
    const uploadFormData = new FormData();
    uploadFormData.append("file", this.selectedProfileSmImage, this.selectedProfileSmImage.name);
    uploadFormData.append("user", JSON.stringify(this.viewingUser));

    this.userService.updateUserSmProfileImage(uploadFormData)
    .subscribe(data => {

    });
   }
  }

  getData():string{
    let data = {};
    data["firstName"] = this.firstName;
    data["lastName"] = this.lastName;


    let dataString:string = JSON.stringify(data);
    console.log("TemplateIntroductionComponent data " + dataString);
    return dataString;
  }

  
  followEntity(){

    var followURequest = {};
    var sourceEntity={};
    var targetEntity={}; 
    
    /*MAY NOT BE REQUIRED - BEGIN */
    followURequest["userId"] = this.loggedUser.username;// this.datashareService.getCurrentUserId();
    followURequest["connectionUserId"] = this.profileUserId;
    /*MAY NOT BE REQUIRED - END */

    followURequest["sourceEntityId"] = this.loggedUser.username;//this.datashareService.getCurrentUserId();
    followURequest["sourceEntityType"] = "USER";
    followURequest["targetEntityId"] = this.profileUserId;
    
    if(this.viewingUser['isLegislator']){
      followURequest["targetEntityType"] = "LEGISLATOR";
    }else{
      followURequest["targetEntityType"] = "USER";
    }
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
  }

  test(){
    console.log('Cancel Follow');
  }

  getRelationStatus(entity:string, profileId:string){
    this.userService.getRelationStatus(entity, profileId)
    .subscribe(
      (result) => {
          console.log("getRelationStatus response " + result);

          if(result == "REQUESTED"){
            this.requestedToFollow = true;
          }else if(result == "FOLLOWING"){
            this.following = true;
          }else if(result == "REJECTED"){
            this.followRequestRejected = true; 
          }

        },
      (err) => {
        console.log("Error ", err);
      });
  }

  getFollowersCount(profileId:string){
    this.userService.getFollowersCount(profileId)
    .subscribe(
      (result) => {
          console.log("getFollowersCount response " + result);
          this.followersCount = result;

        },
      (err) => {
        console.log("Error ", err);
      });    
  }

  getFollowers(profileId:string){
    this.userService.getFollowers(profileId)
    .subscribe(
      (result) => {
          console.log("getFollowers response " + result);
          this.viewingUser['followers'] = this.followers = result;
          console.log("getFollowers response " + this.followers);
          if(this.followers){
            this.followers.forEach(follower => {
              //get the profilesmimage
              //this.getProfileSmImage(follower.username);
            });
          }
        },
      (err) => {
        console.log("Error ", err);
      });    
  }

  //NOT USED
  getRelation(entity:string, profileId:string){
    this.requestedToFollow = false;
    this.following = false;
    this.followRequestRejected = false;
    var isProfileRelated = false;

    console.log("this.viewingUser['connections'].length ", this.viewingUser['connections'].length);

    this.viewingUser['connections'].forEach(connection => {
      if((entity === "user" && connection["users"]) ||
         (entity === "group" && connection["groups"]) ||
         (entity === "position" && connection["positions"])){

        let connectedEntities = null;
        if((entity === "user" && connection["users"])){
          connectedEntities = connection["users"];
         }else if((entity === "group" && connection["groups"])){
          connectedEntities = connection["groups"];
         }else if((entity === "position" && connection["positions"])){
          connectedEntities = connection["positions"];
         }
        
        connectedEntities.forEach(connectedEntity => {      
          if(connectedEntity["entityId"] === profileId){
            isProfileRelated = true;

            if(connectedEntity["connectionStatus"] == "REQUESTED"){
              this.requestedToFollow = true;
            }else if(connectedEntity["connectionStatus"] == "FOLLOWING"){
              this.following = true;
            }else if(connectedEntity["connectionStatus"] == "REJECTED"){
              this.followRequestRejected = true;
            }

          }

          if(isProfileRelated){
            //exit the for loop
          }
        });
        //exit the for loop
      }
    });
  }

  getPermission():string{
                //console.log("calling getter");
          let data = this.datashareService.getPermission();
      //console.log("getPermission() " + data);
      return data;
  }

  setPermission(data:string){
      //console.log("calling setter");
      this.datashareService.setPermission(data);    
      this.profileEditOption = data;
  }

  isEditable(){
    //should be logged in
    //additional Role ?
  }

  allowed():boolean{
      let permission:boolean = this.datashareService.checkPermissions();
      //console.log("allowed() - " + permission);

      return permission;
  }

//load the template based on user selection
  loadTemplate(type:string){
    let compTypes = [];
    compTypes.push(type);
    this.templateType = compTypes;
  }
}
