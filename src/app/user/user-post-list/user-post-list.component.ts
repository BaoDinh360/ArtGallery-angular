import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/services/post.service';
import { Post } from 'src/app/shared/models/postModel';

@Component({
  selector: 'app-user-post-list',
  templateUrl: './user-post-list.component.html',
  styleUrls: ['./user-post-list.component.css']
})
export class UserPostListComponent implements OnInit {

  tableColumns : string[] = ['index', 'postName', 'likes', 'comments'];
  postList : Post[] = [];
  constructor(
    private postService : PostService
  ){}

  ngOnInit(): void {
    this.postService.getPostsByCurrentUser().subscribe(result =>{
      if(result.status == 'success'){
        this.postList = result.data.items;
      }
    })
  }

}
