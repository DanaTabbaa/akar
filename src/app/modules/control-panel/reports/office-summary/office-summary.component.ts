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
import { NgbdModalContent } from 'src/app/shared/components/modal/modal-component';
import { SharedService } from 'src/app/shared/services/shared.service';
const PAGEID = 46;

@Component({
  selector: 'app-office-summary',
  templateUrl: './office-summary.component.html',
  styleUrls: ['./office-summary.component.scss']
})
export class OfficeSummaryComponent implements OnInit, OnDestroy {

  constructor(private modalService: NgbModal,
    private reportService: ReportService,
    private sharedServices: SharedService,
    private rolesPerimssionsService: RolesPermissionsService
  ) { }

  //#region properties
  ownerId: number = 0;
  officeId: number = 0;
  subsList: Subscription[] = [];
  currentUserId=localStorage.getItem("UserId")

  toolbarPathData: ToolbarPath = {
    pageId:PAGEID,
    listPath: '',
    addPath: '',
    updatePath: '',
    componentList: "sidebar.office-summary-report",
    componentAdd: '',
  };
  //#endregion



    ngOnInit(): void {
    localStorage.setItem("PageId",PAGEID.toString());
    this.getPagePermissions(PAGEID);
    this.sharedServices.changeButton({ action: 'Report' } as ToolbarData);
    this.listenToClickedButton();
    this.sharedServices.changeToolbarPath(this.toolbarPathData);
    // this.sharedServices.changeButton({action:'Disactive'}as ToolbarData);
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

    if (this.ownerId == null || this.ownerId == undefined) {
      this.ownerId = 0;
    }
    if (this.officeId == null || this.officeId == undefined) {
      this.officeId = 0;
    }

    let reportParams: string =
    "reportParameter=ownerId!" + this.ownerId +
    "&reportParameter=officeId!" + this.officeId+
    "&reportParameter=userId!" + this.currentUserId 



    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.reportParams = reportParams;
    modalRef.componentInstance.reportType = 4;
    modalRef.componentInstance.reportTypeID = 1;
    modalRef.componentInstance.oldUrl = "/control-panel/reports/office-summary";



  }
  cancelDefaultReportStatus() {
    this.reportService.cancelDefaultReport(4, 1).subscribe(resonse => {

    });
  }
  ShowOptions: {
    ShowRegion: boolean, ShowRealestate: boolean, ShowSubRealestate: boolean, ShowBuilding: boolean, ShowOwner: boolean,
    ShowTenant: boolean, ShowUnit: boolean, ShowFromDate: boolean, ShowToDate: boolean, ShowOffice: boolean,
    ShowSearch: boolean, ShowFloor: boolean, ShowRentContract: boolean
  } = {
      ShowBuilding: false,
      ShowTenant: false,
      ShowOwner: true,
      ShowRealestate: false,
      ShowSubRealestate: false,
      ShowRegion: false,
      ShowUnit: false,
      ShowFromDate: false, ShowToDate: false
      , ShowSearch: false
      , ShowFloor: false
      , ShowOffice: true
      , ShowRentContract: false
    }

  OnFilter(e: {
    parentRealEstateId, subRealEstateId,
    ownerId, buildingId, tenantId, regionId, unitId,
    fromDate, toDate, floorId, officeId
  }) {

    //(("REPORT ONFILTER ",e);
    this.officeId = e.officeId
    this.ownerId = e.ownerId

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
