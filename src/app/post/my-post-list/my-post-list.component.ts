import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { PostService } from 'src/app/services/post.service';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { RESPONSE_STATUS } from 'src/app/shared/models/enums';
import { Post } from 'src/app/shared/models/post.model';

@Component({
  selector: 'app-my-post-list',
  templateUrl: './my-post-list.component.html',
  styleUrls: ['./my-post-list.component.css']
})
export class MyPostListComponent {
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
    private dialog: MatDialog
  ){}

  page: number = 1;
  limit: number = 5;

  ngOnInit(): void {
    this.getPostByCurrentUser();
  }

  getPostByCurrentUser(){
    this.postService.getPostsByCurrentUser(this.page, this.limit).subscribe(result =>{
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
    this.limit = event.pageSize;
    this.page = event.pageIndex + 1;
    this.getPostByCurrentUser();
  }

  onEditPost(post: Post){
    //post/:author/edit-post/:id
    this.router.navigate(['post', post.author.username, 'edit-post', post._id]);
  }

  onViewPostDetail(post: Post){
    //post/:author/:id
    // this.router.navigate([post.id], {relativeTo: this.activatedRoute})
    this.router.navigate(['post', post.author.username, post._id]);
  }

  openDeleteConfirm(post: Post) : void{
    const dialogRef = this.dialog.open(ConfirmDialogComponent, 
    {
      height : 'auto',
      width : '30%',
      data: post.postName
    });
    
    dialogRef.afterClosed().subscribe((result: boolean) =>{
      if(result == false || result == undefined){
        return;
      }
      else{
        this.deletePost(post);
      }
    });
  }

  test(data: string){

  }

  deletePost(post: Post){
    const deletedPostId = post._id;
    this.postService.deletePost(deletedPostId).subscribe(result =>{
      if(result.status == RESPONSE_STATUS.SUCCESS){
        // const deletedPostIndex = this.postList.findIndex(post => post.id == deletedPostId);
        // this.postList.splice(deletedPostIndex, 1);
        this.postList = this.postList.filter(post => post._id == deletedPostId);
      }
    })
  }
}
