import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReportService } from 'src/app/core/services/backend-services/report.service';
import { NgbdModalContent } from 'src/app/shared/components/modal/modal-component';
import { Subscription } from 'rxjs';
import { ToolbarActions } from 'src/app/core/constants/enumrators/enums';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { UserPermission } from 'src/app/core/models/permissions/user-permissions';
import { RolesPermissionsVm } from 'src/app/core/models/ViewModel/permissions/roles-permissions-vm';
import { RolesPermissionsService } from 'src/app/core/services/backend-services/permissions/roles-permissions.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
const PAGEID = 53;

@Component({
  selector: 'app-historical-unit',
  templateUrl: './historical-unit.component.html',
  styleUrls: ['./historical-unit.component.scss']
})
export class HistoricalUnitComponent implements OnInit,OnDestroy {
  //#region constructor
  constructor( private modalService: NgbModal,
    private reportService:ReportService,
    private spinner:NgxSpinnerService,
    private sharedServices: SharedService,
    private rolesPerimssionsService: RolesPermissionsService
    ) { }
  //#endregion

  //#region properties
  tenantId:any;
   buildingId:any;
   unitId: any;
   contractId: any;
   currentUserId=localStorage.getItem("UserId")

   subsList: Subscription[] = [];
   toolbarPathData: ToolbarPath = {
    pageId:PAGEID,
     listPath: '',
     addPath: '',
     updatePath: '',
     componentList: "sidebar.historical-movement-of-units-report",
     componentAdd: '',
   };
   //#endregion
  //#region ngOnInit
     ngOnInit(): void {
    localStorage.setItem("PageId",PAGEID.toString());
    this.getPagePermissions(PAGEID);
    this.sharedServices.changeButton({ action: 'Report' } as ToolbarData);
    this.listenToClickedButton();
    this.sharedServices.changeToolbarPath(this.toolbarPathData);

   }
  //#endregion
 //#region ngOnDestory
 ngOnDestroy() {
  this.subsList.forEach((s) => {
    if (s) {
      s.unsubscribe();
    }
  });
}
//#endregion
   gotoViewer() {
    if(this.tenantId == undefined || this.tenantId == null){
      this.tenantId= 0 ;
    }
    if(this.buildingId == undefined || this.buildingId == null){
      this.buildingId= 0 ;
    }
    if(this.unitId == undefined || this.unitId == null){
      this.unitId=0 ;
    }

     if(this.contractId == undefined || this.contractId == null){
      this.contractId= 0 ;
    }



    let reportParams: string =
    "reportParameter=unitId!" + this.unitId  +
    "&reportParameter=buildingId!" + this.buildingId +
    "&reportParameter=contractId!" + this.contractId +
    "&reportParameter=tenantId!" + this.tenantId +
    "&reportParameter=userId!" + this.currentUserId 




     const modalRef = this.modalService.open(NgbdModalContent);
     modalRef.componentInstance.reportParams = reportParams;
     modalRef.componentInstance.reportType = 4;
     modalRef.componentInstance.reportTypeID = 11;
     modalRef.componentInstance.oldUrl = "/control-panel/reports/historical-unit";



   }
   cancelDefaultReportStatus()
   {
     this.reportService.cancelDefaultReport(4,11).subscribe(resonse => {

     });
   }
   ShowOptions:{ShowRegion:boolean, ShowRealestate:boolean,ShowSubRealestate:boolean, ShowBuilding:boolean, ShowOwner:boolean,
     ShowTenant:boolean, ShowUnit:boolean, ShowFromDate:boolean, ShowToDate:boolean,ShowOffice:boolean,
      ShowSearch:boolean , ShowFloor:boolean, ShowRentContract:boolean} = {
       ShowBuilding:true,
       ShowTenant:true,
       ShowOwner:false,
       ShowRealestate:false,
       ShowSubRealestate:false,
       ShowRegion:false,
       ShowUnit:true,
       ShowFromDate: false, ShowToDate: false
       , ShowSearch : false
       , ShowFloor : false
       ,ShowOffice:false
      ,ShowRentContract:true
     }

     OnFilter(e: {
       parentRealEstateId, subRealEstateId,
       ownerId, buildingId, tenantId, regionId, unitId,
       fromDate, toDate, floorId,rentContractId
     }) {

       //(("REPORT ONFILTER ",e);
       this.buildingId = e.buildingId
        this.contractId = e.rentContractId
        this.unitId = e.unitId
        this.tenantId = e.tenantId



     }

     listenToClickedButton() {
      let sub = this.sharedServices.getClickedbutton().subscribe({
        next: (currentBtn: ToolbarData) => {
          currentBtn;
          if (currentBtn != null) {
            if (currentBtn.action == ToolbarActions.View) {
              this.gotoViewer();

            }
            else if (currentBtn.action == ToolbarActions.CancelDefaultReport) {
              this.cancelDefaultReportStatus();
            }
            this.sharedServices.changeButton({ action: 'Report' } as ToolbarData);
          }
        },
      });
      this.subsList.push(sub);
    }
    //#region Permissions
    rolePermission!: RolesPermissionsVm;
    userPermissions!: UserPermission;
    getPagePermissions(pageId) {
      const promise = new Promise<void>((resolve, reject) => {
        this.rolesPerimssionsService.getAll("GetPagePermissionById?pageId=" + pageId).subscribe({
          next: (res: any) => {
            this.rolePermission = JSON.parse(JSON.stringify(res.data));
            this.userPermissions = JSON.parse(this.rolePermission.permissionJson);
            this.sharedServices.setUserPermissions(this.userPermissions);
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
      return promise;

    }

    //#endregion
  }
