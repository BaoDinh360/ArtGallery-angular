import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from 'src/app/services/post.service';
import { RESPONSE_STATUS } from 'src/app/shared/models/enums';
import { Post } from 'src/app/shared/models/post.model';

@Component({
  selector: 'app-user-post-list',
  templateUrl: './user-post-list.component.html',
  styleUrls: ['./user-post-list.component.css']
})
export class UserPostListComponent implements OnInit {

  tableColumns : string[] = ['actions','index', 'postName', 'likes', 'comments'];
  postList : Post[] = [];
  postPagination! : {
    totalCount: number,
    itemsPerPage: number,
    pageIndex: number,
    totalPage: number,
  }
  constructor(
    private postService : PostService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ){}

  page: number = 1;
  limit: number = 5;

  ngOnInit(): void {
    this.getPostByCurrentUser();
  }

  getPostByCurrentUser(){
    // this.postService.getPostsByCurrentUser(this.page, this.limit).subscribe(result =>{
    //   if(result.status === RESPONSE_STATUS.SUCCESS){
    //     this.postList = result.data.items;
    //     this.postPagination = {
    //       totalCount: result.data.totalCount,
    //       itemsPerPage: result.data.itemsPerPage,
    //       pageIndex: result.data.pageIndex - 1,
    //       totalPage: result.data.totalPage
    //     }
    //   }
    // })
  }

  paginateEvent(event : PageEvent){
    this.limit = event.pageSize;
    this.page = event.pageIndex + 1;
    this.getPostByCurrentUser();
  }

  onViewPostDetail(post: Post){
    this.router.navigate([post._id], {relativeTo: this.activatedRoute})
  }
}
