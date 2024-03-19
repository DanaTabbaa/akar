import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertTypes, ToolbarActions } from 'src/app/core/constants/enumrators/enums';
import { ITabulatorActionsSelected } from 'src/app/core/interfaces/ITabulator-action-selected';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { ResponseResult } from 'src/app/core/models/ResponseResult';
import { Floor } from 'src/app/core/models/floors';
import { FloorsService } from 'src/app/core/services/backend-services/floors.service';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { SettingMenuShowOptions } from 'src/app/core/view-models/setting-menu-show-options';
import { MessageModalComponent } from 'src/app/shared/message-modal/message-modal.component';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Subscription } from 'rxjs'
import { RolesPermissionsService } from 'src/app/core/services/backend-services/permissions/roles-permissions.service';
import { RolesPermissionsVm } from 'src/app/core/models/ViewModel/permissions/roles-permissions-vm';
import { UserPermission } from 'src/app/core/models/permissions/user-permissions';
import { ManagerService } from 'src/app/core/services/backend-services/manager.service';
import { navigateUrl } from 'src/app/core/helpers/helper';
const PAGEID = 6; // from pages table in database seeding table
@Component({
  selector: 'app-floors',
  templateUrl: './floors.component.html',
  styleUrls: ['./floors.component.scss']
})
export class FloorsComponent implements OnInit {

  //#region Main Declarations
  activeTab = 1;
  floorFrom!: FormGroup;

  submited: boolean = false;
  errorMessage: any = '';
  errorClass = '';
  floor: Floor = new Floor();
  floors: Floor[] = [];

  //Response!: ResponseResult<Floor>;
  currnetUrl;
  addUrl: string = '/control-panel/definitions/add-floor';
  updateUrl: string = '/control-panel/definitions/update-floor/';
  listUrl: string = '/control-panel/definitions/floors-list';
  toolbarPathData: ToolbarPath = {
    pageId: PAGEID,
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList: "component-names.list-floors",
    componentAdd: "component-names.add-floor",
  };

  //#endregion

