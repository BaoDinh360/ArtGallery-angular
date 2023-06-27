import { Component, DoCheck, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Post } from '../../shared/models/post.model';
import { PostService } from 'src/app/services/post.service';
import { FormControl, FormGroup } from '@angular/forms';
import { EventSocketService } from 'src/app/services/event-socket.service';
import { PostComment } from 'src/app/shared/models/post-comment.model';
import { PostCommentService } from 'src/app/services/post-comment.service';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { SnackbarNotificationService } from 'src/app/services/snackbar-notification.service';

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
  currentUserLoginId!: string;
  private isUserSignedIn: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private eventSocket: EventSocketService,
    private postCommentService: PostCommentService,
    private authService: AuthService,
    private snackBar: SnackbarNotificationService
  ){
    this.commentForm = new FormGroup({
      commentControl: new FormControl('')
    });
  }

  get commentRef() {return this.commentForm.get('commentControl')};

  ngOnInit(): void {
    this.route.params.subscribe(param =>{
      this.postId = param['id'];
      this.getPostDetailById(this.postId);
    })
    this.authService.isSignedIn().subscribe(result =>{
      this.isUserSignedIn = result;
    })
    this.authService.getCurrentUserLoginInfo().subscribe(result =>{
      this.currentUserLoginId = result.id;
      // this.isPostAlreadyLiked = this.checkIfCurrentUserLikedPost();
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
      })
    })
  }

  checkIfCurrentUserLikedPost(){
    if(this.currentUserLoginId == undefined || this.currentUserLoginId == '') return false;
    else{
      const result = this.post.userLikedPost?.find(user => user == this.currentUserLoginId);
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

  ngOnDestroy(): void {
    // this.postCommentService.stopReceiveComment();
  }
}