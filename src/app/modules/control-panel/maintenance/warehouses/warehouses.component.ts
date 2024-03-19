import { Component, OnInit,OnDestroy } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertTypes,
  ToolbarActions
} from 'src/app/core/constants/enumrators/enums';

import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { ResponseResult } from 'src/app/core/models/ResponseResult';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Subscription } from 'rxjs';
import { navigateUrl } from 'src/app/core/helpers/helper';
import { MaintenanceWarehousesVM } from 'src/app/core/models/ViewModel/maintenance-warehouses-vm';
import { Owner } from 'src/app/core/models/owners';
import { MaintenanceWarehousesService } from 'src/app/core/services/backend-services/maintenance-warehouses.service';
import { OwnersService } from 'src/app/core/services/backend-services/owners.service';
import { TranslatePipe } from '@ngx-translate/core';
import { RolesPermissionsService } from 'src/app/core/services/backend-services/permissions/roles-permissions.service';
import { RolesPermissionsVm } from 'src/app/core/models/ViewModel/permissions/roles-permissions-vm';
import { UserPermission } from 'src/app/core/models/permissions/user-permissions';
import { NgxSpinnerService } from 'ngx-spinner';
const PAGEID=19; // from pages table in database seeding table
@Component({
  selector: 'app-warehouses',
  templateUrl: './warehouses.component.html',
  styleUrls: ['./warehouses.component.scss']
})
export class WarehousesComponent implements OnInit ,OnDestroy{
  changeWarehousesFlag:number=0;
  //properties
  warehouseForm!: FormGroup;
  warehouseObj!: MaintenanceWarehousesVM;

  id: any = 0;
  sub: any;
  add!: boolean;
  update!: boolean;
  lang
  errorMessage = '';
  errorClass = '';
  submited: boolean = false;
  Response!: ResponseResult<MaintenanceWarehousesVM>;
  warehousesList: MaintenanceWarehousesVM[] = [];
  ownersList: Owner[] = [];


  /////toolbar
  currnetUrl:any;
  addUrl: string = '/control-panel/maintenance/add-maintenance-warehouse';
  updateUrl: string = '/control-panel/maintenance/update-maintenance-warehouse/';
  listUrl: string = '/control-panel/maintenance/maintenance-warehouses-list';
  toolbarPathData: ToolbarPath = {
    pageId:PAGEID,
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList: "menu.warehouses",
    componentAdd:"warehouses.add-warehouse",
  };
  //


  //#region ngOnDestory
 ngOnDestroy() {
  this.subsList.forEach((s) => {
    if (s) {
      s.unsubscribe();
    }
  });
}
//#endregion
  //constructor
  constructor(
    private maintenanceWarehousesService: MaintenanceWarehousesService,
    private ownersService: OwnersService,
    private router: Router,
    private fb: FormBuilder,
    private rolesPerimssionsService:RolesPermissionsService,
    private route: ActivatedRoute,
    private sharedServices: SharedService,
    private alertsService: NotificationsAlertsService,
    private translate: TranslatePipe,
    private spinner:NgxSpinnerService

  ) {
    this.defineMaintenanceWarehousesForm();
  }
  //

