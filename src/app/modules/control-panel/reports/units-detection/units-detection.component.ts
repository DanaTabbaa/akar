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
const PAGEID = 54;

@Component({
  selector: 'app-units-detection',
  templateUrl: './units-detection.component.html',
  styleUrls: ['./units-detection.component.scss']
})
export class UnitsDetectionComponent implements OnInit, OnDestroy {
  //#region constructor
  constructor(private modalService: NgbModal,
    private reportService: ReportService,
    private sharedServices: SharedService,
    private rolesPerimssionsService: RolesPermissionsService
  ) { }
  //#endregion

  //#region properties
  currentUserId=localStorage.getItem("UserId")

  ownerId: any = 0;
  buildingId: any = 0;
  floorId: any = 0;
  regionId: any = 0;
  realestateId: any = 0;
  subsList: Subscription[] = [];
  toolbarPathData: ToolbarPath = {
    pageId:PAGEID,
    listPath: '',
    addPath: '',
    updatePath: '',
    componentList: "sidebar.units-report",
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

    if (this.ownerId == undefined || this.ownerId == null) {
      this.ownerId = 0;
    }
    if (this.buildingId == undefined || this.buildingId == null) {
      this.buildingId = 0;
    }
    if (this.floorId !== undefined || this.floorId == null) {
      this.floorId = 0;
    }

    if (this.realestateId == undefined || this.realestateId == null) {
      this.realestateId = 0;
    }


    if (this.regionId == undefined || this.regionId == null) {
      this.regionId = 0;
    }



    let reportParams: string =
      "reportParameter=ownerId!" + this.ownerId +
      "&reportParameter=buildingId!" + this.buildingId +
      "&reportParameter=floorId!" + this.floorId +
      "&reportParameter=regionId!" + this.regionId +
      "&reportParameter=realestateId!" + this.realestateId +
      "&reportParameter=userId!" + this.currentUserId ;



    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.reportParams = reportParams;
    modalRef.componentInstance.reportType = 4;
    modalRef.componentInstance.reportTypeID = 12;
    modalRef.componentInstance.oldUrl = "/control-panel/reports/units-statement";



  }
  cancelDefaultReportStatus() {
    this.reportService.cancelDefaultReport(4, 12).subscribe(resonse => {

    });
  }
  ShowOptions: {
    ShowRegion: boolean, ShowRealestate: boolean, ShowSubRealestate: boolean, ShowBuilding: boolean, ShowOwner: boolean,
    ShowTenant: boolean, ShowUnit: boolean, ShowFromDate: boolean, ShowToDate: boolean, ShowOffice: boolean,
    ShowSearch: boolean, ShowFloor: boolean, ShowRentContract: boolean
  } = {
      ShowBuilding: true,
      ShowTenant: false,
      ShowOwner: true,
      ShowRealestate: true,
      ShowSubRealestate: false,
      ShowRegion: true,
      ShowUnit: false,
      ShowFromDate: false, ShowToDate: false
      , ShowSearch: false
      , ShowFloor: true
      , ShowOffice: false
      , ShowRentContract: false
    }

  OnFilter(e: {
    parentRealEstateId, subRealEstateId,
    ownerId, buildingId, tenantId, regionId, unitId,
    fromDate, toDate, floorId, rentContractId
  }) {

    //(("REPORT ONFILTER ",e);
    this.ownerId = e.ownerId
    this.buildingId = e.buildingId
    this.floorId = e.floorId
    this.regionId = e.regionId
    this.realestateId = e.parentRealEstateId




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
