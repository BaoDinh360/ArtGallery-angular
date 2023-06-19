import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Post } from 'src/app/shared/models/post.model';

@Component({
  selector: 'app-post-list-item',
  templateUrl: './post-list-item.component.html',
  styleUrls: ['./post-list-item.component.css']
})
export class PostListItemComponent implements OnInit, OnChanges {
  @Input() post!: Post;
  @Input() currentUserLoginId!: string;
  @Output() postEmitEvent: EventEmitter<{eventName: string, post: Post}> = new EventEmitter<{eventName: string, post: Post}>(); 
  
  isPostAlreadyLiked: boolean = false;
  constructor(

  ){}
  
  ngOnInit(): void {

  }
  ngOnChanges(changes: SimpleChanges): void {
    // console.log(changes['currentUserLoginId']);
    this.isPostAlreadyLiked = this.checkIfCurrentUserLikedPost();
  }
  checkIfCurrentUserLikedPost(){
    if(this.currentUserLoginId == undefined || this.currentUserLoginId == '') return false;
    else{
      const result = this.post.userLikedPost?.find(user => user == this.currentUserLoginId);
      if(result == undefined) return false;
    }
    return true;
  }

  onLikePost(post: Post){
    // if(this.currentUserLoginId == undefined || this.currentUserLoginId == '') return;
    //if user haven't liked this post, like it
    if(!this.isPostAlreadyLiked){
      this.postEmitEvent.emit({eventName: 'like-post', post: post});
      this.isPostAlreadyLiked = true;
    }
    //if user have already liked this post, unlike it
    else{
      this.postEmitEvent.emit({eventName: 'unlike-post', post: post});
      this.isPostAlreadyLiked = false;
    }

  }
  openPostDetail(post: Post){
    this.postEmitEvent.emit({eventName: 'open-detail', post: post});
  }
}
