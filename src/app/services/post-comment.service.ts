import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseResult } from '../shared/models/responseResult';
import { PostComment } from '../shared/models/post-comment.model';
import { Subject } from 'rxjs';
import { EventSocketService } from './event-socket.service';

@Injectable({
  providedIn: 'root'
})
export class PostCommentService {

  private newComment = new Subject<PostComment>();
  newComment$ = this.newComment.asObservable();

  constructor(
    private httpClient: HttpClient,
    private eventSocket: EventSocketService
  ) { }

  getPostComments(postId: string){
    return this.httpClient.get<ResponseResult<PostComment[]>>(`/api/posts/${postId}/comments`);
  }

  // getNewComment(){
  //   this.eventSocket.receivedEmitedData('new-comment');
  //   this.eventSocket.getDataReceived().subscribe(result =>{
  //     this.newComment.next(result);
  //     this.newComment$.subscribe(result => console.log(result))
      
  //   })
  // }

  setNewCommentData(data: any){
    this.newComment.next(data);
  }

  receiveNewComment(){
    console.log('listen to event');
    this.eventSocket.getConnectedSocket().on('new-comment', (data: any) =>{
      this.newComment.next(data);
    })
  }

  stopReceiveComment(){
    this.eventSocket.stopEventListener('new-comment');
  }
}
