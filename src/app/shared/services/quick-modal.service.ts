import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ComponentType } from '@angular/cdk/portal';


@Injectable({
  providedIn: 'root'
})
export class QuickModalService {




  constructor(private dialog: MatDialog) {

  }



  // ...

  showDialog<T>(component: ComponentType<T>): Observable<any> {
    const dialogRef = this.dialog.open<T>(component, {
      disableClose: true
    });

    // Assuming you have a trigger to close the dialog, such as a button click
    const closeDialog = () => {
      dialogRef.close(); // Close the dialog
    };

    return dialogRef.afterClosed();
  }
  closeDialog(){
    this.dialog.closeAll();
  }

}
