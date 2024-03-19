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
const PAGEID = 48;

@Component({
  selector: 'app-unit-status',
  templateUrl: './unit-status.component.html',
  styleUrls: ['./unit-status.component.scss']
})
export class UnitStatusComponent implements OnInit,OnDestroy {

  constructor( private modalService: NgbModal,
    private reportService:ReportService,
    private sharedServices: SharedService,
    private spinner:NgxSpinnerService,
    private rolesPerimssionsService: RolesPermissionsService
    ) { }

   //properties
   realestateId:any=0;
   buildingId:any=0;
   floorId:any=0;
   regionId:any=0;
   dtFrom: any;
   dtTo: any;
   subsList: Subscription[] = [];
   currentUserId=localStorage.getItem("UserId")

   //
   toolbarPathData: ToolbarPath = {
    pageId:PAGEID,
    listPath: '',
    addPath: '',
    updatePath: '',
    componentList: "sidebar.units-status-report",
    componentAdd: '',
  };
     ngOnInit(): void {
    localStorage.setItem("PageId",PAGEID.toString());
    this.getPagePermissions(PAGEID);
    this.sharedServices.changeButton({ action: 'Report' } as ToolbarData);
    this.listenToClickedButton();
    this.sharedServices.changeToolbarPath(this.toolbarPathData);
   }
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


   if(this.realestateId==null ||this.realestateId==undefined)
   {
    this.realestateId=0;
   }

   if(this.buildingId==null ||this.buildingId==undefined)
   {
    this.buildingId=0;
   }
   if(this.floorId==null ||this.floorId==undefined)
   {
    this.floorId=0;
   }
   if(this.regionId==null ||this.regionId==undefined)
   {
    this.regionId=0;
   }

  //  if(this.dtFrom == undefined || this.dtFrom == null){
  //   this.dtFrom='2000-01-01' ;
  // }

  // if(this.dtTo == undefined || this.dtTo == null){
  //   this.dtTo='2100-01-01' ;
  // }
     let reportParams: string =
      "reportParameter=buildingId!" +this.buildingId+
      "&reportParameter=regionId!" +this.regionId+
      "&reportParameter=floorId!" +this.floorId+
      "&reportParameter=realestateId!" +this.realestateId+
      "&reportParameter=userId!" + this.currentUserId ;

      // "&reportParameter=fromDate!" + this.dtFrom +
      // "&reportParameter=toDate!" + this.dtTo


     const modalRef = this.modalService.open(NgbdModalContent);
     modalRef.componentInstance.reportParams = reportParams;
     modalRef.componentInstance.reportType = 4;
     modalRef.componentInstance.reportTypeID = 3;
     modalRef.componentInstance.oldUrl = "/control-panel/reports/unit-status";


   }
   cancelDefaultReportStatus()
   {
     this.reportService.cancelDefaultReport(4,3).subscribe(resonse => {

     });
   }
   ShowOptions:{ShowRegion:boolean, ShowRealestate:boolean,ShowSubRealestate:boolean, ShowBuilding:boolean, ShowOwner:boolean,
     ShowTenant:boolean, ShowUnit:boolean, ShowFromDate:boolean, ShowToDate:boolean,ShowOffice,
      ShowSearch:boolean , ShowFloor:boolean, ShowRentContract:boolean} = {
       ShowBuilding:true,
       ShowTenant:false,
       ShowOwner:false,
       ShowRealestate:true,
       ShowSubRealestate:false,
       ShowRegion:true,
       ShowUnit:false,
       ShowFromDate: false, ShowToDate: false
       , ShowSearch : false
       , ShowFloor : true
       , ShowOffice : false
       , ShowRentContract:false
     }

     OnFilter(e: {
       parentRealEstateId, subRealEstateId,
       ownerId, buildingId, tenantId, regionId, unitId,
       fromDate, toDate, floorId
     }) {

       //(("REPORT ONFILTER ",e);
        this.regionId = e.regionId
        this.realestateId = e.parentRealEstateId
        this.buildingId = e.buildingId
        this.floorId = e.floorId
        this.dtFrom = e.fromDate
        this.dtTo = e.toDate





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

    //

}