import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared.service';
import { TenantsVM } from 'src/app/core/models/ViewModel/tenants-vm';
import { TenantsService } from 'src/app/core/services/backend-services/tenants.service';
import { Tenants } from 'src/app/core/models/tenants';
import { Router } from '@angular/router';
import { DateCalculation } from 'src/app/core/services/local-services/date-services/date-calc.service';
import { Subscription } from 'rxjs';
import { MessageModalComponent } from 'src/app/shared/message-modal/message-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe } from '@ngx-translate/core';


@Component({
  selector: 'app-tenants-notification',
  templateUrl: './tenants-notification.component.html',
  styleUrls: ['./tenants-notification.component.scss']
})
export class TenantsNotificationComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() showExpiryOfPersonIdentity!: boolean;
  @Input() notificationPeriodForExpiryOfPersonIdentity!: number;
  subsList: Subscription[] = [];

  lang: string = '';
  tenants: Tenants[] = [];
  isListEmpty;
  editFormatIcon() { //plain text value
    return "<i class=' fa fa-edit'></i>";
  };
  constructor(private SharedServices: SharedService, private tenantsService: TenantsService,
    private router: Router,
    private dateService: DateCalculation,
    private modalService: NgbModal
    , private translate: TranslatePipe,



  ) { }

  ngOnInit(): void {
    this.getLanguage()
    this.getTenants();
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
  getTenants() {
     
    const promise = new Promise<void>((resolve, reject) => {
      this.tenantsService.getAll("GetAll").subscribe({
        next: (res: any) => {
           
          let notificationDate = this.dateService.AddDaysToGregorian(this.notificationPeriodForExpiryOfPersonIdentity, {
            year: new Date().getUTCFullYear(),
            month: (new Date().getMonth() + 1),
            day: new Date().getDate()
          });
          this.tenants = res.data.filter(x => x.respoIdentityExpireDate <= notificationDate).map((res: TenantsVM[]) => {
            return res;
          });
          if (this.tenants.length == 0) {
            this.isListEmpty = true
          }
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
  //#region Tabulator
  panelId: number = 1;
  sortByCols: any[] = [];
  searchFilters: any;
  groupByCols: string[] = [];
  columnNames: any[] = [];
  defineGridColumn() {
    this.SharedServices.getLanguage().subscribe(res => {

      this.lang = res
      this.columnNames = [

        // {
        //   title: this.lang == 'ar' ? ' رقم ' : 'Number',
        //   field: 'id',
        // },
        {
          title: this.lang == 'ar' ? 'رقم المستأجر' : 'Tenant Number',
          field: 'tenantNumber',
        },
        this.lang == 'ar'
          ? { title: 'أسم المستأجر', field: 'nameAr' }
          : { title: 'Tenant Name', field: 'nameEn' },
        this.lang == 'ar'
          ? { title: 'اسم الشخص المسئول', field: 'responsibleNameAr' }
          : { title: 'Responsible Person Namee', field: 'responsibleNameEn' },
        {
          title: this.lang == 'ar' ? 'رقم هوية الشخص المسئول' : 'Identity No of Responsible Person',
          field: 'respoIdentityNo',
        },
        {
          title: this.lang == 'ar' ? ' تاريخ انتهاء هوية الشخص المسئول ' : 'Identity No Expire Date of Responsible Person',
          field: 'respoIdentityExpireDate',
        },
        this.lang == "ar" ? {
          title: "تحديث البيانات",
          field: "", formatter: this.editFormatIcon, cellClick: (e, cell) => {
            this.showConfirmDeleteMessage(cell.getRow().getData().id);
          }
        }
          :
          {
            title: "Edit Data",
            field: "", formatter: this.editFormatIcon, cellClick: (e, cell) => {
              this.showConfirmDeleteMessage(cell.getRow().getData().id);
            }
          },



      ];
    })
  }
  showConfirmDeleteMessage(id: any) {
    const modalRef = this.modalService.open(MessageModalComponent);
    modalRef.componentInstance.message = this.translate.transform("dashboard.confirm-update-tenant");
    modalRef.componentInstance.title = this.translate.transform("dashboard.update-tenant");
    modalRef.componentInstance.btnConfirmTxt = this.translate.transform("buttons.yes");

    modalRef.componentInstance.isYesNo = true;
    modalRef.result.then(rs => {
      //((rs);
      if (rs == "Confirm") {
        this.editTenant(id);
      }
    })

  }
  editTenant(id: any) {
    this.router.navigate(['/control-panel/definitions/update-tenant', id]);

  }


  direction: string = 'ltr';

  onSearchTextChange(searchTxt: string) {
    this.searchFilters = [
      [
        // { field: 'id', type: 'like', value: searchTxt },
        { field: 'tenantNumber', type: 'like', value: searchTxt },
        { field: 'nameEn', type: 'like', value: searchTxt },
        { field: 'nameAr', type: 'like', value: searchTxt },
        { field: 'responsibleNameAr', type: 'like', value: searchTxt },
        { field: 'responsibleNameEn', type: 'like', value: searchTxt },
        { field: 'respoIdentityNo', type: 'like', value: searchTxt },


        ,
      ],
    ];
  }




  //#endregion



}
