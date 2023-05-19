import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Post } from '../../shared/models/post.model';
import { PostService } from 'src/app/services/post.service';
import { FormControl, FormGroup } from '@angular/forms';
import { EventSocketService } from 'src/app/services/event-socket.service';
import { PostComment } from 'src/app/shared/models/post-comment.model';
import { PostCommentService } from 'src/app/services/post-comment.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent implements OnInit, OnDestroy {
  postId!: string;
  post!: Post;
  commentForm: FormGroup;
  postCommentsList!: PostComment[];
  postComments$!: Observable<PostComment[]>;
  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private eventSocket: EventSocketService,
    private postCommentService: PostCommentService,
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
      this.postCommentService.receiveNewComment();
    })
    this.postCommentService.newComment$.subscribe(result =>{
      if(result != undefined){
        this.postCommentsList = [...this.postCommentsList, result];
      }
    })
  }

  getPostDetailById(id: string){
    this.postService.getPost(id).subscribe(result =>{
      this.post = result.data;
      this.postCommentService.getPostComments(id).subscribe(result =>{
        this.postCommentsList = result.data;
      })
      
    })
  }

  onComment(){
    const commentData ={
      postCommented: this.post._id,
      comment: this.commentRef?.value as string
    }
    this.eventSocket.emitData('comment-events', commentData);
  }

  ngOnDestroy(): void {
    this.postCommentService.stopReceiveComment();
  }
}
