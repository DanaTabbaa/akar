import { Injectable } from '@angular/core';
 import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Attachments } from 'src/app/core/interfaces/attachments';

import { AppConfigService } from 'src/app/core/services/local-services/app-config.service';
import { BaseService } from 'src/app/core/services/backend-services/base.service';
import { ResponseResult } from 'src/app/core/models/ResponseResult';

@Injectable({
  providedIn: 'root'
})
export class UploadFilesApiService extends BaseService<Attachments>{

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="Attachments";

  }

    uploadFile(formData: FormData) {
      const apiHeaders = new HttpHeaders().append( 'Authorization', 'Bearer ' + localStorage.getItem('token'));
      return this.http.post(AppConfigService.appCongif.url+ "/Attachments/UploadedFiles", formData, {
          // reportProgress: true,
          // observe: 'events',
          headers:apiHeaders
      });
  }

  uploadFileMethod(formData: FormData) {
    const apiHeaders = new HttpHeaders().append( 'Authorization', 'Bearer ' + localStorage.getItem('token'));
    return this.http.post(AppConfigService.appCongif.url + "/Attachments/Upload", formData, {
        reportProgress: true,
        observe: 'events',
        headers:apiHeaders
    });
}

}
