import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SearchFormComponent } from '../../search-form/search-form.component';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-quick-modal',
  templateUrl: './quick-modal.component.html',
  styleUrls: ['./quick-modal.component.scss'],

  })

export class QuickModalComponent implements OnInit {


  @Input() title: string="";
  @Input() dataList: any[]=[];
  @Input() searchDataList: any[]=[];
  @Input() searchText: string = "";
  @Input() colomnLables: string[]=[];
  @Input() colomnNames: string[]=[];
  @Output() OnSelect: EventEmitter<any> = new EventEmitter<any>();


  constructor(private matDialogRef: MatDialogRef<SearchFormComponent>) { }




    onNoClick(): void {
      this.matDialogRef.close();
    }

  ngOnInit(): void {
    if (this.searchText) {
      if (this.dataList) {
        this.Search();
      }

    }
  }

  OnDataSelect(selectedItem) {
    ////(("Selected Item is", selectedItem);
    this.OnSelect.emit(selectedItem);
    this.matDialogRef.close()
  }

  Search() {
    if (this.searchText) {
      this.dataList = this.searchDataList.filter(a => {
        let txt: string = "";
        this.colomnNames.forEach(name => {
          txt = txt + " " + (a[name] ? a[name] : "");
        });
        ////((txt);
        return txt.toUpperCase().includes(this.searchText) || txt.toLowerCase().includes(this.searchText);
      });
    }
    else {
      this.dataList = this.searchDataList.filter(a => true);
    }
  }


}
