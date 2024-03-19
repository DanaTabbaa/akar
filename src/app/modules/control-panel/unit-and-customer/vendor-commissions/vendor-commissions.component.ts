import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  AlertTypes,
  ToolbarActions,
  commissionTypesEnum,
  commissionTypesArEnum,
  convertEnumToArray,
} from 'src/app/core/constants/enumrators/enums';
import { ICustomEnum } from 'src/app/core/interfaces/ICustom-enum';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { Vendors } from 'src/app/core/models/vendors';
import { VendorCommissionsService } from 'src/app/core/services/backend-services/vendor-commissions.service';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Subscription } from 'rxjs';
import { ResponseResult } from 'src/app/core/models/ResponseResult';
import { VendorCommissions } from 'src/app/core/models/vendor-commissions';
import { navigateUrl } from 'src/app/core/helpers/helper';
import { TranslatePipe } from '@ngx-translate/core';
import { RolesPermissionsService } from 'src/app/core/services/backend-services/permissions/roles-permissions.service';
import { RolesPermissionsVm } from 'src/app/core/models/ViewModel/permissions/roles-permissions-vm';
import { UserPermission } from 'src/app/core/models/permissions/user-permissions';
import { ManagerService } from 'src/app/core/services/backend-services/manager.service';
const PAGEID = 16; // from pages table in database seeding table
@Component({
  selector: 'app-vendor-commissions',
  templateUrl: './vendor-commissions.component.html',
  styleUrls: ['./vendor-commissions.component.scss'],
})
export class VendorCommissionsComponent implements OnInit, OnDestroy {
  //#region Main Declarations
  lang: string = '';
  vendorCommissionsForm!: FormGroup;
  submited: boolean = false;
  commissionTypes: ICustomEnum[] = [];
  vendors: Vendors[] = [];
  commissionType!: number;
  id: number = 0;
  sub: any;
  showValue: boolean = false;
  showRatio: boolean = false;
  errorMessage = '';
  errorClass = '';
  currnetUrl;
  addUrl: string = '/control-panel/definitions/add-vendor-commission';
  updateUrl: string = '/control-panel/definitions/update-vendor-commission/';
  listUrl: string = '/control-panel/definitions/vendor-commissions-list';
  toolbarPathData: ToolbarPath = {
    pageId: PAGEID,
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList: 'component-names.list-vendors-commissions',
    componentAdd: 'component-names.add-vendor-commission',
  };
  Response!: ResponseResult<VendorCommissions>;
  //#endregion
  //#region Constructor
  constructor(
    private router: Router,
    private vendorCommissionsService: VendorCommissionsService,
    private alertsService: NotificationsAlertsService,    
    private spinner: NgxSpinnerService,
    private sharedServices: SharedService,
    private translate: TranslatePipe,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private managerService: ManagerService
  ) {
    this.createVendorCommissionForm();
  }
  //#endregion
  //#region ngOnInit
  ngOnInit(): void {
    this.getCommissionTypes();

    Promise.all([
      this.managerService.loadPagePermissions(PAGEID),

    ]);

    this.currnetUrl = this.router.url;
    this.listenToClickedButton();
    this.sharedServices.changeButton({
      action: 'Save',
      submitMode: false,
    } as ToolbarData);
    this.changePath();
    this.getLanguage();


    this.sub = this.route.params.subscribe((params) => {
      if (params['id'] != null) {
        this.id = +params['id'];
        if (this.id > 0) {
          this.getCommissionTypeById(this.id);
          this.sharedServices.changeButton({
            action: 'Update',
            submitMode: false,
          } as ToolbarData);
        }
      }
    });
  }
  //#endregion
  //#region ngOnDestroy
  ngOnDestroy() {
    this.subsList.forEach((s) => {
      if (s) {
        s.unsubscribe();
      }
    });
  }

