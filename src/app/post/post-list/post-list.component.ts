import { AfterViewChecked, AfterViewInit, Component, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { PostService } from '../../services/post.service';
import { Post, PostFilterSearch } from '../../shared/models/post.model';
import { RESPONSE_STATUS } from 'src/app/shared/models/enums';
import { PageEvent } from '@angular/material/paginator';
import { EventSocketService } from 'src/app/services/event-socket.service';
import { Router } from '@angular/router';
import { SnackbarNotificationService } from 'src/app/services/snackbar-notification.service';
import { ToolbarActionsComponent } from 'src/app/shared/components/toolbar-actions/toolbar-actions.component';
import { CurrentUserLoginInfo } from 'src/app/shared/models/userLoginModel';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, AfterViewChecked  {

  postLists : Post[] = [];
  isUserSignedIn: boolean = false;
  screenBreakpoint!: number;
  isPostLiked: boolean = false;
  currentUserLoginInfo! : CurrentUserLoginInfo;

  postFilterSearch: PostFilterSearch ={
    page : 1,
    limit: 9,
    postName: undefined,
    authorName: undefined
  } 

  postPagination! : {
    totalCount: number,
    itemsPerPage: number,
    pageIndex: number,
    totalPage: number,
  }

  @ViewChild('toolbar') toolbar!: ToolbarActionsComponent

  constructor(
    private postService : PostService,
    private authService : AuthService,
    private eventSocket: EventSocketService,
    private router: Router,
    private snackBar: SnackbarNotificationService,
  ){}

    // page: number = 1;
    // limit: number = 9;

  get isCreateFunc() : boolean{
    return this.currentUserLoginInfo.id !== '' && this.currentUserLoginInfo.id !== undefined;
  }

  ngOnInit(): void {
    this.getAllPosts();
    this.screenBreakpoint = this.configResponsiveGrid(window.innerWidth);
    this.authService.getCurrentUserLoginInfo().subscribe(result =>{
      this.currentUserLoginInfo = result;
    })
    this.updateNewPostLike();
    this.updateTotalCommentsCount();
    this.authService.isSignedIn().subscribe(result =>{
      this.isUserSignedIn = result;
    })  
  }

  configResponsiveGrid(windowWidth: number){
    if(windowWidth <= 700) { return 1}
    if(windowWidth <= 1000){ return 2}
    else return 3;
  }

  onResize(event: any){
    this.screenBreakpoint = this.configResponsiveGrid(event.target.innerWidth);
  }

  getAllPosts(){
    this.postService.getAllPosts(this.postFilterSearch).subscribe(result =>{
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
    // this.isUserSignedIn =  this.authService.isSignedIn();
  }

  paginateEvent(event: PageEvent){
    // this.limit = event.pageSize;
    // this.page = event.pageIndex + 1;
    this.postFilterSearch.page = event.pageIndex + 1;
    this.postFilterSearch.limit = event.pageSize;
    this.getAllPosts();
  }

  checkIsPostLiked(post: Post){
    if(!this.isUserSignedIn){
      return false;
    }
    else{
      const userLiked = post.userLikedPost?.find(user => user == this.currentUserLoginInfo.id);
      if(userLiked == undefined){
        return false;
      }
      else return true;
    }
  }

  // onLikePost(post: Post){
  //   if(!this.isUserSignedIn){
  //     this.snackBar.showErrorSnackbar('Please sign in to your account to like a post');
  //     return;
  //   }
  //   else{
  //     //emit data xuống server
  //     this.eventSocket.emitEvent('new-like', post._id);
  //   }
  // }

  onLikeOrUnlikePost(post: Post, eventName: string){
    if(!this.isUserSignedIn){
      this.snackBar.showErrorSnackbar('Please sign in to your account to like post');
      return;
    }
    else{
      //emit like post event
      if(eventName == 'like-post'){
        this.eventSocket.emitEvent('new-like', post._id);
      }
      else if(eventName == 'unlike-post'){
        this.eventSocket.emitEvent('unlike', post._id);
      }
      
    }
  }

  updateNewPostLike(){
    this.eventSocket.getNewPostLikeData().subscribe(result =>{
      const postId = result.postId;
      const newLikes = result.likes;
      const userId = result.userId;
      const type = result.type;
      const postIndex = this.postLists.findIndex(post => post._id == postId);
      if(postIndex != -1){
        this.postLists[postIndex].likeCount = newLikes;
        //if a user like post, push that userId to userLikedPost
        if(type == 'like'){
          this.postLists[postIndex].userLikedPost = [...(this.postLists[postIndex].userLikedPost || []), userId];
        }
        //else if a user unlike post, remove that userId
        else if(type == 'unlike'){
          this.postLists[postIndex].userLikedPost = this.postLists[postIndex].userLikedPost?.filter(user => user != userId);
        }
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

  onFilterSearch(){
    this.getAllPosts();
  }

  onToolbarAction(event: any){
    const { actionType, data } = event;
    if(actionType === 'search'){
      this.onFilterSearch();
    }
  }

  openPostDetail(post: Post){
    this.router.navigate(['/post', post.author.username, post._id]);
  }
  openCreatePost(){
    this.router.navigate(['/post', this.currentUserLoginInfo.username, 'create-post']);
  }

  handleEmittedEvent(dataEmitted: any){
    const {eventName, post} = dataEmitted;
    switch(eventName){
      //like post
      case 'like-post':
        this.onLikeOrUnlikePost(post, 'like-post');
        break;
      case 'unlike-post':
        this.onLikeOrUnlikePost(post, 'unlike-post');
        break;
      //view post detail
      case 'open-detail':
        this.openPostDetail(post);
        break;
      default:
        break;
    }
  }
}
