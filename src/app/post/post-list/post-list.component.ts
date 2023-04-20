import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { PostService } from '../../services/post.service';
import { Post } from '../../shared/models/postModel';

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
    private authService : AuthService
  ){}

  ngOnInit(): void {
    this.postService.getAllPosts().subscribe(result =>{
      console.log(result);
      result.data.items.forEach(post =>{
        if(post.postImage !== undefined){
          post.postImageUrl = window.location.origin + '/' + post.postImage.filePath;
        }
      })
      this.postLists = result.data.items;
      console.log(this.postLists);
      
      
    })
  }

  ngAfterViewChecked(): void {
    this.isUserSignedIn =  this.authService.isSignedIn();
  }
}
