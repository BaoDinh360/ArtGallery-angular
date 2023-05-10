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
    //emit data xuống server
    this.eventSocket.emitData('like-events', post.id);
    
    this.eventSocket.receivedEmitedData('like-events');
    this.eventSocket.getDataReceived().subscribe(result =>{
      if(result != undefined){
        this.UpdatePostLikesRealTime(result);
      }
      
    })
  }

  UpdatePostLikesRealTime(data: any){
    const postIndex = this.postLists.findIndex(post => post.id == data.id);
    if(postIndex != -1){
      this.postLists[postIndex].likes = data.likes;
      console.log(this.postLists[postIndex]);
      
    }
  }

  openPostDetail(post: Post){
    this.router.navigate(['/post', post.author.username, post.id]);
  }
}
