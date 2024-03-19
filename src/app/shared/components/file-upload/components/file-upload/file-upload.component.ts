import { Directionality } from '@angular/cdk/bidi';
import {
  Component,
  ContentChild,
  ElementRef,
  Input,
  TemplateRef,
  ViewChild,
  OnInit
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { fadeInOutTrigger } from '../../animations/fade-in-out';

import { FileUploadInputDirective } from '../../directives/file-input.directive';
import { FileUploadItemActionDirective } from '../../directives/file-upload-item-action.directive';
import { FileUploadDialogData } from '../../models/upload-dialog-data';
import { FileUploadSource } from '../../models/upload-source';
import { FileUploadState } from '../../models/upload-state';
import { FileUploadService } from '../../services/file-upload.service';
import { FileUploadDialogComponent } from '../file-upload-dialog/file-upload-dialog.component';
import { Attachments } from 'src/app/core/interfaces/attachments';
import { UploadFilesApiService } from 'src/app/shared/services/upload-files-api.service';
import { isEmptyArray, showResponseMessage } from 'src/app/helper/helper';
import { TranslatePipe } from '@ngx-translate/core';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { AlertTypes } from 'src/app/core/constants/enumrators/enums';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  providers: [FileUploadService],
  animations: [fadeInOutTrigger],
})
export class FileUploadComponent implements OnInit {
  _uploadState$: Observable<FileUploadState>;

  @ContentChild(FileUploadInputDirective, { read: ElementRef })
  _fileInputRef?: ElementRef<HTMLInputElement>;

  @ContentChild(FileUploadItemActionDirective, { read: TemplateRef })
  _customUploadItemActionTemplate?: TemplateRef<unknown>;

  @ViewChild('defaultUploadItemActionTemplate', { static: true })
  _defaultUploadItemActionTemplate?: TemplateRef<unknown>;

  /**
   * Source to upload selected files to.
   */
  @Input()
  uploadSource?: FileUploadSource;
  @Input()
  fileName?: string;

  @Input()
  statusBar = false;
  uploadedFilesList!:FileList
  constructor(
    private _dialogService: MatDialog,
    private _directionality: Directionality,
    private _fileUploadService: FileUploadService,
    private uploadFilesApiService:UploadFilesApiService,
    private translate:TranslatePipe,
    private alertService:NotificationsAlertsService,
  ) {
    this._uploadState$ = this._fileUploadService?.uploadState$;


  }

  ngOnInit(): void {
    this.resetUploadedFileList();
  }

  ngAfterContentInit() {
    if (!this._fileInputRef) {
      throw new Error('File input with a FileInputDirective is required');
    }

  }
resetUploadedFileList()
{
  const filesArray = Array.from(this.uploadedFilesList as FileList);
  filesArray.length = 0; // Clear the array
   this.uploadedFilesList = Object.create(FileList.prototype, {
     length: { value: 0 },
     item: {value:null},
   });
}
  /**
   * Reset file upload
   */
  reset() {
    this._fileUploadService.reset();
    if (this._fileInputRef) {
      this._fileInputRef.nativeElement.files = null;
      this._fileInputRef.nativeElement.value = null!;
    }
  }



  _onFileChange(files: FileList) {
    this.uploadedFilesList=files;
    // Only add files if an uploadSource has been provided.
    // If no upload source is provided, it is assumed the consumer will handle the upload state.
    if (this.uploadSource) {
      if (!this._fileInputRef?.nativeElement.multiple) {
        this._fileUploadService.reset();
      }
      this.preview(files);

      this._fileUploadService.addFiles(files, this.uploadSource);
    }
  }
  uploadMessage=this.translate.transform("upload-files.upload-file-required")
  onUploadfilebuttion(){

    if(this.uploadedFilesList?.length??false)
    {
     this._fileUploadService.onUploaedFiles(this.uploadedFilesList,this.fileName??'');
     this.resetUploadedFileList();
    }else{
      showResponseMessage(this.translate,this.alertService,true,AlertTypes.warning,this.uploadMessage)
    }

  }
  imageIsClosed = false;
  public imagePath;
  imgURL: any;
  public message!: string;
  preview(files) {
    ;
    if (files.length==0)
         return;

    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      //this.message = "Only images are supported.";
      return;
    }
    var reader = new FileReader();
    this.imagePath = files[0];
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imageIsClosed = false;
      this.imgURL = reader.result;
    }
  }

  files;

  closeImage() {
    this.imageIsClosed = true;
  }

  attachments: Attachments[] = [];
  getpath(filename) {
    return "Resources/Images/" + filename;
  }
  download(dataurl, filename) {
    var a = document.createElement("a");
    a.href = dataurl;
    a.setAttribute("download", filename);
    a.click();
  }


  id

  _onView() {
    const uploadData: FileUploadDialogData = {
      uploadItems$: this._uploadState$.pipe(
        map((status) => status?.uploadItems ?? []),
        shareReplay()
      ),
      uploadItemActionTemplate:
        this._customUploadItemActionTemplate ??
        this._defaultUploadItemActionTemplate!,
    };

    this._dialogService.open(FileUploadDialogComponent, {
      data: uploadData,
      minWidth: 350,
      direction: this._directionality.value,
    });
  }
}
