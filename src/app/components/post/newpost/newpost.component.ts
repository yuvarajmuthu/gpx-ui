import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

import {GpxFileuploadComponent} from '../../gpx-uicomponents/gpx-fileupload/gpx-fileupload.component';

import {PostService} from '../../../services/post.service';
import {DatashareService} from '../../../services/datashare.service';

import {Post} from '../../../models/post';

@Component({
  selector: 'app-newpost',
  templateUrl: './newpost.component.html',
  styleUrls: ['./newpost.component.css']
})
export class NewpostComponent implements OnInit {

  form: FormGroup;

  stagingImage:any = null;
  public isFileStagingAreaCollapsed:boolean = true;

  /*
    public fileOverBase(e:any):void {
      this.hasBaseDropZoneOver = e;
    }
   
    public fileOverAnother(e:any):void {
      this.hasAnotherDropZoneOver = e;
    }
  */
    @Output() postEvent: EventEmitter<any> = new EventEmitter();
  
    @Input() parentPost:Post;
    post:Post;
    postFormData:FormData;

    txtPost:string = '';
    hideInput:boolean = false;
    //clearInput:boolean = false;
  
  
    constructor(private postService: PostService, private dataShareService:DatashareService) {  
        // this.form = this.fb.group({
        //   stageUploadedImgFile: null
        // });
    }
    
    ngOnInit() {
      this.resetForm();
    }

    resetForm(){
      this.post = {} as Post;
      this.postFormData = new FormData();
    }

    onFileSelected(event) {
      console.log("file object ", event);
      let reader = new FileReader();
//      let formData = new FormData();  

      
      if (event.target.files && event.target.files[0]) {

          //this.post.imageFile = event.target.files[0];
          this.postFormData.append('file', event.target.files[0]);
  //        formData.append('file', event.target.files[0]);
  //        formData.append('file1', 'test');
    
          reader.readAsDataURL(event.target.files[0]);
          reader.onload = (event) => {
            this.stagingImage = event.target["result"]; 
            

          }
      } 
    }
    
    doTextareaValueChange(ev) {
      try {
        this.txtPost = ev.target.value;
      } catch(e) {
        console.info('could not set textarea-value');
      }
    }

    submitPost(){
      //console.log("posting the comment " + text);
  
  /*    let posts:string;
  
      if(posts = localStorage.getItem("userPosts")){
        console.log('Existing posts ' + posts);
        let postObj = {};
        let json = [];  
  
        postObj = JSON.parse(posts);
        json = postObj['postArray'];
  
        let post:string;
  
        post = '{ "txtPost":'+ JSON.stringify(this.txtPost) +'}';
        json.push(JSON.parse(post));
        
        postObj['postArray'] = json;
  
        localStorage.setItem("userPosts", JSON.stringify(postObj));
        console.log('localStorage posts ' + localStorage.getItem("userPosts"));
      } else{
        console.log('adding new post in localstorage - ' + this.txtPost);
        localStorage.setItem("userPosts", JSON.stringify({'postArray':[{ 'txtPost': this.txtPost}]}));
      } 
  */
      //
      let currentUser = this.dataShareService.getCurrentUser();
      this.post.userId = currentUser['userId'];//this.dataShareService.getCurrentUserId();
      this.post.districtId = this.dataShareService.getCurrentDistrictId();
      this.post.postText = this.txtPost;
  
      if(this.parentPost != null){
        console.log("parent post " + this.parentPost.postText + ", post id " + this.parentPost.id);
        this.post.parentPostId = this.parentPost.id;    
      }
      this.postFormData.append('post', JSON.stringify(this.post));
      this.postService.postComment(this.postFormData)
      .subscribe((result) => {
        //reset the new post on successful response
        console.log("post message response " + result);
        this.resetForm();

        if(this.parentPost != null){
          this.postEvent.emit(null);           
   
          this.hideInput = true; // should be inside subscribe()
       }else{
         this.txtPost = '';
       }  
 
      });
  
  
  
    }

}
