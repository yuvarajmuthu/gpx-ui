import {Component, EventEmitter, Input, Output, OnInit} from '@angular/core';
import { Router } from "@angular/router";

// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/catch';
import { catchError, map, tap, switchMap } from 'rxjs/operators';

import { LegislatorService } from '../../services/legislator.service';
import { ComponentcommunicationService }     from '../../services/componentcommunication.service';
import { AlertService } from '../../services/alert.service';

import { Legislator } from '../../models/legislator';

import {LegislatorComponent} from '../../components/legislator/legislator.component';



@Component({
  selector: 'app-searchlegislators',
  templateUrl: './searchlegislators.component.html',
  styleUrls: ['./searchlegislators.component.css']
})
export class SearchlegislatorsComponent implements OnInit {
  legislators: Array<any> = [];
  legislator = {};
  resultop:any;
  resultop1:any;
  ipZipcode:String = '';
  address:string="300 Chatham Park Drive,Pittsburgh, PA 15220";
  currentLocationZip = '19406';
  public selectedlegislator: Legislator;
  latitude:any;
  longitude:any;
  //congressDistrict:string;
  congressDistricts:JSON[] = [];
  state:string;
  searchTip:string;
  districtLabel:string;
  stateData:boolean;
  congressData:boolean;

  @Output()
  success = new EventEmitter();
  
  constructor(private  router: Router, 
    private legislatorsService: LegislatorService, 
    private missionService: ComponentcommunicationService, 
    private alertService:AlertService) {

    if (this.stateData){
      //this.getCongressLegislatorsByLatLong();
      //this.loadStateData();
    }else if (this.congressData){

    }
/*  missionService.getAlert().subscribe(
      mission => {
        console.log("Alert message received " + mission);
      });*/
  }

  ngOnInit(){
    //console.log("ngOnInit - finding current position");
    //this.setCurrentPosition();
  }

  //invoked from searchLegis.html
  loadStateData(){
    this.stateData = true;
    this.congressData = false;
    
    this.getCongressLegislatorsByLatLong();
    //this.loadStateData()
    this.districtLabel = "Your State Legislative District(s):";
  }

  //invoked from searchLegis.html
  loadCongressData(){
    this.stateData = false;
    this.congressData = true;
    
    if(!this.address){
      //this.missionService.announceAlertMission("{'alertType':'danger', 'alertMessage':'Please provide address to search for Congress data.'}");

      this.alertService.error("Please provide address to search for Congress data.");

      return;
    }


    this.getLegislators(this.address, "congress");

    this.districtLabel = "Your Congressional District(s):";
  }

  private getCongressLegislatorsByLatLong() {

  if(this.address){




    this.legislatorsService.getLocation(this.address)      
    //.map(result => this.resultop1 = result.results[0])
    .subscribe((result) => {
      result = result.results[0];
      console.log('geocoding output ' + JSON.stringify(result));
        let geometry = result['geometry'];
        let latLong = geometry['location'];

        this.latitude = latLong['lat'];
        this.longitude = latLong['lng'];
        console.log("current position latitude " + this.latitude + ',longitude ' + this.longitude);
        this.getLegislators(this.latitude+','+this.longitude, 'latlong');
        //this.getDistrict(this.latitude+','+this.longitude, 'latlong');
        this.searchTip = "Showing legislator(s) for the location: Latitude " + this.latitude + ", Longitude " + this.longitude;

     });    }else{
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        console.log("current position latitude " + this.latitude + ',longitude ' + this.longitude);
        this.getLegislators(this.latitude+','+this.longitude, 'latlong');
        //this.getDistrict(this.latitude+','+this.longitude, 'latlong');
        this.searchTip = "Showing legislator(s) for the location: Latitude " + this.latitude + ", Longitude " + this.longitude;
      });      
    } 

  }
/*
private getLatitudeLongitude(callback, address) {
    // If adress is not supplied, use default value 'Ferrol, Galicia, Spain'
    address = address || 'Ferrol, Galicia, Spain';
    // Initialize the Geocoder
    let geocoder = new google.maps.Geocoder();
    if (geocoder) {
        geocoder.geocode({
            'address': address
        }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                callback(results[0]);
            }
        });
    }
}
*/

  //DEPRECATED
  getCongressLegislatorsByZip(zipcode: string) {
    console.log("Search value: " + zipcode);
    this.currentLocationZip = zipcode;
    this.legislators = [];
    this.getLegislators(zipcode, 'zipcode');
    this.getDistrict(zipcode, 'zipcode');
    this.searchTip = "Showing legislator(s) for the location: Zipcode " + zipcode;

  }


  //DEPRECATED
  //using CONGRESS API  
  getDistrict(searchParam:string, type:string){
    //  console.log("getDistrict() searchParam" + searchParam + ',type ' + type);
    // this.legislatorsService.getDistrict(searchParam, type)
    // .map(result => this.resultop1 = result.results)
    // .subscribe((result) => {
    //     this.congressDistricts = [];
    //     for(var i = 0; i<result.length; i++) {
    //       console.log("getDistrict - " + result[i]);
    //       this.state = result[i]['state'];

    //       let district:any = {};
    //       district['name'] = result[i]['district'];  
    //       district['state'] = result[i]['state'];
    //       this.congressDistricts.push(district);
    //     }
    //  });    
  }