  //#endregion
  getLanguage() {
    this.sharedServices.getLanguage().subscribe((res) => {
      this.lang = res;
    });
  }
  //#region Authentications
  //#endregion
  //#region Permissions
  // rolePermission!: RolesPermissionsVm;
  // userPermissions!: UserPermission;
  // getPagePermissions(pageId) {
  //   const promise = new Promise<void>((resolve, reject) => {
  //     this.rolesPerimssionsService
  //       .getAll('GetPagePermissionById?pageId=' + pageId)
  //       .subscribe({
  //         next: (res: any) => {
  //           this.rolePermission = JSON.parse(JSON.stringify(res.data));
  //           this.userPermissions = JSON.parse(
  //             this.rolePermission.permissionJson
  //           );
  //           this.sharedServices.setUserPermissions(this.userPermissions);
  //           resolve();
  //         },
  //         error: (err: any) => {
  //           reject(err);
  //         },
  //         complete: () => {},
  //       });
  //   });
  //   return promise;
  // }
  //#endregion
  //#region  State Management
  //#endregion
  //#region Basic Data
  ///Geting form dropdown list data
  getCommissionTypes() {
    if (this.lang == 'en') {
      this.commissionTypes = convertEnumToArray(commissionTypesEnum);
    } else {
      this.commissionTypes = convertEnumToArray(commissionTypesArEnum);
    }
  }
  // getVendors() {
  //   const promise = new Promise<void>((resolve, reject) => {
  //     this.VendorsService.getAll('GetAll').subscribe({
  //       next: (res: any) => {
  //         this.vendors = res.data.map((res: Vendors[]) => {
  //           return res;
  //         });
  //         resolve();
  //       },
  //       error: (err: any) => {
  //         reject(err);
  //       },
  //       complete: () => {},
  //     });
  //   });
  //   return promise;
  // }
  selectCommissionType() {
    if (this.vendorCommissionsForm.value.commissionType == 1) {
      this.showValue = true;
      this.showRatio = false;
      this.vendorCommissionsForm.value.value = '';
    } else if (this.vendorCommissionsForm.value.commissionType == 2) {
      this.showValue = false;
      this.showRatio = true;
      this.vendorCommissionsForm.value.ratio = '';
    }
  }
  createVendorCommissionForm() {
    this.vendorCommissionsForm = this.fb.group({
      nameEn: ['', Validators.compose([Validators.required])],
      nameAr: ['', Validators.compose([Validators.required])],
      commissionType: ['', Validators.compose([Validators.required])],
      value: '',
      ratio: '',
      //vendorId: ['', Validators.compose([Validators.required])],
    });
  }
  //#endregion
  //#region CRUD Operations
  getCommissionTypeById(id: any) {
    return new Promise<void>((resolve, reject) => {
      let sub = this.vendorCommissionsService.getWithResponse<VendorCommissions>("GetById?Id=" + id).subscribe({
        next: (res: any) => {
          this.vendorCommissionsForm.setValue({
            // id: res.data.id,
            nameAr: res.data.nameAr,
            nameEn: res.data.nameEn,
            commissionType: res.data.commissionType,
            value: res.data.value,
            ratio: res.data.ratio,
            // vendorId: res.data.vendorId,
          });
          this.selectCommissionType();
        },
        error: (err: any) => {
          reject(err);
        },
        complete: () => { },
      });
      this.subsList.push(sub);
    });

  }
  //#endregion
  //#region Helper Functions
  get f(): { [key: string]: AbstractControl } {
    return this.vendorCommissionsForm.controls;
  }

