import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Router } from '@angular/router';
import { DateCalculation } from 'src/app/core/services/local-services/date-services/date-calc.service';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { UnitSelectors } from 'src/app/core/stores/selectors/unit.selectors';
import { UnitsModel } from 'src/app/core/stores/store.model.ts/units.store.model';
import { UnitVM } from 'src/app/core/view-models/unit-vm';


@Component({
  selector: 'app-units-notification',
  templateUrl: './units-notification.component.html',
  styleUrls: ['./units-notification.component.scss']
})
export class UnitsNotificationComponent implements OnInit ,AfterViewInit, OnDestroy{
  @Input() showUnderContractRentalUnits!: boolean;
  subsList: Subscription[] = [];

  

  lang: string = '';
  underContractRentalUnits: UnitVM[] = [];
  isListEmpty;
  editFormatIcon() { //plain text value
    return "<i class=' fa fa-edit'></i>";
  };
  constructor(private SharedServices: SharedService,
    private router: Router,
    private dateService: DateCalculation,
    private store: Store<any>,




    ) { }

  ngOnInit(): void {
    this.getLanguage()
    this.getUnits();
    this.defineGridColumn();

  }
  ngOnDestroy(): void {
    this.subsList.forEach(s => {
      if (s) {
        s.unsubscribe();
      }
    })
  }
  ngAfterViewInit(): void {
   
  }
  getLanguage() {
    this.SharedServices.getLanguage().subscribe(res => {
      this.lang = res
    })
  }
  getUnits() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.store.select(UnitSelectors.selectors.getListSelector).subscribe({
        next: (res: UnitsModel) => {
          this.underContractRentalUnits = JSON.parse(JSON.stringify(res.list.filter(x => x.purposeType == 1 && x.unitStatus == 3)));
          resolve();
        },
        error: (err) => {
          //((err);
          resolve();
        }
      });
      this.subsList.push(sub);
    });
   
  }
    //#region Tabulator
    panelId: number = 1;
    sortByCols: any[] = [];
    searchFilters: any;
    groupByCols: string[] = [];
    columnNames:any[] = [];
    defineGridColumn()
    {
      this.SharedServices.getLanguage().subscribe(res => {
  
        this.lang = res
        this.columnNames = [
  
          {
            title: this.lang == 'ar' ? ' كود الوحدة ' : 'Unit code',
            field: 'unitCode',
          },
          
          this.lang == 'ar'
          ? { title: 'أسم الوحدة', field: 'unitNameAr' }
          : { title: 'Unit Name', field: 'unitNameEn' },
          this.lang == 'ar'
          ? { title: 'نوع الوحدة', field: 'unitTypeNameAr' }
          : { title: 'Unit Type', field: 'unitTypeNameEn' },
          this.lang == 'ar'
          ? { title: 'المبنى', field: 'buildingNameAr' }
          : { title: 'Building', field: 'buildingNameEn' },
          this.lang == 'ar'
          ? { title: 'الدور', field: 'floorNameAr' }
          : { title: 'Floor', field: 'floorNameEn' },
          {
            title: this.lang == 'ar' ? ' المساحة ' : 'Area size',
            field: 'rentAreaSize',
          },
  
        ];
      })
    }
  
  
  
    direction: string = 'ltr';
  
    onSearchTextChange(searchTxt: string) {
      this.searchFilters = [
        [
          { field: 'id', type: 'like', value: searchTxt },
          { field: 'unitNameAr', type: 'like', value: searchTxt },
          { field: 'unitNameEn', type: 'like', value: searchTxt },
          { field: 'unitTypeNameAr', type: 'like', value: searchTxt },
          { field: 'unitTypeNameEn', type: 'like', value: searchTxt },
          { field: 'buildingNameAr', type: 'like', value: searchTxt },
          { field: 'floorNameAr', type: 'like', value: searchTxt },
          { field: 'floorNameEn', type: 'like', value: searchTxt },

  
  
          ,
        ],
      ];
    }
  
  
    
  
    //#endregion
  
  
 
}