//DEPRECATED
  getDistrictByZip(zipcode:string){
    // console.log("getDistrictByZip " + zipcode);
    // this.legislatorsService.getDistrictByZipcode(zipcode)
    // .map(result => this.resultop1 = result.results)
    // .subscribe((result) => {
    //     this.congressDistricts = [];
    //     for(var i = 0; i<result.length; i++) {
    //       console.log("getDistrict - " + result[i]);
    //       this.state = result[i]['state'];
    //       //this.congressDistrict = result[i]['district'];

    //       let district:any = {};
    //       district['name'] = result[i]['district'];  
    //       district['state'] = result[i]['state'];
    //       this.congressDistricts.push(district);
    //     }
    //  });    
  }

  getLegislators(searchParam:string, type:string) {
    this.legislators = [];
    this.legislatorsService.getLegislature(searchParam, type)
    //.map(result => this.resultop = result.results)
    .subscribe((result) => {
      console.log("result for type " + type + JSON.stringify(result));
      if(type == 'congress'){
        if(!result['error']){

          //this.congressDistricts = [];

          let offices = [];
          offices = result['offices'];
          
          let officials = [];
          officials = result['officials'];

         for(var i = 0;i<officials.length;i++) {
           let legislator = {};
           if(offices[i] && offices[i]['name'] && 
             (offices[i]['name'].indexOf('United States Senate') != -1 || 
               offices[i]['name'].indexOf('United States House of Representatives') != -1)){
          // console.log("offices[i]['name'] " + offices[i]['name']);
         //console.log("offices[i]['name'].indexOf('United States Senate') " + offices[i]['name'].indexOf('United States Senate'));
         //console.log("offices[i]['name'].indexOf('United States House of Representatives') " + offices[i]['name'].indexOf('United States House of Representatives'));
         //console.log("flag " + (offices[i]['name'] && 
          //   (offices[i]['name'].indexOf('United States Senate') != -1 || offices[i]['name'].indexOf('United States House of Representatives') != -1)));

           legislator['full_name'] = officials[i]['name'];
           legislator['party'] = officials[i]['party'];
           legislator['photo_url'] = officials[i]['photoUrl'];  

           console.log("offices[i] " + JSON.stringify(offices[i]));

           if(offices[i]['name'])
             legislator['role'] = offices[i]['name'];

           let division:string = offices[i]['divisionId'];
           legislator['ocdId'] = division; //division id from google civic
           if(division.indexOf('state:') != -1){
             legislator['state'] = division.substr(division.indexOf('state:')+6, 2).toUpperCase();
           }

          if(division.indexOf('cd:') != -1){
             legislator['district'] = division.substr(division.indexOf('cd:')+3, 2);
           }

           //setting DUMMY id
           //legislator['district'] = "5a6ea6ce77b2ae4ae0099564";
           //legislator['district'] = "5afbaa41fdec9538d4c9ddf8"; // from aws
           //legislator['district'] = "5a6ea3c677b2ae4ae0099561";
/*
           //DISPLAY DISTRICT  
          let district:any = {};
          district['name'] = legislator['district'];  
          district['state'] = legislator['state'];
          district['ocdId'] = division; //division id from google civic          
          this.congressDistricts.push(district);
*/

          if(offices[i]['roles'] && offices[i]['roles'].length > 0){
            legislator['chamber'] = offices[i]['roles'][0];
          }

          this.legislators.push(legislator);
          this.legislator = legislator;
          }
         }
       }
       else{
         console.log('Error in getting');
         this.alertService.error('Error in getting data');
       }
      }else{//DATA FOR STATE - OPENSTATES
              for(var i = 0;i<result.length;i++) {
                 this.legislator = result[i];
                 this.legislators.push(this.legislator);

              }
      }
          //USED TO SET THE STATE AND DISTRICT
              this.congressDistricts = [];
              let districtsArr:string[] = [];
              for(var i = 0;i<this.legislators.length;i++) {

                this.legislator = this.legislators[i];
                
                this.state = this.legislator['state'];

                //array of Districts to display
                if(this.legislator['district'] && (districtsArr.indexOf(this.legislator['district']) == -1)){
                  districtsArr.push(this.legislator['district']);  
                  let district:any = {};
                  district['name'] = this.legislator['district'];  
                  district['state'] = this.legislator['state'];
                  if(this.legislator['ocdId']){
                    district['ocdId'] = this.legislator['ocdId'];
                    district['externalId'] = this.legislator['ocdId'];
                  }
                  this.congressDistricts.push(district);   
                }             

              }

           

            },
            (error)=>{
              console.log('Error in getting Legislators ', error['_body']);
              this.alertService.error(error['_body']);
            });

  }

  gotoDistrict(district:JSON){
    console.log("Navigating to district " + JSON.stringify(district));
    let districtName:string;

    districtName = district['name'];  

    let url = '/group/' + districtName;

    if(district['externalId'] != undefined)
      this.router.navigate([url, {externalId:this.escapeForwardSlash(district['externalId'])}]);
    else
      this.router.navigate([url]);
    }

  escapeForwardSlash(input:string){
    let output:string;
    //output = input.split('/').concat('#');
    output = input.replace(/\//g, '_');
    console.log('Escaping forward slash ' + input + ' and output is ' + output);
    return output;
  }

/*
  gotoLegislator(legislator: Legislator):void{
    this.selectedlegislator = legislator;

    console.log('selected item - ' +  this.selectedlegislator);    
    console.log('bioguide_id of selected item - ' +  this.selectedlegislator.bioguide_id);

    this.router.navigate(['/legislator', this.selectedlegislator.bioguide_id]);
  }
  */
 }
