import { Component, OnInit } from '@angular/core';

import {AbstractTemplateComponent} from '../../abstractTemplateComponent';

import {DatashareService} from '../../../../services/datashare.service';
import {ComponentcommunicationService}     from '../../../../services/componentcommunication.service';
import {UserService} from '../../../../services/user.service';
import { LegislatorService } from '../../../../services/legislator.service';

@Component({
  selector: 'app-userbiodatatemplate',
  templateUrl: './userbiodatatemplate.component.html',
  styleUrls: ['./userbiodatatemplate.component.css']
})
export class UserbiodatatemplateComponent extends AbstractTemplateComponent  implements OnInit{
  //userId = "u001";
  //legisId:string = "";
  
  id = "upCongressLegislatorExternal";
  firstName:string = "";//"Pennsylvania's 14th congressional district";
  lastName:string = "";//"Pennsylvania's 14th congressional district includes the entire city of Pittsburgh and parts of surrounding suburbs. A variety of working class and majority black suburbs located to the east of the city are included, such as McKeesport and Wilkinsburg. Also a major part of the district are number of middle class suburbs that have historic Democratic roots, such as Pleasant Hills and Penn Hills. The seat has been held by Democrat Mike Doyle since 1995. In the 2006 election, he faced Green Party candidate Titus North and returned to the house with 90% of the vote.";
  userName:string = "";
  emailId = "";
  imageUrl:string = "";
  
  data = {};
  private userData = {};
  public profilesData = [];
  public profilesTemplates = [];
  private templateProperties = [];
  private templateData = [];
  
  //legislator: Legislator;
  //resultop:any;
  //keys = [];
  
  //called after the constructor
  ngOnInit(): void {
    console.log("ngOnInit() userProfile.template TemplateLegisCongressProfileComponent");   
    //this.legislator = this.getLegislator();
    //console.log("this.legislator " + this.legislator);  
  
    //this.keys = this.getKeys();
    //console.log("this.keys " + this.keys);  
  
  /*
   
    if(this.dataShareService2.getSelectedLegislatorId()){  
      this.legisId = this.dataShareService2.getSelectedLegislatorId();
        console.log("this.legisId " + this.legisId);
  
  
          this.legislatorsService2.getLegislature(this.legisId, 'bioguide_id')
    .map(result => this.resultop = result.results)
    .subscribe((result) => {
              if(result.length > 0){
                this.legislator = result[0];
              }
              console.log("Loading: " + this.legislator);
           this.keys = Object.keys(this.legislator);
           console.log("keys " + this.keys);    
  
           console.log("this.legislator.bioguide_id " + this.legislator.bioguide_id);
           //retrieving the image from bioguide
           if(this.legislator.bioguide_id){
              let intial = this.legislator.bioguide_id.charAt(0);
              let imageUrl = 'http://bioguide.congress.gov/bioguide/photo/' + intial + '/' + this.legislator.bioguide_id + '.jpg';
              console.log("bioguide image url " + imageUrl);
              this.legislator.bioguideImageUrl = imageUrl;
           }
            });
  
  
    }
    */
  }
  
  //called before ngOnInit()
  constructor(private legislatorsService2:LegislatorService, 
    private userService2:UserService, 
    private dataShareService2:DatashareService, 
    private missionService2: ComponentcommunicationService) {
  
      super(legislatorsService2, userService2, dataShareService2, missionService2);
  
      console.log("constructor() userProfile.template");      
  
      missionService2.missionAnnounced$.subscribe(
      mission => {
        console.log("Received save Profile message from parent for district " + mission);
  
        this.saveProfile();
      });
  
      //this.loadTemplateData();  
      //OVERRIDE KEYS - CUSTOMIZED DISPLAY
      this.loadDisplayProperties();
  
  
    }
    
    loadDisplayProperties(){
      for (let profileTemplates of this.viewingUser['profileTemplates']){
        //console.log("reading template component properties: ", profileTemplates['profile_template_id']);
        //this.templateType.push(profileData['profile_template_id']);
        if(this.id == profileTemplates['profile_template_id']){
          this.displayProperties = profileTemplates['properties'];
          break;  
        }
      }
  
    }
  
    loadTemplateData(){
        this.userService2.getUserData(this.profileUserId, true).subscribe(
          data => {
          this.userData = data;
          console.log("User data from service: ", this.userData);
  
  
            //getting the available profile templates for this user type
            this.profilesTemplates = this.userData['profile'];
            console.log("profile templates: ", this.profilesTemplates);
            for (let profileTemplates of this.profilesTemplates){
              console.log("reading template component properties: ", profileTemplates['profile_template_id']);
              //this.templateType.push(profileData['profile_template_id']);
              if(this.id == profileTemplates['profile_template_id']){
                this.templateProperties = profileTemplates['properties'];
                break;  
              }
            }
  
  
            //getting the data for this user profile
            this.profilesData = this.userData['profileData'];
            console.log("profile data: ", this.profilesData);
  
            for (let profileData of this.profilesData){
              console.log("loading template component: ", profileData['profile_template_id']);
              //this.templateType.push(profileData['profile_template_id']);
              if(this.id == profileData['profile_template_id']){
                this.templateData = profileData['data'];
                break;  
              }
            }
  
            for (let dataObj of this.templateData){
              let keys = [];
              keys = Object.keys(dataObj);
              console.log("Template data keys " + keys[0] + ":" + dataObj[keys[0]]);
              this[keys[0]] = dataObj[keys[0]];
            }
  
          }
      );
  
    }
  
    allowed():boolean{
        let permission:boolean = this.dataShareService2.checkPermissions();
        //console.log("allowed() - " + permission);
  
        return permission;
    }
  
    getData():string{
      let data = {};
      data["firstName"] = this.firstName;
      data["lastName"] = this.lastName;
  
  
      let dataString:string = JSON.stringify(data);
      console.log("TemplateIntroductionComponent data " + dataString);
      return dataString;
    }
  
    saveProfile(){
      this.data["profile_template_id"] = this.id;
      this.data["user_id"] = this.profileUserId;
      this.data["data"] = this.getData();
  
      console.log("Data " + JSON.stringify(this.data));
  
    }
  
  }
  