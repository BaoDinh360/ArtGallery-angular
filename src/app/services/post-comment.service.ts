import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseResult } from '../shared/models/responseResult';
import { PostComment } from '../shared/models/post-comment.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostCommentService {

  private newComment = new Subject<PostComment>();
  newComment$ = this.newComment.asObservable();

  constructor(
    private httpClient: HttpClient,
  ) { }

  getPostComments(postId: string){
    return this.httpClient.get<ResponseResult<PostComment[]>>(`/api/posts/${postId}/comments`);
  }
}
