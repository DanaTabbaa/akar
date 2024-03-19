import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AlertTypes } from 'src/app/core/constants/enumrators/enums';
import { UploadFilesFormComponent } from '../upload-files-form.component';
import { TranslatePipe } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UploadFilesApiService } from 'src/app/shared/services/upload-files-api.service';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { Attachments } from 'src/app/core/interfaces/attachments';
import { AppConfigService } from 'src/app/core/services/local-services/app-config.service';

@Component({
  selector: 'app-perview-uploaded-files',
  templateUrl: './perview-uploaded-files.component.html',
  styleUrls: ['./perview-uploaded-files.component.scss']
})
export class PerviewUploadedFilesComponent implements OnInit {
  @Input() pageId: string="";
  @Input() title: string="";
  @Output() OnSelect: EventEmitter<any> = new EventEmitter<any>();
  constructor(private matDialogRef: MatDialogRef<UploadFilesFormComponent>,
    private translate:TranslatePipe,
    private alertsService: NotificationsAlertsService,
    private modalService:NgbModal,
    private uploadFilesApiService:UploadFilesApiService,
    private cd: ChangeDetectorRef,) { }

  ngOnInit(): void {
    this.getAttachments();
  }

  attachments: Attachments[] = [];

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
              resonse.message
            );
          }
        });
        setTimeout(() => {

        }, 500);


  }
  activeTab=1
  imagesAttachments:Attachments[]=[];
  pdfAttachments:Attachments[]=[];
  otherAttachments:Attachments[]=[];
  getAttachments() {

    let recordId = Number(localStorage.getItem("RecordId")??"");
    let pageId = Number(localStorage.getItem("PageId")??"");
    const promise = new Promise<void>((resolve, reject) => {
      this.uploadFilesApiService.getAll("GetAllData").subscribe({
        next: (res: any) => {

          console.log("getAttachments res  ",res, recordId, pageId)
          ;
            this.imagesAttachments = res.data.filter(x=>(x.recordId==recordId && x.pageId==pageId)&&(x.fileType!="pdf" && x.fileType=="png"|| x.fileType=="jpg"||x.fileType=="jpeg"));
            this.pdfAttachments = res.data.filter(x=>(x.recordId==recordId && x.pageId==pageId)&&(x.fileType=="pdf"));
            this.otherAttachments = res.data.filter(x=>(x.recordId==recordId && x.pageId==pageId)&&(x.fileType!="pdf" && x.fileType!="png"&& x.fileType!="jpg"&&x.fileType!="jpeg"));


          resolve();

        },
        error: (err: any) => {
          reject(err);
        },
        complete: () => {

        },
      });
    });
    return promise;
  }
  getpath(filename) {
    return AppConfigService.appCongif.resourcesUrl+ filename;
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
