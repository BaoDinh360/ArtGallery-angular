import { HttpEvent, HttpEventType } from '@angular/common/http';
import { AfterViewInit, Component, ComponentRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { PostService } from 'src/app/services/post.service';
import { SnackbarNotificationService } from 'src/app/services/snackbar-notification.service';
import { AlertComponent } from 'src/app/shared/components/alert/alert.component';
import { FileUploadComponent } from 'src/app/shared/components/file-upload/file-upload.component';
import { CreatePost } from 'src/app/shared/models/create-post.model';
import { AlertStatus, EditPageState, RESPONSE_STATUS } from 'src/app/shared/models/enums';
import { FileUpload } from 'src/app/shared/models/fileUploadModel';
import { Post } from 'src/app/shared/models/post.model';
import { ResponseResult } from 'src/app/shared/models/responseResult';
import {ENTER} from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.css']
})
export class PostEditComponent implements OnInit {

  @ViewChild('fileUpload') fileUpload! : FileUploadComponent;

  postForm : FormGroup;
  postImgId : string = '';
  imgPreviewUrl : any;
  fileImage!: File;

  postId!: string;
  editPageState! : EditPageState;
  post! : Post;

  displayConfig!: {
    title : string,
    buttonTitle: string
  }

  readonly separatorKeyCodes = [ENTER] as const;

  constructor(
    private postService : PostService,
    public router : Router,
    private route : ActivatedRoute,
    private snackBar: SnackbarNotificationService,
  ){
    this.postForm = new FormGroup({
      postNameControl : new FormControl<string>('', [
        Validators.required
      ]),
      postDescriptionControl : new FormControl<string>(''),
      postTagControl : new FormControl<string[]>([]),
      postImageUploadControl : new FormControl('')
    })
  }

  get postName() {return this.postForm.get('postNameControl')};
  get postDescription() {return this.postForm.get('postDescriptionControl')};
  get postImage() {return this.postForm.get('postImageUploadControl')}
  get postTags() {return this.postForm.get('postTagControl')};

  get isDisplayForm() : boolean{
    return this.editPageState === EditPageState.CREATE || 
      (this.editPageState === EditPageState.EDIT && this.post !== undefined);
  }

  get isEditPage(): boolean{
    return this.editPageState === EditPageState.EDIT;
  }
  get isCreatePage(): boolean{
    return this.editPageState === EditPageState.CREATE;
  }

  ngOnInit(): void {
    this.route.data.subscribe(data =>{
      this.editPageState = data['pageState'];
      this.postId = this.route.snapshot.params['id'];
      if(this.editPageState == EditPageState.EDIT && this.postId != ''){
        this.getPostDetail(this.postId);
        this.postImage?.disable();
        this.displayConfig = {
          title: 'Edit post',
          buttonTitle: 'Update post'
        }
      }
      else{
        this.displayConfig = {
          title: 'Create a new post',
          buttonTitle: 'Create post'
        }
      }
    })
  }

  getPostDetail(id: string){
    this.postService.getPost(id).subscribe(result =>{
      if(result.status == RESPONSE_STATUS.SUCCESS){
        this.post = result.data;
        this.postForm.patchValue({
          postNameControl: this.post.postName,
          postDescriptionControl: this.post.description,
          postTagControl: this.post.postTags
        })
        this.imgPreviewUrl = this.post.postImage;
      }
    })
  }

  onFileSelected(result : any){
    this.imgPreviewUrl = result.imageUrl;
    this.fileImage = result.fileImg;
  }

  onFileUploadCompleted(result : ResponseResult<FileUpload>){
    console.log(result);
    this.postImgId = result.data._id;
    console.log(this.postImage?.value);
  }

  onAddPostTag(event: MatChipInputEvent): void{
    const value = (event.value || '').trim();
    if(value){
      this.postTags?.value.push(value);
    }
    event.chipInput!.clear();
  }

  onRemovePostTag(tagIndex: number): void{
    if(tagIndex >= 0){
      this.postTags?.value.splice(tagIndex, 1);
    }
  }

  onSubmit(){
    if(this.postForm.valid){
      const postData: CreatePost = {
        postName : this.postName?.value as string,
        description : this.postDescription?.value as string,
        postImage : undefined,
        postTags: this.postTags?.value
      }

      if(this.isCreatePage){
        this.createPost(postData);
      }
      else if(this.isEditPage){
        this.updatePost(postData);
      }
    }
    else{
      this.snackBar.showErrorSnackbar('Invalid inputs. Please try again');
    }
  }

  createPost(newPost: CreatePost){
    const imageFormData = new FormData();
      imageFormData.append('image', this.fileImage);
      this.postService.uploadPostImage(imageFormData).subscribe(result =>{
        newPost.postImage = result.data
        this.postService.createPost(newPost)
          .subscribe(result =>{
            if(result.status === RESPONSE_STATUS.SUCCESS){
              this.snackBar.showSuccessSnackbar('New post created successfully', 3);
              setTimeout(() =>{
                this.router.navigate(['']);
              }, 3000);
            }
            // else{
            //   this.snackBar.showErrorSnackbar(result.message);
            // }
        })
      })
  }

  updatePost(updatedPost: CreatePost){
    const updatedPostId = this.post._id;
    this.postService.updatePost(updatedPostId, updatedPost).subscribe(result =>{
      if(result.status === RESPONSE_STATUS.SUCCESS){
        this.snackBar.showSuccessSnackbar(`Post: ${updatedPost.postName} updated successfully`, 3);
        // setTimeout(() =>{
        //   this.router.navigate(['']);
        // }, 3000);
      }
      // else{
      //   this.snackBar.showErrorSnackbar(result.message);
      // }
    })
  }

  resetForm(){
    this.postForm.reset();
  }
}
