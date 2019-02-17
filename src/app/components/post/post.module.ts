import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostComponent } from './post.component';
import { PostcardComponent } from './postcard/postcard.component';
import { NewpostComponent } from './newpost/newpost.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [PostComponent, PostcardComponent, NewpostComponent]
})
export class PostModule { }
