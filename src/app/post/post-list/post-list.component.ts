import { AfterViewChecked, Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { PostService } from '../../services/post.service';
import { Post } from '../../shared/models/post.model';
import { RESPONSE_STATUS } from 'src/app/shared/models/enums';
import { PageEvent } from '@angular/material/paginator';
import { Socket } from 'ngx-socket-io';
import { EventSocketService } from 'src/app/services/event-socket.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, AfterViewChecked  {

  postLists : Post[] = [];
  isUserSignedIn : boolean = false;
  currentUserLoginId!: string;
  
  constructor(
    private postService : PostService,
    private authService : AuthService,
    private eventSocket: EventSocketService,
    private router: Router
  ){}

    page: number = 1;
    limit: number = 9;

    postPagination! : {
      totalCount: number,
      itemsPerPage: number,
      pageIndex: number,
      totalPage: number,
    }
  ngOnInit(): void {
    this.getAllPosts();
    this.authService.getCurrentUserLoginInfo().subscribe(result =>{
      this.currentUserLoginId = result.id;
    })
    this.updateNewPostLike();
    this.updateTotalCommentsCount();
    // this.postService.getNewPostLikeData().subscribe(result =>{
    //   const postId = result.postId;
    //   const newLikes = result.likes;
    //   const postIndex = this.postLists.findIndex(post => post._id == postId);
    //   if(postIndex != -1){
    //     this.postLists[postIndex].likeCount = newLikes;
    //     console.log( this.postLists[postIndex]);
        
    //   }
    // })
    
  }
  
  getAllPosts(){
    this.postService.getAllPosts(this.page, this.limit).subscribe(result =>{
      if(result.status === RESPONSE_STATUS.SUCCESS)
      this.postLists = result.data.items;
      this.postPagination = {
        totalCount: result.data.totalCount,
        itemsPerPage: result.data.itemsPerPage,
        pageIndex: result.data.pageIndex - 1,
        totalPage: result.data.totalPage
      }
    })
  }

  ngAfterViewChecked(): void {
    this.isUserSignedIn =  this.authService.isSignedIn();
  }

  paginateEvent(event: PageEvent){
    this.limit = event.pageSize;
    this.page = event.pageIndex + 1;
    this.getAllPosts();
  }

  onLikePost(post: Post){
    if(!this.authService.isSignedIn()){
      console.log('Login first');
      return;
    }
    else{
      //emit data xuống server
      this.eventSocket.emitEvent('update-like', post._id);
    }
  }

  updateNewPostLike(){
    this.eventSocket.getNewPostLikeData().subscribe(result =>{
      const postId = result.postId;
      const newLikes = result.likes;
      const postIndex = this.postLists.findIndex(post => post._id == postId);
      if(postIndex != -1){
        this.postLists[postIndex].likeCount = newLikes;
      }
    })
  }

  updateTotalCommentsCount(){
    this.eventSocket.getNewTotalPostComment().subscribe(result =>{
      const postId = result.postId;
      const totalComment = result.totalComments;
      const postIndex = this.postLists.findIndex(post => post._id == postId);
      if(postIndex != -1){
        this.postLists[postIndex].commentCount = totalComment;
      }
    })
  }

  // UpdatePostLikesRealTime(data: any){
  //   const postIndex = this.postLists.findIndex(post => post._id == data.id);
  //   if(postIndex != -1){
  //     this.postLists[postIndex].likeCount = data.likes;
  //     console.log(this.postLists[postIndex]);
      
  //   }
  // }

  openPostDetail(post: Post){
    this.router.navigate(['/post', post.author.username, post._id]);
  }
}