  defineMaintenanceWarehousesForm() {
    this.warehouseForm = this.fb.group({
      id: 0,
      warehouseNameAr: ['', Validators.compose([Validators.required])],
      warehouseNameEn: ['', Validators.compose([Validators.required])],
      ownerId: ['', Validators.compose([Validators.required])],
      warehouseGuardNameAr:'',
      warehouseGuardNameEn:''

    });
  }
  //oninit
      ngOnInit(): void {
    localStorage.setItem("PageId",PAGEID.toString());
    localStorage.setItem("PageId",PAGEID.toString());
    this.getLanguage();
    this.add = true;
    this.currnetUrl = this.router.url;
    this.GetOwners();
    this.listenToClickedButton();
    this.changePath();

    this.sub = this.route.params.subscribe((params) => {
      if (params['id'] != null) {
        this.update = true;
        this.add = false;
        this.id = Number(params['id']);
        if (this.id > 0) {
          this.toolbarPathData.componentAdd ="warehouses.update-warehouse";
          this.getMaintenanceWarehouseById(this.id);
          this.sharedServices.changeButton({action:'Update'}as ToolbarData);
        }
      }else{
        this.sharedServices.changeButton({action:'SinglePage'}as ToolbarData);
      }
    });
  }
  getLanguage() {
    this.sharedServices.getLanguage().subscribe(res => {
      this.lang = res
    })
  }
  //
  //methods
//#region Permissions
rolePermission!:RolesPermissionsVm;
userPermissions!:UserPermission;
getPagePermissions(pageId)
{
  const promise = new Promise<void>((resolve, reject) => {
      this.rolesPerimssionsService.getAll("GetPagePermissionById?pageId="+pageId).subscribe({
        next: (res: any) => {
          this.rolePermission = JSON.parse(JSON.stringify(res.data));
           this.userPermissions=JSON.parse(this.rolePermission.permissionJson);
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

  get f(): { [key: string]: AbstractControl } {
    return this.warehouseForm.controls;
  }


  navigateUrl(urlroute: string) {
    this.router.navigate([urlroute]);
  }

  //#region Crud Operations
  onSave() {
    this.submited = true;
    if (this.warehouseForm.valid) {
      this.sharedServices.changeButtonStatus({button:'Save',disabled:true})
      const promise = new Promise<void>((resolve, reject) => {
        this.maintenanceWarehousesService
          .addWithUrl('insert', this.warehouseForm.value)
          .subscribe({
            next: (result: any) => {
              this.spinner.show();
              this.Response = { ...result.data };
              if (result != null) {
                if (result.success && !result.isFound) {
                  this.changeWarehousesFlag++;

                  this.defineMaintenanceWarehousesForm();

                  setTimeout(() => {
                    this.spinner.hide();
                    this.showResponseMessage(
                      result.success,
                      AlertTypes.success,
                      this.translate.transform('messages.add-success')
                    );
                    this.navigateUrl(this.addUrl);
                  }, 500);
                } else if (result.isFound) {
                  this.spinner.hide();
                  this.checkResponseMessages(result.message);
                }
              }
            },
            error: (err: any) => {
              reject(err);
            },
            complete: () => {},
          });
      });
      return promise;
    } else {
      this.sharedServices.changeButtonStatus({button:'Save',disabled:false})
      this.errorMessage = this.translate.transform(
        'validation-messages.invalid-data'
      );
      this.errorClass = 'errorMessage';
      this.alertsService.showError(
        this.errorMessage,
        this.translate.transform('message-title.wrong')
      );
      return this.warehouseForm.markAllAsTouched();
    }
  }
  onUpdate() {
    this.submited = true;
    if (this.warehouseForm.value != null) {
      const promise = new Promise<void>((resolve, reject) => {
        this.maintenanceWarehousesService
          .updateWithUrl('Update', this.warehouseForm.value)
          .subscribe({
            next: (result: any) => {
              this.spinner.show();
              this.Response = { ...result.response };
              if (result != null) {
                if (result.success && !result.isFound) {
                  this.changeWarehousesFlag++;

                  this.defineMaintenanceWarehousesForm();

                  setTimeout(() => {
                    this.spinner.hide();
                    this.showResponseMessage(
                      result.success,
                      AlertTypes.success,
                      this.translate.transform('messages.update-success')
                    );
                    this.navigateUrl(this.addUrl);
                  }, 500);
                } else if (result.isFound) {
                  this.spinner.hide();
                  this.checkResponseMessages(result.message);
                }
              }
            },
            error: (err: any) => {
              reject(err);
            },
            complete: () => {},
          });
      });
      return promise;
    } else {
      this.errorMessage = this.translate.transform(
        'validation-messages.invalid-data'
      );
      this.errorClass = 'errorMessage';
      this.alertsService.showError(
        this.errorMessage,
        this.translate.transform('message-title.wrong')
      );
      return this.warehouseForm.markAllAsTouched();
    }
  }
  //#endregion

  getMaintenanceWarehouseById(id: any) {
    const promise = new Promise<void>((resolve, reject) => {
      this.maintenanceWarehousesService.getById(id).subscribe({
        next: (res: any) => {

          this.warehouseObj = {...res.data}
          this.warehouseForm.setValue({
            id: id,
            warehouseNameAr: res.data.warehouseNameAr,
            warehouseNameEn: res.data.warehouseNameEn,
            ownerId: res.data.ownerId,
            warehouseGuardNameAr: res.data.warehouseGuardNameAr,
            warehouseGuardNameEn: res.data.warehouseGuardNameEn


          });


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
  cancel() {
    this.warehouseForm = this.fb.group({
      id: 0,
      warehouseNameAr: '',
      warehouseNameEn: '',
      ownerId: 0,
      warehouseGuardNameAr: '',
      warehouseGuardNameEn: ''

    });
  }

  showResponseMessage(responseStatus, alertType, message) {
    let translateMessage=  this.translate.transform(message)
      if (responseStatus == true && AlertTypes.success == alertType) {
        this.alertsService.showSuccess(
          translateMessage,
          this.translate.transform('messageTitle.done')
        );
      } else if (responseStatus == true && AlertTypes.warning) {
        this.alertsService.showWarning(
          translateMessage,
          this.translate.transform('messageTitle.alert')
        );
      } else if (responseStatus == true && AlertTypes.info) {
        this.alertsService.showInfo(
          translateMessage,
          this.translate.transform('messageTitle.info')
        );
      } else if (responseStatus == false && AlertTypes.error) {
        this.alertsService.showError(
          translateMessage,
          this.translate.transform('messageTitle.error')
        );
      }
    }

    checkResponseMessages(message: string) {
      let responseStatus = true;
      switch (message) {
        case 'NameAr':
          this.showResponseMessage(
            responseStatus,
            AlertTypes.warning,
            'messages.nameAr-exist'
          );
          break;
        case 'NameEn':
          this.showResponseMessage(
            responseStatus,
            AlertTypes.warning,
            'messages.nameEn-exist'
          );
          break;
        case 'Code':
          this.showResponseMessage(
            responseStatus,
            AlertTypes.warning,
            'messages.office-code-exist'
          );
          break;
      }
    }
  new!: boolean;
  toggleButton() {
    this.add = false;
    this.update = this.new = !this.add;
  }

  //
  GetOwners() {
    const promise = new Promise<void>((resolve, reject) => {
      this.ownersService.getAll("GetAllVM").subscribe({
        next: (res: any) => {
          this.ownersList = res.data.map((res: Owner[]) => {
            return res;
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
  //#region Toolbar Service
  subsList: Subscription[] = [];
  currentBtnResult;
  listenToClickedButton() {
    let sub = this.sharedServices.getClickedbutton().subscribe({
      next: (currentBtn: ToolbarData) => {
        currentBtn;

        if (currentBtn != null) {
          if (currentBtn.action == ToolbarActions.List) {
            this.sharedServices.changeToolbarPath(this.toolbarPathData);
           // this.router.navigate([this.listUrl]);
          } else if (currentBtn.action == ToolbarActions.Save && currentBtn.submitMode) {
            this.onSave();
          } else if (currentBtn.action == ToolbarActions.New) {
            this.toolbarPathData.componentAdd ="warehouses.add-warehouse" ;
            this.sharedServices.changeToolbarPath(this.toolbarPathData);
            this.warehouseForm.reset();
            this.router.navigate([this.addUrl]);
          } else if (currentBtn.action == ToolbarActions.Update && currentBtn.submitMode) {

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
  //#endregion
}


