import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FileUploadSource } from '../../file-upload/models/upload-source';
import { Subscription, interval, of } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { TranslatePipe } from '@ngx-translate/core';
import { UploadFilesApiService } from 'src/app/shared/services/upload-files-api.service';
import { HttpClient, HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { Attachments } from 'src/app/core/interfaces/attachments';
import { AlertTypes } from 'src/app/core/constants/enumrators/enums';
import { MessageModalComponent } from 'src/app/shared/message-modal/message-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { ApiConnectionService } from 'src/app/core/services/backend-services/api-connection/api-connection.service';
import { AppConfigService } from 'src/app/core/services/local-services/app-config.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-upload-files-form',
  templateUrl: './upload-files-form.component.html',
  styleUrls: ['./upload-files-form.component.scss']
})
export class UploadFilesFormComponent implements OnInit {

  @Input() pageId: string="";
  @Input() title: string="";

  @Output() OnSelect: EventEmitter<any> = new EventEmitter<any>();

  fileName:string="";
  constructor(private matDialogRef: MatDialogRef<UploadFilesFormComponent>,
    private cdr: ChangeDetectorRef,
    private translate:TranslatePipe,
    private alertsService: NotificationsAlertsService,
    private modalService:NgbModal,
    private uploadFilesApiService:UploadFilesApiService,
    private spinner:NgxSpinnerService,
    private cd: ChangeDetectorRef,) { }

  ngOnInit(): void {

    //console.log("this pageId",this.matDialogRef.componentInstance.pageId)
    this.getAttachments();
  }

  OnDataSelect(selectedItem) {
    ////(("Selected Item is", selectedItem);
    this.OnSelect.emit(selectedItem);
    this.matDialogRef.close()
  }


  _allowMultiple = true;
  _showCaption = false;
  _throwError = false;
  _showStatusBar = false;
  _uploadSource: FileUploadSource = {upload: (file: File, uploadItemId: number) => {

      let progress = 0;
      return interval(100).pipe(
        finalize(() =>

          console.log(`Upload stream complete: [${uploadItemId}][${file.name}]`)
        ),
        map(() => {
          progress += Math.floor(Math.random() * 10 + 1);

          // if ((uploadItemId === 2 || uploadItemId === 4) && progress > 50) {
          //   throw new Error('Error uploading file');
          // }

          this.validateFile(file.name)
          // if (file.type === 'application/pdf') {
          //   throw new Error('File type not supported');
          // }

          return Math.min(progress, 100);
        })
      )
    },
    delete: (uploadItemId: number) => {
      return of(uploadItemId);
    },

  };

    //////////////////////upload & download files////////////////////
    public Result!: boolean;
    subsList: Subscription[] = [];

  //   appendFiles(file:File) {
  //     ;
  //    // this.preview(file)
  //     let fileToUpload = <File>file;
  //     const formData = new FormData();
  //     formData.append('file', fileToUpload, fileToUpload.name);
  //     if (file != null) {
  //       //formData.append(file.name, file);
  //       formData.append("pageId",this.pageId);
  //       formData.append("fileName",this.fileName);
  //       formData.append("fileType",this.getFileExtension(file.name));
  //       return new Promise<void>((resolve, reject) => {
  //         let sub = this.uploadFilesApiService.uploadFile(formData).subscribe({
  //         next: (res) => {

  //           resolve();
  //         },
  //         error: (err: any) => {
  //           reject(err);
  //         },
  //         complete: () => {


  //         },
  //       });
  //       this.subsList.push(sub);
  //     });
  //   }
  //   return

  // }



    getFileExtension(filename) {
      return filename.split('.').pop();
    }
    getpath(filename) {
      return AppConfigService.appCongif.resourcesUrl+ filename;
    }
    ///
    validateFile(name: String) {

      var ext = name.substring(name.lastIndexOf('.') + 1);
      if ((ext.toLowerCase() == 'png') || (ext.toLowerCase() == 'jpg') || (ext.toLowerCase() == 'jpeg')
        || (ext.toLowerCase() == 'pdf') || (ext.toLowerCase() == 'docs')||(ext.toLowerCase() == 'csv'))  {
        return true;
      }
      else {
        throw new Error(this.translate.transform("upload-files.file-not-supported"));
      }
    }



    download(dataurl, filename) {
      var a = document.createElement("a");
      a.href = dataurl;
      a.setAttribute("download", filename);
      a.click();
    }
    deleteFile(attachmentId)
    {
      this.showConfirmDeleteMessage(attachmentId)
    }
    showConfirmDeleteMessage(id: number) {
    this.uploadFilesApiService.deleteWithUrl("delete?id=" + id).subscribe((resonse) => {
            this.getAttachments();
            if (resonse.success == true) {

              this.showResponseMessage(
                resonse.success,
                AlertTypes.success,
                this.translate.transform("messages.delete-success")
              );
            } else if (resonse.success == false) {
              this.showResponseMessage(
                resonse.success,
                AlertTypes.error,
                this.translate.transform("messages.delete-faild")
              );
            }
          });
          setTimeout(() => {

          }, 500);


    }
    mediaExtensions: string[] = [
      ".PNG", ".JPG", ".JPEG", ".BMP", ".GIF",".XLSX",
       ".DIVX",".PDF",".csv",".TXT",".XLSB"
      ,".XML",".PPTX",".DOCX",".DOTX",".DOC"
      //etc
    ];
    attachments: Attachments[] = [];
    getAttachments() {

      let recordId = Number(localStorage.getItem("RecordId")??"");
      let pageId = Number(localStorage.getItem("PageId")??"");
      const promise = new Promise<void>((resolve, reject) => {
        this.uploadFilesApiService.getAll("GetAllData").subscribe({
          next: (res: any) => {

              this.attachments= res.data.filter(x=>( x.pageId==pageId));

            resolve();

          },
         error: (err: any) => {
            this.spinner.hide();
            reject(err);
          },
          complete: () => {

          },
        });
      });
      this.cdr.detectChanges();
      return promise;
    }

    id
    showResponseMessage(responseStatus, alertType, message) {

      if (responseStatus == true && AlertTypes.success == alertType) {
        this.alertsService.showSuccess(message, this.translate.transform("messageTitle.done"))
      } else if (responseStatus == true && AlertTypes.warning) {
        this.alertsService.showWarning(message, this.translate.transform("messageTitle.alert"))
      } else if (responseStatus == true && AlertTypes.info) {
        this.alertsService.showInfo(message, this.translate.transform("messageTitle.info"))
      } else if (responseStatus == false && AlertTypes.error) {
        this.alertsService.showError(message, this.translate.transform("messageTitle.error"))
      }
    }

}
