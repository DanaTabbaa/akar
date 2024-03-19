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
const PAGEID = 59;
@Component({
  selector: 'app-water-consumption',
  templateUrl: './water-consumption.component.html',
  styleUrls: ['./water-consumption.component.scss']
})
export class WaterConsumptionComponent implements OnInit, OnDestroy {
  //#region constructor
  constructor(private modalService: NgbModal,
    private reportService: ReportService,
    private sharedServices: SharedService,
    private rolesPerimssionsService: RolesPermissionsService
  ) { }
  //#endregion

  //#region properties
  currentUserId=localStorage.getItem("UserId")

  realestateId: any = 0;
  regionId: any = 0;
  fromDate: any;
  toDate: any;
  subsList: Subscription[] = [];
  toolbarPathData: ToolbarPath = {
    pageId:PAGEID,
    listPath: '',
    addPath: '',
    updatePath: '',
    componentList: "sidebar.monthly-water-consumption",
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
    if (this.realestateId == null || this.realestateId == undefined) {
      this.realestateId = 0;
    }
    if (this.regionId == null || this.regionId == undefined) {
      this.regionId = 0;
    }
    if (this.fromDate == undefined || this.fromDate == null) {
      this.fromDate = '2000-01-01';
    }

    if (this.toDate == undefined || this.toDate == null) {
      this.toDate = '2100-01-01';
    }

    let reportParams: string =
      "reportParameter=regionId!" + this.regionId +
      "&reportParameter=realestateId!" + this.realestateId +
      "&reportParameter=fromDate!" + this.fromDate +
      "&reportParameter=toDate!" + this.toDate +
      "&reportParameter=userId!" + this.currentUserId ;


    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.reportParams = reportParams;
    modalRef.componentInstance.reportType = 4;
    modalRef.componentInstance.reportTypeID = 19;
    modalRef.componentInstance.oldUrl = "/control-panel/reports/water-consumption";

  }
  cancelDefaultReportStatus() {
    this.reportService.cancelDefaultReport(4, 19).subscribe(resonse => {

    });
  }
  ShowOptions: {
    ShowRegion: boolean, ShowRealestate: boolean, ShowSubRealestate: boolean, ShowBuilding: boolean, ShowOwner: boolean,
    ShowTenant: boolean, ShowUnit: boolean, ShowFromDate: boolean, ShowToDate: boolean, ShowOffice,
    ShowSearch: boolean, ShowFloor: boolean, ShowRentContract: boolean
  } = {
      ShowBuilding: false,
      ShowTenant: false,
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
    this.realestateId = e.parentRealEstateId
    this.fromDate = e.fromDate
    this.toDate = e.toDate

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

  //#endregion
}

