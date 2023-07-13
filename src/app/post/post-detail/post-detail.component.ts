import { Component, DoCheck, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from '../../shared/models/post.model';
import { PostService } from 'src/app/services/post.service';
import { FormControl, FormGroup } from '@angular/forms';
import { EventSocketService } from 'src/app/services/event-socket.service';
import { PostComment } from 'src/app/shared/models/post-comment.model';
import { PostCommentService } from 'src/app/services/post-comment.service';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { SnackbarNotificationService } from 'src/app/services/snackbar-notification.service';
import { CurrentUserLoginInfo } from 'src/app/shared/models/userLoginModel';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { RESPONSE_STATUS } from 'src/app/shared/models/enums';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent implements OnInit, OnDestroy, DoCheck {
  postId!: string;
  post!: Post;
  commentForm: FormGroup;
  postCommentsList!: PostComment[];
  postComments$!: Observable<PostComment[]>;
  isPostAlreadyLiked: boolean = false;
  currentUserLoginInfo!: CurrentUserLoginInfo;
  isUserLoggedInPostAuthor: boolean = false;

  private isUserSignedIn: boolean = false;
  
  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private eventSocket: EventSocketService,
    private postCommentService: PostCommentService,
    private authService: AuthService,
    private snackBar: SnackbarNotificationService,
    private router: Router,
    private dialogService: DialogService
  ){
    this.commentForm = new FormGroup({
      commentControl: new FormControl('')
    });
  }

  get commentRef() {return this.commentForm.get('commentControl')};

  get isCurrentUserLoggedIn() : boolean{
    return this.currentUserLoginInfo.id !== '' && this.currentUserLoginInfo.id !== undefined;
  }

  ngOnInit(): void {
    this.route.params.subscribe(param =>{
      this.postId = param['id'];
      this.getPostDetailById(this.postId);
    })
    this.authService.isSignedIn().subscribe(result =>{
      this.isUserSignedIn = result;
    })
    this.authService.getCurrentUserLoginInfo().subscribe(result =>{
      this.currentUserLoginInfo = result;
    })
    this.updateNewPostLikeData();
    this.updateNewPostCommentData();
    this.updateTotalPostCommentCount();
  }

  ngDoCheck(): void {
    
  }

  getPostDetailById(id: string){
    this.postService.getPost(id).subscribe(result =>{
      this.post = result.data;
      this.postCommentService.getPostComments(id).subscribe(result =>{
        this.postCommentsList = result.data;
        this.isPostAlreadyLiked = this.checkIfCurrentUserLikedPost();

        this.isUserLoggedInPostAuthor = this.checkIfUserLoggedInIsPostAuthor();
      })
    })
  }

  checkIfUserLoggedInIsPostAuthor(){
    if(this.currentUserLoginInfo.id === this.post.author._id){
      return true;
    }
    else return false;
  }

  checkIfCurrentUserLikedPost(){
    if(this.currentUserLoginInfo.id == undefined || this.currentUserLoginInfo.id == '') return false;
    else{
      const result = this.post.userLikedPost?.find(user => user == this.currentUserLoginInfo.id);
      if(result == undefined) return false;
    }
    return true;
  }

  onLikePost(){
    if(!this.isUserSignedIn){
      this.snackBar.showErrorSnackbar('Please sign in to your account to like post');
      return;
    }
    else{
      //emit data to server
      if(!this.isPostAlreadyLiked){
        this.eventSocket.emitEvent('new-like', this.post._id);
        this.isPostAlreadyLiked = true;
      }
      else{
        this.eventSocket.emitEvent('unlike', this.post._id);
        this.isPostAlreadyLiked = false;
      }
    }
  }

  onComment(){
    if(!this.isUserSignedIn){
      this.snackBar.showErrorSnackbar('Please sign in to your account to comment');
      return;
    }
    const commentData ={
      postCommented: this.post._id,
      comment: this.commentRef?.value as string
    }
    //emit data to server
    this.eventSocket.emitEvent('create-comment', commentData);
    // this.eventSocket.emitData('comment-events', commentData);
  }

  updateNewPostLikeData(): void{
    this.eventSocket.getNewPostLikeData().subscribe(result =>{
      if(this.post._id == result.postId){
        this.post.likeCount = result.likes;
      }
    })
  }

  updateNewPostCommentData(): void{
    this.eventSocket.getNewPostComment().subscribe(result =>{
      this.postCommentsList = [...this.postCommentsList, result];
    })
  }

  updateTotalPostCommentCount(): void{
    this.eventSocket.getNewTotalPostComment().subscribe(result =>{
      if(this.post._id == result.postId){
        this.post.commentCount = result.totalComments;
      }
    })
  }

  onToolbarAction(event: any){
    if(this.currentUserLoginInfo.id !== this.post.author._id) return;
    
    const { actionType, data} = event;
    switch(actionType){
      case 'edit':
        this.openEditPostPage();
        break;
      case 'delete':
        this.openDeleteConfirm();
        break;
      default:
        break;
    }
  }

  openEditPostPage(){
    this.router.navigate(['post', this.post.author.username, 'edit-post', this.post._id]);
  }

  openDeleteConfirm(){
    const dialogRef = this.dialogService.showDeleteDialog(
      `Delete post: ${this.post.postName}`, 'Are you sure you want to delete this post?', true
    );
    dialogRef.afterClosed().subscribe((result: boolean) =>{
      if(result === true){
        this.deletePost();
      }
    })
  }

  deletePost(){
    const deletedPostId = this.post._id;
    const postName = this.post.postName;
    this.postService.deletePost(deletedPostId).subscribe(result =>{
      if(result.status == RESPONSE_STATUS.SUCCESS){
        this.snackBar.showSuccessSnackbar(`Delete post: ${postName} successfully`, 3);
        setTimeout(() =>{
          this.router.navigate(['']);
        }, 3000);
      }
    })
  }

  ngOnDestroy(): void {
    // this.postCommentService.stopReceiveComment();
  }
}
