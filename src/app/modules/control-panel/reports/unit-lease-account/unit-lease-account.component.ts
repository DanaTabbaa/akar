import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReportService } from 'src/app/core/services/backend-services/report.service';
import { DateConverterService } from 'src/app/core/services/local-services/date-services/date-converter.service';
import { NgbdModalContent } from 'src/app/shared/components/modal/modal-component';
import { Subscription } from 'rxjs';
import { ToolbarActions } from 'src/app/core/constants/enumrators/enums';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { UserPermission } from 'src/app/core/models/permissions/user-permissions';
import { RolesPermissionsVm } from 'src/app/core/models/ViewModel/permissions/roles-permissions-vm';
import { RolesPermissionsService } from 'src/app/core/services/backend-services/permissions/roles-permissions.service';
import { SharedService } from 'src/app/shared/services/shared.service';
const PAGEID = 50;
@Component({
  selector: 'app-unit-lease-account',
  templateUrl: './unit-lease-account.component.html',
  styleUrls: ['./unit-lease-account.component.scss']
})
export class UnitLeaseAccountComponent implements OnInit, OnDestroy {
  //#region constructor
  constructor(private modalService: NgbModal,
    private reportService: ReportService,
    private dateserv: DateConverterService,
    private sharedServices: SharedService,
    private rolesPerimssionsService: RolesPermissionsService
  ) { }
  //#endregion

  //#region properties
  ownerId: any = "0";
  tenantId: any = "0";
  dtFrom: any;
  dtTo: any;
  lang: any = "en";
  currentUserId=localStorage.getItem("UserId")

  subsList: Subscription[] = [];
  toolbarPathData: ToolbarPath = {
    pageId:PAGEID,
    listPath: '',
    addPath: '',
    updatePath: '',
    componentList: "sidebar.account-unit-tenant-report",
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
    let tenantid = 0;
    if (this.tenantId !== undefined && this.tenantId !== null) {
      tenantid = this.tenantId;
    }

    let reportParams: string =
      "reportParameter=startDate!" + this.dtFrom +
      "&reportParameter=endDate!" + this.dtTo +
      "&reportParameter=tenantId!" + tenantid +
      "&reportParameter=userId!" + this.currentUserId ;


    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.reportParams = reportParams;
    modalRef.componentInstance.reportType = 4;
    modalRef.componentInstance.reportTypeID = 5;
    modalRef.componentInstance.oldUrl = "/control-panel/reports/unit-lease-account";

  }
  cancelDefaultReportStatus() {
    this.reportService.cancelDefaultReport(4, 5).subscribe(resonse => {

    });
  }
  ShowOptions: {
    ShowRegion: boolean, ShowRealestate: boolean, ShowSubRealestate: boolean, ShowBuilding: boolean, ShowOwner: boolean,
    ShowTenant: boolean, ShowUnit: boolean, ShowFromDate: boolean, ShowToDate: boolean, ShowOffice: boolean,
    ShowSearch: boolean, ShowFloor: boolean, ShowRentContract: boolean
  } = {
      ShowBuilding: false,
      ShowTenant: true,
      ShowOwner: false,
      ShowRealestate: false,
      ShowSubRealestate: false,
      ShowRegion: false,
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
    // this.ownerId=e.ownerId;
    this.tenantId = e.tenantId;
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

  //#endregion
}