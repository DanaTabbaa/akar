import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UploadFilesFormComponent } from '../components/pages/upload-files/upload-files-form.component';
import { Observable } from 'rxjs';
import { PerviewUploadedFilesComponent } from '../components/pages/upload-files/perview-uploaded-files/perview-uploaded-files.component';

@Injectable({
  providedIn: 'root'
})
export class UploadFilesDialogService {

  selectedItem: any;
  constructor(private dialog: MatDialog) {

  }

  showDialog(title:string,pageId:any,recordId:any): Observable<any> {
      const dialogRef = this.dialog.open<UploadFilesFormComponent>(UploadFilesFormComponent, {
          disableClose: true,
          data: this.selectedItem
      });
      dialogRef.componentInstance.title = title;
      dialogRef.componentInstance.pageId = pageId;

      return dialogRef.componentInstance.OnSelect;

  }
  showDialogPerviewUploadedFiles(title:string,pageId:any,recordId:any): Observable<any> {
    const dialogRef = this.dialog.open<PerviewUploadedFilesComponent>(PerviewUploadedFilesComponent, {
        disableClose: true,
        data: this.selectedItem
    });
    dialogRef.componentInstance.title = title;
    dialogRef.componentInstance.pageId = pageId;

    return dialogRef.componentInstance.OnSelect;

}
}
