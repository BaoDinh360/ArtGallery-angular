import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize } from 'rxjs';
import { FileUpload } from '../shared/models/fileUploadModel';
import { ResponseResult } from '../shared/models/responseResult';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(
    private httpClient : HttpClient
  ) { }

  uploadFile(type : string, formData : FormData){
    return this.httpClient.post(`/api/fileUpload/${type}`, formData, {
      reportProgress : true,
      observe : 'events'
    });
  }
}
