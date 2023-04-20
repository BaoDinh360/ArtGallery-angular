import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreatePost, Post } from '../shared/models/postModel';
import { PagedResponseResult, ResponseResult } from '../shared/models/responseResult';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(
    private httpClient : HttpClient
  ) { }

  getAllPosts () {
    return this.httpClient.get<PagedResponseResult<Post>>('/api/posts');
  }

  createPost(newPost : CreatePost){
    return this.httpClient.post<ResponseResult<Post>>('/api/posts', newPost);
  }
}
