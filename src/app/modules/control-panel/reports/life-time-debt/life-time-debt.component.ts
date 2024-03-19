import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { ToolbarActions } from 'src/app/core/constants/enumrators/enums';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { UserPermission } from 'src/app/core/models/permissions/user-permissions';
import { RolesPermissionsVm } from 'src/app/core/models/ViewModel/permissions/roles-permissions-vm';
import { RolesPermissionsService } from 'src/app/core/services/backend-services/permissions/roles-permissions.service';
import { ReportService } from 'src/app/core/services/backend-services/report.service';
import { DateConverterService } from 'src/app/core/services/local-services/date-services/date-converter.service';
import { NgbdModalContent } from 'src/app/shared/components/modal/modal-component';
import { SharedService } from 'src/app/shared/services/shared.service';
const PAGEID = 47;

@Component({
  selector: 'app-life-time-debt',
  templateUrl: './life-time-debt.component.html',
  styleUrls: ['./life-time-debt.component.scss']
})
export class LifeTimeDebtComponent implements OnInit ,OnDestroy{

  constructor(private modalService: NgbModal,
    private reportService: ReportService,
    private dateserv: DateConverterService,
    private rolesPerimssionsService: RolesPermissionsService,
    private sharedServices: SharedService
  ) { }

  //properties
  ownerId: any;
  realestateId: any;
  buildingId: any;
  regionId: any;
  tenantId: any;
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
    componentList: "sidebar.life-time-debt-report",
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


    if (this.regionId == undefined || this.regionId == null) {
      this.regionId = 0;
    }
    if (this.buildingId !== undefined || this.buildingId == null) {
      this.buildingId = 0;
    }

    if (this.tenantId == undefined || this.tenantId == null) {
      this.tenantId = 0;
    }


    if (this.realestateId == undefined || this.realestateId == null) {
      this.realestateId = 0;
    }

    if (this.dtFrom == undefined || this.dtFrom == null) {
      this.dtFrom = '2000-01-01';
    }

    if (this.dtTo == undefined || this.dtTo == null) {
      this.dtTo = '2100-01-01';
    }






    let reportParams: string =
      "reportParameter=tenantId!" + this.tenantId +
      "&reportParameter=buildingId!" + this.buildingId +
      "&reportParameter=regionId!" + this.regionId +
      "&reportParameter=realestateId!" + this.realestateId +
      "&reportParameter=fromDate!" + this.dtFrom +
      "&reportParameter=toDate!" + this.dtTo +
      "&reportParameter=userId!" + this.currentUserId 



    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.reportParams = reportParams;
    modalRef.componentInstance.reportType = 4;
    modalRef.componentInstance.reportTypeID = 2;
    modalRef.componentInstance.oldUrl = "/control-panel/reports/tenants-dues";



  }
  cancelDefaultReportStatus() {
    this.reportService.cancelDefaultReport(4, 2).subscribe(resonse => {

    });
  }
  ShowOptions: {
    ShowRegion: boolean, ShowRealestate: boolean, ShowSubRealestate: boolean, ShowBuilding: boolean, ShowOwner: boolean,
    ShowTenant: boolean, ShowUnit: boolean, ShowFromDate: boolean, ShowToDate: boolean, ShowOffice: boolean,
    ShowSearch: boolean, ShowFloor: boolean, ShowRentContract: boolean
  } = {
      ShowBuilding: true,
      ShowTenant: true,
      ShowOwner: false,
      ShowRealestate: true,
      ShowSubRealestate: false,
      ShowRegion: true,
      ShowUnit: false,
      ShowFromDate: true, ShowToDate: true
      , ShowSearch: false
      , ShowFloor: false
      , ShowOffice: false
      , ShowRentContract: false

    }

  OnFilter(e: {
    parentRealEstateId, subRealEstateId,
    ownerId, buildingId, tenantId, regionId, unitId,
    fromDate, toDate, floorId
  }) {

    //(("REPORT ONFILTER ",e);
    this.regionId = e.regionId
    this.tenantId = e.tenantId
    this.realestateId = e.parentRealEstateId
    this.buildingId = e.buildingId
    this.dtFrom = this.dateserv.getDateForReport(e.fromDate)
    this.dtTo = this.dateserv.getDateForReport(e.toDate)




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
