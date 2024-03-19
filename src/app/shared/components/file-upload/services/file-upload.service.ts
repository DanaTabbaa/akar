import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  merge,
  Observable,
  of,
  Subject,
  Subscription,
} from 'rxjs';
import {
  catchError,
  first,
  map,
  shareReplay,
  startWith,
  switchMap,
  takeUntil,
  takeWhile,
} from 'rxjs/operators';

import { FileUploadItem } from '../models/upload-item';
import { FileUploadSource } from '../models/upload-source';
import { FileUploadState } from '../models/upload-state';
import { UploadFilesDialogService } from 'src/app/shared/services/upload-files-dialog.service';
import { UploadFilesApiService } from 'src/app/shared/services/upload-files-api.service';
import { MatDialogRef } from '@angular/material/dialog';
import { UploadFilesFormComponent } from '../../pages/upload-files/upload-files-form.component';
import { Attachments } from 'src/app/core/interfaces/attachments';
import { showResponseMessage } from 'src/app/helper/helper';
import { TranslatePipe } from '@ngx-translate/core';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { AlertTypes } from 'src/app/core/constants/enumrators/enums';
import { TechniciansUsers } from 'src/app/core/models/technicians-users';

let UPLOAD_ITEM_COUNT = 0;

@Injectable()
export class FileUploadService {
  private _uploadChangeSubject = new Subject<void>();
  private _resetSubject = new Subject<undefined>();

  private _fileUploadItemMap = new Map<number, Observable<FileUploadItem>>();

  /**
   * Upload state
   */
  uploadState$: Observable<FileUploadState>;

  constructor( private uploadFilesApiSerivce:UploadFilesApiService,private translate:TranslatePipe,
     private alertService:NotificationsAlertsService) {
    const uploadStatus$ = this._uploadChangeSubject.pipe(
      switchMap(() =>
        combineLatest(Array.from(this._fileUploadItemMap.values()))
      ),
      map((uploadItems) => {
        const { activeUploads, failedUploads, completeUploads } =
          this._partitionUploads(uploadItems);

        return {
          totalProgress: this._calculateTotalProgress(activeUploads),
          activeUploads,
          failedUploads,
          completeUploads,
          uploadItems,
        };
      }),
      shareReplay()
    );

    this.uploadState$ = merge(uploadStatus$, this._resetSubject) as Observable<FileUploadState>;
  }

  /**
   * Add new files and track their upload progress
   */
  addFiles(files: FileList, uploadSource: FileUploadSource) {
    Array.from(files).forEach((file) => {
      const uploadItemId = UPLOAD_ITEM_COUNT++;
      const startFileUploadSubject = new BehaviorSubject<undefined>(undefined);
      const cancelFileUploadSubject = new Subject<void>();

      const partialUploadItem: Omit<FileUploadItem, 'progress'> = {
        id: uploadItemId,
        fileName: file.name,
        fileType: file.type,
        retry: () => {
          // Next startFileUploadSubject to restart the stream
          startFileUploadSubject.next(undefined);
        },
        cancel: () => {
          cancelFileUploadSubject.next();
          cancelFileUploadSubject.complete();
          this.removeFile(uploadItemId);
        },
        delete: () => {
          if (uploadSource?.delete) {
            uploadSource
              ?.delete(uploadItemId)
              .pipe(first())
              .subscribe(() => {
                // If delete is successful, remove the file.
                cancelFileUploadSubject.next();
                cancelFileUploadSubject.complete();
                this.removeFile(uploadItemId);
              });
          } else {
            cancelFileUploadSubject.next();
            cancelFileUploadSubject.complete();
            this.removeFile(uploadItemId);
          }
        },
      };

      // Start the stream with the startFileUploadSubject so that the stream to can be retried.
      const fileUploadItemStream$ = startFileUploadSubject.pipe(
        switchMap(() => {
          // Pass the file off to be uploaded.
          // Include uploadItemId so consumers have a reference to the id we use internally
          // to identify an upload. This is particularly useful when a file should be deleted
          return uploadSource.upload(file, uploadItemId).pipe(
            startWith(0),
            map((progress) => {
              const uploadItem: FileUploadItem = {
                ...partialUploadItem,
                progress: this._convertToDecimal(progress),
              };

              return uploadItem;
            }),
            // Automatically complete if the progress reaches 100%.

            takeWhile((uploadItem) => uploadItem.progress < 1, true),
            // Complete if the file upload is cancelled or reset.
            takeUntil(merge(cancelFileUploadSubject, this._resetSubject)),
            // Catch errors and return a new FileUploadItem with the error message.
            catchError((error: Error) => {
              console.error(error);
              const errorUploadItem: FileUploadItem = {
                ...partialUploadItem,
                progress: 0,
                error: error.message,
              };
              return of(errorUploadItem);
            })
          );
        }),
        // Share the stream so that new subscriptions are not created with new files are added.
        shareReplay(1)
      );

      // Add the file upload stream
      let fileToUpload = <File>file;
      const formData = new FormData();
      formData.append('file', fileToUpload, fileToUpload.name);
      formData.append("pageId",localStorage.getItem("PageId")??"");
      formData.append("recordId", localStorage.getItem("RecordId")??"");
      formData.append("fileName",fileToUpload.name);
      formData.append("fileType",this.getFileExtension(file.name));
     // this.uploadFile(formData)
      this._fileUploadItemMap.set(uploadItemId, fileUploadItemStream$);
    });

    // Next _uploadChangeSubject to combine the new streams with the current streams and update state.
    this._uploadChangeSubject.next();
  }
  getFileExtension(filename) {
    return filename.split('.').pop();
  }



