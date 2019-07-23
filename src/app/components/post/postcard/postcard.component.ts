import {Component, OnInit, Input} from '@angular/core';

import {PostService} from '../../../services/post.service';
import {DatashareService} from '../../../services/datashare.service';

import {Post} from '../../../models/post';

@Component({
  selector: 'app-postcard',
  templateUrl: './postcard.component.html',
  styleUrls: ['./postcard.component.css']
})

export class PostcardComponent implements OnInit {
  @Input() post: Post;
  commentPost:boolean = false;

  constructor(private postService: PostService, private dataShareService:DatashareService) {
  }

  ngOnInit(): void {
    if(this.post.messageType.indexOf("V") !== -1){
      this.post["containsVideo"] = true;
    }
    if(this.post.messageType.indexOf("I") !== -1){
      this.post["containsImage"] = true;
    }
    if(this.post.messageType.indexOf("T") !== -1){
      this.post["containsText"] = true;
    }
  }
  
 
  postEvent():void{
    this.commentPost = false;  
  }

  comment():void{
    this.commentPost = true;
    //child hideInput set to false
    console.log("this.commentPost " + this.commentPost);
  }

  likePost():void{
    console.log('Liked the post ' + this.post.id);
    console.log('userid ' + this.dataShareService.getCurrentUserId());
    this.post.likedByCurrentUser = true;
    console.log('this.post.likedByCurrentUser ' + this.post.likedByCurrentUser);
  }  

  loadMoreComments(id:string){ 
    console.log("Loading More Post Comments for ", id);
    return false;
  }
}
