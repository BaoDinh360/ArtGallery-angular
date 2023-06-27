import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Post, PostFilterSearch, PostSort } from '../shared/models/post.model';
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

  private createQueryParams(filterSearch : Object, sortObject?: Object) : HttpParams{
    let params = new HttpParams();
    Object.entries(filterSearch).forEach(([key, value]) =>{
      if(value){
        params = params.append(key, value);
      }
    })

    let sortArray: string[] = [];
    let sortValue = '';
    if(sortObject != undefined){
      Object.entries(sortObject).forEach(([key, value]) =>{
        if(value !== ''){
          sortArray.push(`${key}:${value}`)
        }
      })
    }
    if(sortArray.length > 0){
      sortValue =  sortArray.join(',');
      params = params.append('sort', sortValue);
    }

    return params;
  }

  getAllPosts (postFilterSearch: PostFilterSearch) {
    // return this.httpClient.get<PagedResponseResult<Post>>('/api/posts');
    // return this.httpClient.get<PagedResponseResult<Post>>(`/api/posts?page=${page}&limit=${limit}`);
    // let params = new HttpParams();
    // Object.entries(postFilterSearch).forEach(([key, value]) =>{
    //   if(value){
    //     params = params.append(key, value);
    //   }
    // })
    const params = this.createQueryParams(postFilterSearch);
    return this.httpClient.get<PagedResponseResult<Post>>('/api/posts', { params: params});
  }

  getPost(id: string){
    return this.httpClient.get<ResponseResult<Post>>(`/api/posts/${id}`);
  }

  getPostsByCurrentUser(postFilterSearch: PostFilterSearch, postSort: PostSort){
    const params = this.createQueryParams(postFilterSearch, postSort);
    // return this.httpClient.get<PagedResponseResult<Post>>(`/api/posts/my-posts?page=${page}&limit=${limit}`);
    return this.httpClient.get<PagedResponseResult<Post>>('/api/posts/my-posts', {params : params});
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
