import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Post } from '../../models/post.model';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent implements OnInit {
  postId!: string;
  post!: Post;
  constructor(
    private route: ActivatedRoute,
    private postService: PostService
  ){}

  ngOnInit(): void {
    this.route.params.subscribe(param =>{
      this.postId = param['id'];
      console.log(this.postId);
      this.getPostDetailById(this.postId);
    })
  }

  getPostDetailById(id: string){
    this.postService.getPost(id).subscribe(result =>{
      this.post = result.data;
      console.log(this.post);
      
    })
  }
}
