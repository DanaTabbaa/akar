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
const PAGEID = 52;
@Component({
  selector: 'app-units-dues',
  templateUrl: './units-dues.component.html',
  styleUrls: ['./units-dues.component.scss']
})
export class UnitsDuesComponent implements OnInit, OnDestroy {
  //#region constructor
  constructor(private modalService: NgbModal,
    private reportService: ReportService,
    private dateserv: DateConverterService,
    private sharedServices: SharedService,
    private rolesPerimssionsService: RolesPermissionsService
  ) { }
  //#endregion
  //#region properties
  currentUserId=localStorage.getItem("UserId")

  realestateId: any;
  regionId: any;
  unitId: any;
  dateFrom: any;
  dateTo: any;
  subsList: Subscription[] = [];
  toolbarPathData: ToolbarPath = {
    pageId:PAGEID,
    listPath: '',
    addPath: '',
    updatePath: '',
    componentList: "sidebar.units-dues-report",
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
    if (this.unitId == undefined || this.unitId == null) {
      this.unitId = 0;
    }
    if (this.regionId !== undefined || this.regionId == null) {
      this.regionId = 0;
    }

    if (this.realestateId == undefined || this.realestateId == null) {
      this.realestateId = 0;
    }

    if (this.dateFrom == undefined || this.dateFrom == null) {
      this.dateFrom = '2000-01-01';
    }

    if (this.dateTo == undefined || this.dateTo == null) {
      this.dateTo = '2100-01-01';
    }



    let reportParams: string =
      "reportParameter=unitId!" + this.unitId +
      "&reportParameter=regionId!" + this.regionId +
      "&reportParameter=realestateId!" + this.realestateId +
      "&reportParameter=fromDate!" + this.dateFrom +
      "&reportParameter=toDate!" + this.dateTo +
      "&reportParameter=userId!" + this.currentUserId ;



    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.reportParams = reportParams;
    modalRef.componentInstance.reportType = 4;
    modalRef.componentInstance.reportTypeID = 8;
    modalRef.componentInstance.oldUrl = "/control-panel/reports/units-dues";



  }
  cancelDefaultReportStatus() {
    this.reportService.cancelDefaultReport(4, 8).subscribe(resonse => {

    });
  }
  ShowOptions: {
    ShowRegion: boolean, ShowRealestate: boolean, ShowSubRealestate: boolean, ShowBuilding: boolean, ShowOwner: boolean,
    ShowTenant: boolean, ShowUnit: boolean, ShowFromDate: boolean, ShowToDate: boolean, ShowOffice: boolean,
    ShowSearch: boolean, ShowFloor: boolean, ShowRentContract: boolean
  } = {
      ShowBuilding: false,
      ShowTenant: false,
      ShowOwner: false,
      ShowRealestate: true,
      ShowSubRealestate: false,
      ShowRegion: true,
      ShowUnit: true,
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
    this.unitId = e.unitId
    this.realestateId = e.parentRealEstateId
    this.dateFrom = this.dateserv.getDateForReport(e.fromDate)
    this.dateTo = this.dateserv.getDateForReport(e.toDate)




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