  showResponseMessage(responseStatus, alertType, message) {
    if (responseStatus == true && AlertTypes.success == alertType) {
      this.alertsService.showSuccess(
        message,
        this.translate.transform('messageTitle.done')
      );
    } else if (responseStatus == true && AlertTypes.warning) {
      this.alertsService.showWarning(
        message,
        this.translate.transform('messageTitle.alert')
      );
    } else if (responseStatus == true && AlertTypes.info) {
      this.alertsService.showInfo(
        message,
        this.translate.transform('messageTitle.info')
      );
    } else if (responseStatus == false && AlertTypes.error) {
      this.alertsService.showError(
        message,
        this.translate.transform('messageTitle.error')
      );
    }
  }
  //#endregion
  //#region Tabulator
  subsList: Subscription[] = [];
  currentBtnResult;
  listenToClickedButton() {
    let sub = this.sharedServices.getClickedbutton().subscribe({
      next: (currentBtn: ToolbarData) => {
        if (currentBtn != null) {
          if (currentBtn.action == ToolbarActions.List) {
            this.sharedServices.changeToolbarPath({
              listPath: this.listUrl,
            } as ToolbarPath);
            this.router.navigate([this.listUrl]);
          } else if (
            currentBtn.action == ToolbarActions.Save &&
            currentBtn.submitMode
          ) {
            this.onSave();
          } else if (currentBtn.action == ToolbarActions.New) {
            this.toolbarPathData.componentAdd =
              'component-names.add-vendor-commission';
            this.createVendorCommissionForm();
            this.sharedServices.changeToolbarPath(this.toolbarPathData);
            this.navigateUrl(this.addUrl);
          } else if (
            currentBtn.action == ToolbarActions.Update &&
            currentBtn.submitMode
          ) {
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
  navigateUrl(urlroute: string) {
    this.router.navigate([urlroute]);
  }
  onUpdate() {
    if (this.vendorCommissionsForm.value != null) {
      if (this.vendorCommissionsForm.value.commissionType == 1) {
        if (
          this.vendorCommissionsForm.value.value == '' ||
          this.vendorCommissionsForm.value.value == 0
        ) {
          this.errorMessage = this.translate.transform(
            'validation-messages.required-field'
          );
          this.errorClass = 'errorMessage';
          this.alertsService.showError(
            this.errorMessage,
            this.translate.transform('general.error')
          );
          return;
        }
      }
      if (this.vendorCommissionsForm.value.commissionType == 2) {
        if (
          this.vendorCommissionsForm.value.ratio == '' ||
          this.vendorCommissionsForm.value.ratio == 0
        ) {
          this.errorMessage = this.translate.transform(
            'validation-messages.required-field'
          );
          this.errorClass = 'errorMessage';
          this.alertsService.showError(
            this.errorMessage,
            this.translate.transform('general.error')
          );
          return;
        }
      }
      this.vendorCommissionsForm.value.id = this.id;
      this.spinner.hide();
      this.confirmUpdate().then(a=>{
        this.spinner.hide();

      }).catch(e=>{
        this.spinner.hide();
      });
    } else {
      this.errorMessage = this.translate.transform(
        'validation-messages.invalid-data'
      );
      this.errorClass = 'errorMessage';
      this.alertsService.showError(
        this.errorMessage,
        this.translate.transform('message-title.wrong')
      );
      return this.vendorCommissionsForm.markAllAsTouched();
    }
  }

  confirmUpdate() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.vendorCommissionsService.updateWithUrl(
        'UpdateWithCheck?uniques=NameAr&uniques=NameEn',
        this.vendorCommissionsForm.value
      ).subscribe({
        next: (result: ResponseResult<VendorCommissions>) => {
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
              AlertTypes.warning,
              this.translate.transform("messages.add-failed")
            );
          }

        },
        error: (err: any) => {

          reject(err);
        },
        complete: () => { },
      });
      this.subsList.push(sub);
    });

  }
  checkInputData() {
    if (this.vendorCommissionsForm.value.commissionType == 1) {
      if (
        this.vendorCommissionsForm.value.value == '' ||
        this.vendorCommissionsForm.value.value == 0
      ) {
        this.errorMessage = this.translate.transform(
          'validation-messages.invalid-data'
        );
        this.errorClass = 'errorMessage';
        this.alertsService.showError(
          this.errorMessage,
          this.translate.transform('message-title.wrong')
        );
        return;
      }
    }
    if (this.vendorCommissionsForm.value.commissionType == 2) {
      if (
        this.vendorCommissionsForm.value.ratio == '' ||
        this.vendorCommissionsForm.value.ratio == 0
      ) {
        this.errorMessage = this.translate.transform(
          'validation-messages.invalid-data'
        );
        this.errorClass = 'errorMessage';
        this.alertsService.showError(
          this.errorMessage,
          this.translate.transform('message-title.wrong')
        );
        return;
      }
    }
  }

  onSave() {
    this.spinner.show();
    this.sharedServices.changeButtonStatus({ button: 'Save', disabled: true });
    if (this.vendorCommissionsForm.valid) {
      this.checkInputData();
     this.confirmSave();
    } else {
      this.errorMessage = this.translate.transform(
        'validation-messages.invalid-data'
      );
      this.errorClass = 'errorMessage';
      this.alertsService.showError(
        this.errorMessage,
        this.translate.transform('message-title.wrong')
      );
      return this.vendorCommissionsForm.markAllAsTouched();
    }
  }
  //#endregion

  confirmSave(){
    return new Promise<void>((resolve, reject) => {
    let sub =   this.vendorCommissionsService.addWithResponse<VendorCommissions>(
        'AddWithCheck?uniques=NameAr&uniques=NameEn',
        this.vendorCommissionsForm.value
      ).subscribe({
        next: (result: ResponseResult<VendorCommissions>) => {
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
          else{
            this.showResponseMessage(
              result.success,
              AlertTypes.error,
              this.translate.transform("messages.add-failed")
            );
          }
        },
        error: (err: any) => {
          
          reject(err);
        },
        complete: () => { },
      });
    });
    
  }
}
