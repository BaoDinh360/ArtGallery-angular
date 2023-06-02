import { AfterViewChecked, Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { PostService } from '../../services/post.service';
import { Post } from '../../shared/models/post.model';
import { RESPONSE_STATUS } from 'src/app/shared/models/enums';
import { PageEvent } from '@angular/material/paginator';
import { Socket } from 'ngx-socket-io';
import { EventSocketService } from 'src/app/services/event-socket.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarNotificationComponent } from 'src/app/shared/components/snackbar-notification/snackbar-notification.component';
import { SnackbarNotificationService } from 'src/app/services/snackbar-notification.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, AfterViewChecked  {

  postLists : Post[] = [];
  currentUserLoginId!: string;
  private isUserSignedIn: boolean = false;
  screenBreakpoint!: number;

  constructor(
    private postService : PostService,
    private authService : AuthService,
    private eventSocket: EventSocketService,
    private router: Router,
    private snackBar: SnackbarNotificationService,
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
    this.screenBreakpoint = this.configResponsiveGrid(window.innerWidth);
    this.authService.getCurrentUserLoginInfo().subscribe(result =>{
      this.currentUserLoginId = result.id;
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
    // this.isUserSignedIn =  this.authService.isSignedIn();
  }

  paginateEvent(event: PageEvent){
    this.limit = event.pageSize;
    this.page = event.pageIndex + 1;
    this.getAllPosts();
  }

  onLikePost(post: Post){
    if(!this.isUserSignedIn){
      this.snackBar.showErrorSnackbar('Please sign in to your account to like a post');
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

  openPostDetail(post: Post){
    this.router.navigate(['/post', post.author.username, post._id]);
  }

  
}
