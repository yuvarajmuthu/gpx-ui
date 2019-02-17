import {Component, ViewContainerRef, ViewChild, ElementRef, Renderer, ChangeDetectorRef, ComponentRef, Input, OnInit} from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from "@angular/router";

// import { TAB_DIRECTIVES } from 'ng2-bootstrap/components/tabs';
// import { CollapseDirective } from 'ng2-bootstrap/components/collapse';
// import {RatingComponent} from 'ng2-bootstrap/components/rating';
// import { DROPDOWN_DIRECTIVES } from 'ng2-bootstrap/components/dropdown';

import { Legislator } from '../../../models/legislator';

//import {BannerGPXComponent} from './banner.component';

//import {PeopleComponentGPX} from './people.component';
//import {NdvEditComponent} from './editableText.component';
//import {LegislatorComponentGPX} from './legislator.component';
//import {DynamicContentComponent} from './userProfile.template.component';
import {UsertemplateComponent} from '../usertemplate/usertemplate.component';

import {DatashareService} from '../../../services/datashare.service';
import {UserService} from '../../../services/user.service';
import { LegislatorService } from '../../../services/legislator.service';
import { ComponentcommunicationService }     from '../../../services/componentcommunication.service';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  @Input() profileUserId:string = "";
  legisId:string = "";

	public isCollapsed:boolean = false;
	public isCMCollapsed:boolean = false;
	public isPartiesCollapsed:boolean = false;

	public electedPersonsOld=[];
  public electedPersons:Array<Legislator>;
	public contestedPersons=[];
	public parties=[];
  public connections=[];
  templateType = [];
  private componentRef: ComponentRef<{}>;
  private userData = {};
  private viewingUser={};  
  public profilesTemplates = [];
  public profilesData = [];
  public isLegislator = false;
  operation:string = "";

  activities:number = 0;  
      //private populationComponent: TemplatePopulationComponent;
  profileEditOption:string;

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
  }

  ngOnInit(){
    this.profileEditOption = this.getPermission(); 

    let id = this.route.snapshot.paramMap.get('id');

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
        this.isLegislator = true; // may not be required
        this.viewingUser['isLegislator'] = true;
        this.viewingUser['externalData'] = this.datashareService.getViewingUser();
        this.profileUserId = this.viewingUser['externalData']['id'];
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
      

      this.userService.getUserData(this.viewingUser['userId'], this.viewingUser['external']).subscribe(
          data => {
            this.userData = data;
            console.log("User data from service: ", this.userData);

            //this.connections = this.userData['connections'];
            this.viewingUser['connections'] = this.userData['connections'];
            this.viewingUser['followers'] = this.userData['followers'];
            // console.log("User connections: ", this.connections);
            // if(this.connections){
            //   for(let connection of this.connections){
               
            //   }
            // }

     
            //getting the available profile templates for this user type - publicUser
            this.profilesTemplates = this.viewingUser['profileTemplates'] = this.userData['profile'];
            console.log("profile templates: ", this.profilesTemplates);

            //getting the data for this user profile
            this.profilesData = this.viewingUser['profilesData'] = this.userData['profileData'];
            console.log("profile data: ", this.profilesData);

            //identifying the profile selected for this user profile, so those components shall be loaded
            let compTypes = [];
            for (let profileData of this.profilesData){
              console.log("loading template component: ", profileData['profile_template_id']);
              //this.templateType.push(profileData['profile_template_id']);
              compTypes.push(profileData['profile_template_id']); 
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
      console.log("Saving Profile");
      this.missionService.announceMission("{'districtID':'d001'}");
      //console.log("printing female count " + this.populationComponent.femaleCount);
      //this.populationComponent.getData();  
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
