import { HttpEvent, HttpEventType } from '@angular/common/http';
import { AfterViewInit, Component, ComponentRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { PostService } from 'src/app/services/post.service';
import { AlertComponent } from 'src/app/shared/components/alert/alert.component';
import { FileUploadComponent } from 'src/app/shared/components/file-upload/file-upload.component';
import { AlertStatus } from 'src/app/shared/models/enums';
import { FileUpload } from 'src/app/shared/models/fileUploadModel';
import { CreatePost, Post } from 'src/app/shared/models/postModel';
import { ResponseResult } from 'src/app/shared/models/responseResult';

@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.css']
})
export class PostEditComponent implements OnInit {

  @ViewChild('viewContainerRef', {read: ViewContainerRef}) viewConRef! : ViewContainerRef;
  @ViewChild('fileUpload') fileUpload! : FileUploadComponent;

  alertRef! : ComponentRef<AlertComponent>;
  alertStatus = AlertStatus;

  postForm : FormGroup;
  postImgId : string = '';
  imgPreviewUrl : any;

  constructor(
    private postService : PostService,
    public router : Router
  ){
    this.postForm = new FormGroup({
      postNameControl : new FormControl<string>('', [
        Validators.required
      ]),
      postDescriptionControl : new FormControl<string>(''),
      postImageUploadControl : new FormControl('')
    })
  }

  get postName() {return this.postForm.get('postNameControl')};
  get postDescription() {return this.postForm.get('postDescriptionControl')};
  get postImage() {return this.postForm.get('postImageUploadControl')}

  ngOnInit(): void {
    console.log(this.alertRef);
    
  }

  onFileSelected(result : any){
    this.imgPreviewUrl = result;
  }

  onFileUploadCompleted(result : ResponseResult<FileUpload>){
    console.log(result);
    this.postImgId = result.data._id;
    console.log(this.postImage?.value);
    this.showAlert(this.alertStatus.SUCCESS, result.message);
  }

  onSubmit(){
    if(this.postImgId == ''){
      this.showAlert(this.alertStatus.ERROR, 'Please upload image first');
      return;
    }

    if(this.postForm.valid){

      const newPost : CreatePost = {
        postName : this.postName?.value as string,
        description : this.postDescription?.value as string,
        postImage : this.postImgId
      }
      this.postService.createPost(newPost)
        .pipe(
          catchError(err =>{
            console.log(err);
            return of(err.error);
          })
        )
        .subscribe(result =>{
          console.log(result);
          if(result.status == 'success'){
            this.showAlert(this.alertStatus.SUCCESS, result.message);
            //this.resetForm();
          }
          else{
            this.showAlert(this.alertStatus.ERROR, result.message);
          }
          
          //this.router.navigate(['']);
      })
      
    }
  }

  showAlert(alertType : string, alertMsg : string) : void{
    if(this.alertRef){
      this.removeAlert();
    }
    this.alertRef = this.viewConRef.createComponent(AlertComponent);
    this.alertRef.instance.alertType = alertType;
    this.alertRef.instance.alertMsg = alertMsg;
    
  }
  removeAlert() : void{
    if(!this.alertRef){
      return;
    }
    const alertRefIndex = this.viewConRef.indexOf(this.alertRef.hostView);
    if(alertRefIndex != -1){
      this.viewConRef.remove(alertRefIndex);
      this.alertRef.destroy();
    }
  }

  resetForm(){
    this.postForm.reset();
  }
}
