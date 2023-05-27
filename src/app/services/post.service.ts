import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Post } from '../shared/models/post.model';
import { PagedResponseResult, ResponseResult } from '../shared/models/responseResult';
import { Image } from '../shared/models/image.model';
import { CreatePost } from '../shared/models/create-post.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(
    private httpClient : HttpClient,
  ) { }

  private postLikeData = new Subject<{
    postId: string, 
    likes: number,
  }>();
  private postLikeData$ = this.postLikeData.asObservable();

  getNewPostLikeData(){
    return this.postLikeData$;
  }

  getAllPosts (page: number, limit: number) {
    // return this.httpClient.get<PagedResponseResult<Post>>('/api/posts');
    return this.httpClient.get<PagedResponseResult<Post>>(`/api/posts?page=${page}&limit=${limit}`);
  }

  getPost(id: string){
    return this.httpClient.get<ResponseResult<Post>>(`/api/posts/${id}`);
  }

  getPostsByCurrentUser(page: number, limit: number){
    return this.httpClient.get<PagedResponseResult<Post>>(`/api/posts/my-posts?page=${page}&limit=${limit}`);
  }

  createPost(newPost : CreatePost){
    return this.httpClient.post<ResponseResult<Post>>('/api/posts', newPost);
  }

  updatePost(id: string, updatePost: CreatePost){
    return this.httpClient.put<ResponseResult<string>>(`/api/posts/${id}`, updatePost);
  }

  deletePost(id: string){
    return this.httpClient.delete<ResponseResult<boolean>>(`/api/posts/${id}`);
  }

  uploadPostImage(formData: FormData){
    return this.httpClient.post<ResponseResult<Image>>('/api/posts/upload', formData);
  }
}
