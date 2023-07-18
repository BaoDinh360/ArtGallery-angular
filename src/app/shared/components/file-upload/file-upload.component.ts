import { HttpEventType } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';
import { finalize } from 'rxjs';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { FileUpload } from '../../models/fileUploadModel';
import { ResponseResult } from '../../models/responseResult';
import { RESPONSE_STATUS } from '../../models/enums';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: FileUploadComponent
    }
  ]
})
export class FileUploadComponent implements ControlValueAccessor {
  uploadImgName : string = 'Choose image';
  fileUpload : File | null = null;
  uploadProgress : number = 0;
  disabled: boolean = false;

  @ViewChild('fileInput') fileInputVar! : ElementRef;
  @ViewChild('openFileButton') openFileButtonVar! : ElementRef;

  @Output() fileUploadCompleted : EventEmitter<ResponseResult<FileUpload>> 
    = new EventEmitter<ResponseResult<FileUpload>>();
  @Output() fileSelected : EventEmitter<any> 
    = new EventEmitter<any>();

  constructor(
    private fileUploadService : FileUploadService,
  ){}

  writeValue(file : File): void {
    this.fileUpload = file;
  }

  onChange : Function = (file : File) =>{};

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  openFolder(){
    this.fileInputVar.nativeElement.click();
  }

  onSelectFile(event : any){
    const fileImg = event.target.files[0];
    if(fileImg){
      this.fileUpload = fileImg;
      this.uploadImgName = fileImg.name;
      console.log(this.fileUpload);

      this.onChange(this.fileUpload);

      const reader = new FileReader();
      reader.readAsDataURL(fileImg);
      reader.onload = (_event) =>{
        const imageUrl = reader.result;
        this.fileSelected.emit({
          imageUrl,
          fileImg
        });
      }
    }
  }

  uploadFile(){
    if(this.fileUpload != null){
      const imageFormData = new FormData();
      imageFormData.append('file', this.fileUpload);
      this.fileUploadService.uploadFile('posts', imageFormData)
      .pipe(
        finalize(() =>{
          this.uploadProgress = 0;
        })
      )
      .subscribe((event) =>{
        switch(event.type){
          case HttpEventType.UploadProgress:
            if(event?.loaded && event?.total){
              this.uploadProgress = Math.round(event.loaded / event.total * 100);
            }
            break;
          case HttpEventType.Response :
            const result = event.body as unknown as ResponseResult<FileUpload>;
            if(result.status === RESPONSE_STATUS.SUCCESS){
                console.log(result);
                this.uploadImgName = this.fileUpload!.name;
                this.fileUploadCompleted.emit(result);
              }
        }
      })
    }
  }

  clearFileUpload() : void{
    this.fileInputVar.nativeElement.value = '';
    this.fileUpload = null;
  }
}