  //#region Constructor
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private alertsService: NotificationsAlertsService,
    private translateService: TranslateService,
    private spinner: NgxSpinnerService,
    private translate: TranslatePipe,
    private rolesPerimssionsService: RolesPermissionsService,
    private sharedServices: SharedService,
    private floorService: FloorsService,
    private managerService: ManagerService
  ) {
    this.createFloorForm();
  }

  //#endregion
  sub: any;
  id: any;
  //#region ngOnInit
  ngOnInit(): void {

    localStorage.setItem("PageId", PAGEID.toString());

    this.spinner.show();
    Promise.all([this.managerService.loadPagePermissions(PAGEID)]).then(a => {
      this.getRouteData();
      this.changePath();
      this.listenToClickedButton();
    }).catch(e=>{
      this.spinner.hide();
    })





  
    //this.loadData();


  }
  //#endregion

  getRouteData() {
    let sub = this.route.params.subscribe((params) => {
      if (params["id"]) {
        this.getFloorById(Number(params["id"])).then(a => {
          this.spinner.hide();
          this.sharedServices.changeButton({ action: 'Update', submitMode: false } as ToolbarData);
          localStorage.setItem("RecordId", params["id"]);

        });

      } else {
        this.spinner.hide();
        this.sharedServices.changeButton({ action: 'New' } as ToolbarData);
      }

    });
    this.subsList.push(sub)
  }

  //#region ngOnDestroy
  ngOnDestroy() {
    this.subsList.forEach((s) => {
      if (s) {
        s.unsubscribe();
      }
    });

    localStorage.removeItem("PageId");
    localStorage.removeItem("RecordId");
    this.managerService.destroy();
  }

  //#endregion

  //#region Authentications

  //#endregion

  //#region Permissions
  // rolePermission!: RolesPermissionsVm;
  // userPermissions!: UserPermission;
  // getPagePermissions(pageId) {
  //   const promise = new Promise<void>((resolve, reject) => {
  //     this.rolesPerimssionsService.getAll("GetPagePermissionById?pageId=" + pageId).subscribe({
  //       next: (res: any) => {
  //         this.rolePermission = JSON.parse(JSON.stringify(res.data));
  //         this.userPermissions = JSON.parse(this.rolePermission.permissionJson);
  //         this.sharedServices.setUserPermissions(this.userPermissions);
  //         resolve();

  //       },
  //       error: (err: any) => {
  //         reject(err);
  //       },
  //       complete: () => {

  //       },
  //     });
  //   });
  //   return promise;

  // }
  //#endregion

  //#region  State Management
  //#endregion

  //#region Basic Data
  ///Geting form dropdown list data

  // loadData() {
  //   this.getFloors();

  // }
  createFloorForm() {
    this.floorFrom = this.fb.group({
      id: '',
      floorNameAr: '',
      floorNameEn: ['', Validators.compose([Validators.required, Validators.minLength(2)]),],


    });
  }



  setFormValue() {
    this.floorFrom.setValue({
      id: this.floor?.id,
      floorNameAr: this.floor?.floorNameAr,
      floorNameEn: this.floor?.floorNameEn,

    });
  }

  // getFloors() {

  //   const promise = new Promise<void>((resolve, reject) => {
  //     this.floorService.getAll<ResponseResult<Floor[]>>("GetAll").subscribe({
  //       next: (res: any) => {
  //         this.floors = JSON.parse(JSON.stringify(res.data))
  //         resolve();
  //         //(('res', res);
  //         //((' getFloors', this.floors);
  //       },
  //       error: (err: any) => {
  //         reject(err);
  //       },
  //       complete: () => {

  //       },
  //     });
  //   });
  //   return promise;
  // }
  //isUpdateClicked: boolean = false;
  getFloorById(id: any) {
    // this.isUpdateClicked = true;
    // this.activeTab = 1;
    // this.sharedServices.changeButton({ action: "Update" } as ToolbarData);
    return new Promise<void>((resolve, reject) => {
      let sub = this.floorService.getWithResponse<Floor>("GetById?Id=" + id).subscribe({
        next: (res: ResponseResult<Floor>) => {
          //((' getFloorById  res', res);
          resolve();
          if (res.data) {
            this.floor = JSON.parse(JSON.stringify(res.data));
            this.setFormValue();
          }


        },
        error: (err: any) => {
          //reject(err);
          resolve();
        },
        complete: () => {

        },
      });
      this.subsList.push(sub);
    });

  }



  //#endregion


  //#region CRUD Operations
  onSave() {

    if (this.floorFrom.valid) {
      //this.sharedServices.changeButtonStatus({ button: 'Save', disabled: true })

      this.floorFrom.value.id = 0;
      this.spinner.show();
      this.confirmSave().then(a=>{
        this.spinner.hide();
      }).catch(e=>{
        this.spinner.hide();
      })
    } else {
      this.sharedServices.changeButtonStatus({ button: 'Save', disabled: false })
      this.errorMessage = this.translate.transform("validation-messages.invalid-data");
      this.errorClass = 'errorMessage';
      this.alertsService.showError(this.errorMessage, this.translate.transform("message-title.wrong"));
      return this.floorFrom.markAllAsTouched();
    }
  }

  confirmSave(){
    return new Promise<void>((resolve, reject) => {
      this.floorService.addWithResponse<Floor>("AddWithCheck?uniques=FloorNameAr&uniques=FloorNameEn", this.floorFrom.value).subscribe({
        next: (result: ResponseResult<Floor>) => {
          resolve();
            if (result.success && !result.isFound) {
              this.showResponseMessage(
                result.success, AlertTypes.success, this.translate.transform("messages.add-success")
              );
              navigateUrl(this.listUrl, this.router);
            } else if (result.isFound) {
              this.showResponseMessage(
                result.success,
                AlertTypes.warning,
                this.translate.transform("messages.record-exsiting")
              );
            }
            else {
              this.showResponseMessage(
                result.success,
                AlertTypes.error,
                this.translate.transform("messages.add-failed")
              );
            }
        },
        error: (err: any) => {
          this.spinner.hide();
          reject(err);

        },
        complete: () => {

          this.spinner.hide();
        },
      });
    });
    
  }
  onUpdate() {
    if (this.floorFrom.value != null) {
      this.spinner.show();
      this.confirmUpdate().then(a=>{
        this.spinner.hide();
      }).catch(e=>{
        this.spinner.hide();
      });
    } else {
      this.errorMessage = this.translate.transform("validation-messages.invalid-data");
      this.errorClass = 'errorMessage';
      this.alertsService.showError(this.errorMessage, this.translate.transform("message-title.wrong"));
      return this.floorFrom.markAllAsTouched();
    }
  }
  //#endregion

  confirmUpdate()
  {
    return new Promise<void>((resolve, reject) => {
     let sub=  this.floorService.updateWithUrl("UpdateWithCheck??uniques=FloorNameAr&uniques=FloorNameEn", this.floorFrom.value).subscribe({
        next: (result: any) => {
          resolve();
          if (result.success && !result.isFound) {
            this.showResponseMessage(
              result.success,
              AlertTypes.success,
              this.translate.transform("messages.update-success")
            );
            navigateUrl(this.listUrl, this.router);

          } else if (result.isFound) {

            this.showResponseMessage(
              result.success,
              AlertTypes.warning,
              this.translate.transform("messages.record-exsiting")
            );
          } else {
            this.showResponseMessage(
              result.success,
              AlertTypes.error,
              this.translate.transform("messages.update-failed")
            );

          }
        },
        error: (err: any) => {
          
          reject(err);
        },
        complete: () => {

        },
      });
      this.subsList.push(sub);
    });
    
  }

  //#region Helper Functions
  //form group
  get f(): { [key: string]: AbstractControl } {
    return this.floorFrom.controls;
  }
  ///
  showResponseMessage(responseStatus, alertType, message) {
    if (responseStatus == true && AlertTypes.success == alertType) {
      this.alertsService.showSuccess(message, this.translate.transform("messageTitle.done"));
    } else if (responseStatus == true && AlertTypes.warning) {
      this.alertsService.showWarning(message, this.translate.transform("messageTitle.alert"));
    } else if (responseStatus == true && AlertTypes.info) {
      this.alertsService.showInfo(message, this.translate.transform("messageTitle.info"));
    } else if (responseStatus == false && AlertTypes.error) {
      this.alertsService.showError(message, this.translate.transform("messageTitle.error"));
    }
  }

  // showConfirmDeleteMessage(id: number) {
  //   const modalRef = this.modalService.open(MessageModalComponent);
  //   modalRef.componentInstance.message = this.translate.transform("messages.confirm-delete");
  //   modalRef.componentInstance.title = this.translate.transform("messages.delete");
  //   modalRef.componentInstance.isYesNo = true;
  //   modalRef.result.then((rs) => {
  //     //((rs);
  //     if (rs == 'Confirm') {
  //       this.spinner.show();
  //       this.floorService.deleteWithUrl("Delete?id=" + id).subscribe((resonse) => {
  //         //(('delet response', resonse);
  //         this.getFloors();
  //         setTimeout(() => {
  //           if (resonse.success == true) {
  //             this.showResponseMessage(
  //               resonse.success,
  //               AlertTypes.success,
  //               this.translate.transform("messages.delete-success")
  //             );
  //           } else if (resonse.success == false) {
  //             this.showResponseMessage(
  //               resonse.success,
  //               AlertTypes.error,
  //               this.translate.transform("messages.delete-faild")
  //             );
  //           }
  //           this.spinner.hide();

  //         }, 500);

  //       });
  //     }
  //   });
  // }
  //#endregion


  //#region Toolbar
  subsList: Subscription[] = [];
  currentBtnResult;
  listenToClickedButton() {
    let sub = this.sharedServices.getClickedbutton().subscribe({
      next: (currentBtn: ToolbarData) => {
        currentBtn;

        if (currentBtn != null) {
          if (currentBtn.action == ToolbarActions.List) {
            this.sharedServices.changeToolbarPath({
              listPath: this.listUrl,
            } as ToolbarPath);
            this.router.navigate([this.listUrl]);
          } else if (currentBtn.action == ToolbarActions.Save && currentBtn.submitMode) {
            this.onSave();
          } else if (currentBtn.action == ToolbarActions.New) {
            this.toolbarPathData.componentAdd = "component-names.add-floor";
            this.createFloorForm();
            this.sharedServices.changeToolbarPath(this.toolbarPathData);
            this.router.navigate([this.addUrl]);
          } else if (
            currentBtn.action == ToolbarActions.Update && currentBtn.submitMode) {
            this.onUpdate();
          }
        }
      },
    });
    this.subsList.push(sub);
  }
  changePath() {
    this.sharedServices.changeToolbarPath(this.toolbarPathData);
  }
  onSelcetList() {
    this.router.navigate([this.listUrl]);
    this.sharedServices.changeButton({} as ToolbarData);
    this.sharedServices.changeButton({ action: 'List' } as ToolbarData);
  }
  onSelcetAdd() {
    this.router.navigate([this.addUrl]);
    this.sharedServices.changeButton({} as ToolbarData);
    this.sharedServices.changeButton({ action: 'Save', submitMode: false } as ToolbarData);
    this.listenToClickedButton();
  }

  navigateUrl(urlroute: string) {
    this.router.navigate([urlroute]);
  }

  // delete(id: any) {
  //   if (this.managerService.getUserPermissions()?.isDelete) {
  //     this.showConfirmDeleteMessage(id);
  //   }
  //   else {
  //     this.showResponseMessage(true, AlertTypes.warning, this.translate.transform("permissions.permission-denied"))

  //   }

  // }
  //#endregion


  //#endregion

}
