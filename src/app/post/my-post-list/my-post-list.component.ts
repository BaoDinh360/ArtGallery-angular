import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { PostService } from 'src/app/services/post.service';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { RESPONSE_STATUS } from 'src/app/shared/models/enums';
import { PageFilterSearch } from 'src/app/shared/models/page-filter-search.model';
import { Post, PostFilterSearch, PostSort } from 'src/app/shared/models/post.model';

@Component({
  selector: 'app-my-post-list',
  templateUrl: './my-post-list.component.html',
  styleUrls: ['./my-post-list.component.css']
})
export class MyPostListComponent {
  tableColumns : string[] = ['actions','index', 'postName', 'likeCount', 'commentCount', 'createdAt'];
  postList : Post[] = [];
  postPagination! : {
    totalCount: number,
    itemsPerPage: number,
    pageIndex: number,
    totalPage: number,
  }

  postFilterSearch: PostFilterSearch ={
    page : 1,
    limit: 5
  };

  postSort: PostSort ={
    postName: '',
    likeCount: '',
    commentCount: ''
  }

  constructor(
    private postService : PostService,
    private router: Router,
    private dialogService: DialogService,
  ){}

  // page: number = 1;
  // limit: number = 5;

  ngOnInit(): void {
    this.getPostByCurrentUser();
  }

  getPostByCurrentUser(){
    this.postService.getPostsByCurrentUser(this.postFilterSearch, this.postSort).subscribe(result =>{
      if(result.status === RESPONSE_STATUS.SUCCESS){
        this.postList = result.data.items;
        
        this.postPagination = {
          totalCount: result.data.totalCount,
          itemsPerPage: result.data.itemsPerPage,
          pageIndex: result.data.pageIndex - 1,
          totalPage: result.data.totalPage
        }
      }
    })
  }

  paginateEvent(event : PageEvent){
    // this.limit = event.pageSize;
    // this.page = event.pageIndex + 1;
    this.postFilterSearch.page = event.pageIndex + 1;
    this.postFilterSearch.limit = event.pageSize;
    this.getPostByCurrentUser();
  }

  onEditPost(post: Post){
    this.router.navigate(['post', post.author.username, 'edit-post', post._id]);
  }

  onViewPostDetail(post: Post){
    this.router.navigate(['post', post.author.username, post._id]);
  }

  openDeleteConfirm(post: Post) : void{
    const dialogRef = this.dialogService.showDeleteDialog(
      `Delete post: ${post.postName}`, 'Are you sure you want to delete this post?', true);
    dialogRef.afterClosed().subscribe((result: boolean) =>{
      if(result == true){
        this.deletePost(post);
      }
    })
  }

  deletePost(post: Post){
    const deletedPostId = post._id;
    this.postService.deletePost(deletedPostId).subscribe(result =>{
      if(result.status == RESPONSE_STATUS.SUCCESS){
        this.getPostByCurrentUser();
      }
    })
  }

  onSortChange(sortState: Sort){
    this.resetSortState();
    if(sortState.direction){
      console.log(`Column sorted ${sortState.active} ${sortState.direction}`);
      this.postSort[sortState.active as keyof PostSort] = sortState.direction;
    }
    else{
      console.log(`Column sorted ${sortState.active} ended`);
    }
    this.getPostByCurrentUser();
  }

  resetSortState(){
    this.postSort ={
      postName: '',
      likeCount: '',
      commentCount: ''
    }
  }
}