  onUploaedFiles(files: FileList,fileName:string) {
    Array.from(files).forEach((file) => {
      let fileToUpload = <File>file;
      const formData = new FormData();
      formData.append('file', fileToUpload, fileToUpload.name);
      formData.append("pageId",localStorage.getItem("PageId")??"");
      formData.append("recordId", localStorage.getItem("RecordId")??"");
      formData.append("fileName",fileToUpload.name);
      formData.append("fileNameOriginal",fileName);
      formData.append("fileType",this.getFileExtension(file.name));
      this.uploadFile(formData)
    });
  }
  /**
   * Remove file and stop tracking it's upload progress
   */
  removeFile(uploadItemId: number) {
    this._fileUploadItemMap.delete(uploadItemId);
    this._uploadChangeSubject.next();

    // If the last file upload item is removed, the combineLatest will not fire.
    // Next _resetSubject to clear state.
    if (this._fileUploadItemMap.size === 0) {
      this._resetSubject.next(undefined);
    }
  }

  /**
   * Reset the file upload
   */
  reset() {
    this._fileUploadItemMap.clear();
    this._uploadChangeSubject.next();
    this._resetSubject.next(undefined);
  }

  private _calculateTotalProgress(fileUploadItems: FileUploadItem[]) {
    const total = fileUploadItems.length * 100;
    const totalCompleted = fileUploadItems.reduce((completed, uploadItem) => {
      return completed + (uploadItem.progress / total) * 100;
    }, 0);
    return Math.min(totalCompleted, 1);
  }

  private _partitionUploads(fileUploadItems: FileUploadItem[]) {
    const activeUploads: FileUploadItem[] = [];
    const completeUploads: FileUploadItem[] = [];
    const failedUploads: FileUploadItem[] = [];

    fileUploadItems.forEach((fileUploadItem) => {
      if (!!fileUploadItem.error) {
        failedUploads.push(fileUploadItem);
      } else if (fileUploadItem.progress < 1) {
        activeUploads.push(fileUploadItem);
      } else {
        completeUploads.push(fileUploadItem);
      }
    });

    return {
      activeUploads,
      completeUploads,
      failedUploads,
    };
  }

  private _convertToDecimal(progress: number) {
    return progress <= 1 ? progress : progress / 100;
  }
  subsList: Subscription[] = [];
 successMessage=this.translate.transform("upload-files.file-uploaded-Successfully")
  uploadFile(file:FormData) {
      return new Promise<void>((resolve, reject) => {
        let sub = this.uploadFilesApiSerivce.uploadFile(file).subscribe({
        next: (res:any) => {

          if(res.success){
            let ids:string ="ids=";
            ((res.data)as number[]).forEach(n=>{
              ids += n+",";
            })

            ids = ids.substring(0, ids.length-1);
            localStorage.removeItem("attachments");
            localStorage.setItem("attachments", ids);
            this.getAttachments();
            showResponseMessage(this.translate,this.alertService,res.success,AlertTypes.success,this.successMessage)

          }
          resolve();
        },
        error: (err: any) => {
          reject(err);
        },
        complete: () => {


        },
      });
      this.subsList.push(sub);
    }).then(a=>{
      //  this.getAttachments();
    });
  }

  attachments: Attachments[] = [];
  getAttachments() {
    let recordId = Number(localStorage.getItem("RecordId")??"");
    let pageId = Number(localStorage.getItem("PageId")??"");
    const promise = new Promise<void>((resolve, reject) => {
      this.uploadFilesApiSerivce.getAll("GetAllData").subscribe({
        next: (res: any) => {

           this.attachments= res.data.filter(x=>(x.pageId==pageId));

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



}



