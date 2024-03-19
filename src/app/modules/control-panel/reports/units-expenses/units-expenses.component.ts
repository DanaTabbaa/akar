import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EquipmentsVM } from 'src/app/core/models/ViewModel/equipments-vm';
import { EquipmentsService } from 'src/app/core/services/backend-services/equipments.service';
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
const PAGEID = 49;

@Component({
  selector: 'app-units-expenses',
  templateUrl: './units-expenses.component.html',
  styleUrls: ['./units-expenses.component.scss']
})
export class UnitsExpensesComponent implements OnInit, OnDestroy {
  //#region constructor
  constructor(private modalService: NgbModal,
    private reportService: ReportService,
    private equipmentsService: EquipmentsService,
    private sharedServices: SharedService,
    private rolesPerimssionsService: RolesPermissionsService

  ) { }
  //#endregion

  //#region properties
  currentUserId=localStorage.getItem("UserId")

  regionId: any;
  ownerId: any;
  tenantId: any;
  realestateId: any;
  buildingId: any;
  unitId: any;
  floorId: any;
  responsibleId: any;
  equipmentId: any;
  equipmentsList: EquipmentsVM[] = [];
  lang: string = '';
  responsibleObj = [
    {
      id: 1,
      namear: "المالك",
      nameen: "Owner"
    },
    {
      id: 2,
      namear: "المستأجر",
      nameen: "Tenant"
    }
  ]
  subsList: Subscription[] = [];
  toolbarPathData: ToolbarPath = {
    pageId:PAGEID,
    listPath: '',
    addPath: '',
    updatePath: '',
    componentList: "sidebar.units-expenses-report",
    componentAdd: '',
  };
  //#endregion
  //#region ngOnInit
    ngOnInit(): void {
    localStorage.setItem("PageId",PAGEID.toString());
    this.getLanguage();
    this.GetEquipments();
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
    if (this.tenantId == undefined || this.tenantId == null) {
      this.tenantId = 0;
    }
    if (this.buildingId == undefined || this.buildingId == null) {
      this.buildingId = 0;
    }
    if (this.equipmentId == undefined && this.equipmentId == null) {
      this.equipmentId = 0;
    }
    if (this.floorId == undefined || this.floorId == null) {
      this.floorId = 0;
    }
    if (this.unitId == undefined || this.unitId == null) {
      this.unitId = 0;
    }
    if (this.responsibleId == undefined || this.responsibleId == null) {
      this.responsibleId = 0;
    }

    if (this.regionId == undefined || this.regionId == null) {
      this.regionId = 0;
    }
    if (this.realestateId == undefined || this.realestateId == null) {
      this.realestateId = 0;
    }

    let reportParams: string =
      "reportParameter=ownerId!" + this.ownerId +
      "&reportParameter=tenantId!" + this.tenantId +
      "&reportParameter=buildingid!" + this.buildingId +
      "&reportParameter=equipmentId!" + this.equipmentId +
      "&reportParameter=floorId!" + this.floorId +
      "&reportParameter=unitId!" + this.unitId +
      "&reportParameter=responsibleId!" + this.responsibleId +
      "&reportParameter=regionId!" + this.regionId +
      "&reportParameter=realestateId!" + this.realestateId+
      "&reportParameter=userId!" + this.currentUserId ;



    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.reportParams = reportParams;
    modalRef.componentInstance.reportType = 4;
    modalRef.componentInstance.reportTypeID = 4;
    modalRef.componentInstance.oldUrl = "/control-panel/reports/units-expenses";

  }
  cancelDefaultReportStatus() {
    this.reportService.cancelDefaultReport(4, 4).subscribe(resonse => {

    });
  }
  ShowOptions: {
    ShowRegion: boolean, ShowRealestate: boolean, ShowSubRealestate: boolean, ShowBuilding: boolean, ShowOwner: boolean,
    ShowTenant: boolean, ShowUnit: boolean, ShowFromDate: boolean, ShowToDate: boolean, ShowOffice: boolean,
    ShowSearch: boolean, ShowFloor: boolean, ShowRentContract: boolean
  } = {
      ShowBuilding: true,
      ShowTenant: true,
      ShowOwner: true,
      ShowRealestate: true,
      ShowSubRealestate: false,
      ShowRegion: true,
      ShowUnit: true,
      ShowFromDate: false, ShowToDate: false
      , ShowSearch: false
      , ShowFloor: true
      , ShowOffice: false
      , ShowRentContract: false

    }

  OnFilter(e: {
    parentRealEstateId, subRealEstateId,
    ownerId, buildingId, tenantId, regionId, unitId,
    fromDate, toDate, floorId
  }) {

    //(("REPORT ONFILTER ",e);
    this.ownerId = e.ownerId;
    this.tenantId = e.tenantId;
    this.buildingId = e.buildingId
    this.floorId = e.floorId
    this.unitId = e.unitId
    this.regionId = e.regionId
    this.realestateId = e.parentRealEstateId

  }

  GetEquipments() {
    const promise = new Promise<void>((resolve, reject) => {
      this.equipmentsService.getAll("GetAll").subscribe({
        next: (res: any) => {
          this.equipmentsList = res.data.map((res: EquipmentsVM[]) => {
            return res
          });
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
  getLanguage()
  {
    this.sharedServices.getLanguage().subscribe(res => {
      this.lang = res
    })
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
