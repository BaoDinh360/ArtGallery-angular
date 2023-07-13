import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject, Subject } from 'rxjs';
import { AuthService } from './auth.service';
import { PostService } from './post.service';
import { PostCommentService } from './post-comment.service';
import { PostComment } from '../shared/models/post-comment.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventSocketService extends Socket {

  // private dataReceived = new BehaviorSubject<any>(undefined);
  // private dataReceived$ = this.dataReceived.asObservable();

  //post like observable
  private postLikeData = new Subject<{
    type: string,
    postId: string, 
    likes: number,
    userId: string,
  }>()
  private postLikeData$ = this.postLikeData.asObservable();

  //post comment observable
  private newPostComment = new Subject<PostComment>();
  private newPostComment$ = this.newPostComment.asObservable();

  //total comment observable
  private totalPostComment = new Subject<{
    postId: string,
    totalComments: number
  }>();
  private totalPostComment$ = this.totalPostComment.asObservable();

  getNewPostLikeData(){
    return this.postLikeData$;
  }
  getNewPostComment(){
    return this.newPostComment$;
  }
  getNewTotalPostComment(){
    return this.totalPostComment$;
  }

  constructor(
    // private postService: PostService,
    private authService: AuthService,
    // private postCommentService: PostCommentService,
  ) { 
    super({ url: environment.baseURL, options: { 
      autoConnect: false, 
    } })
  }

  // getDataReceived(){
  //   return this.dataReceived$;
  // }
  // connectSocket(data: any){
  //   this.socket.connect();
  //   this.socket.emit('user-connected', data);
  // }
  // disconnectSocket(data: any){
  //   this.socket.emit('user-disconnected', data);
  //   this.socket.disconnect();
  // }
  // emitData(eventName: string, data: any){
  //   this.socket.emit(eventName, data);
  // }
  // receivedEmitedData(eventName: string){
  //   this.socket.on(eventName, (data: any) =>{
  //     this.dataReceived.next(data);
  //   })
  // }

  // listenToEmitEvent(eventName: string, execFunc: Function){
  //   this.socket.on(eventName, (data: any) =>{
  //     execFunc(data);
  //   });
  // }

  // stopEventListener(eventName: string){
  //   this.socket.removeListener(eventName);

  // }

  connectToSocket(){
    this.connect();
    this.setUpEventListener();
  }
  disconnectFromSocket(){
    this.disconnect();
    this.removeAllListeners();
  }

  likePostEvent(){
    this.on('like-update', (data: any) =>{
      this.postLikeData.next({
        type: data.type,
        postId: data.id,
        likes: data.likes,
        userId: data.userId
      });
    })
  }

  commentPostEvent(){
    //update new comment
    this.on('new-comment', (data: any) =>{
      this.newPostComment.next(data);
    })
    //update new total comments count
    this.on('update-total-comment', (data: any) =>{
      console.log(data);
      this.totalPostComment.next(data);
    })
  }
  emitEvent(eventName: string, data: any, authorization: boolean = true){
    this.emit(eventName, {data: data, accessToken: this.authService.getAuthAcessToken()});
  }

  setUpEventListener(){
    this.likePostEvent();
    this.commentPostEvent();
    console.log('socket now listening to events');
  }
}
