import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertTypes, ToolbarActions } from 'src/app/core/constants/enumrators/enums';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { ResponseResult } from 'src/app/core/models/ResponseResult';
import { UnitsTypesVM } from 'src/app/core/models/ViewModel/units-types-vm';
import { UnitsTypesService } from 'src/app/core/services/backend-services/units-types.service';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Subscription } from 'rxjs'
import { navigateUrl } from 'src/app/core/helpers/helper';
import { TranslatePipe } from '@ngx-translate/core';
import { RolesPermissionsService } from 'src/app/core/services/backend-services/permissions/roles-permissions.service';
import { UserPermission } from 'src/app/core/models/permissions/user-permissions';
import { RolesPermissionsVm } from 'src/app/core/models/ViewModel/permissions/roles-permissions-vm';
import { ManagerService } from 'src/app/core/services/backend-services/manager.service';
import { UnitsTypes } from 'src/app/core/models/units-types';

const PAGEID = 35; // from pages table in database seeding table
@Component({
  selector: 'app-units-types',
  templateUrl: './units-types.component.html',
  styleUrls: ['./units-types.component.scss'],
})
export class UnitsTypesComponent implements OnInit, OnDestroy {





  onSave() {
    if (this.unitTypeForm.valid) {
      this.spinner.show();
      return new Promise<void>((resolve, reject) => {
        let sub = this.unitsTypesService.
        addWithResponse<UnitsTypes>('AddWithCheck?uniques=TypeNameAr&uniques=TypeNameEn', this.unitTypeForm.value).subscribe({
          next: (result: ResponseResult<UnitsTypes>) => {
            resolve();
            this.spinner.hide();
            if (result.success && !result.isFound) {
              this.showResponseMessage(
                result.success,
                AlertTypes.success,
                this.translate.transform("messages.add-success")
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
                this.translate.transform("messages.error")
              );
            }
            

          },
          error: (err: any) => {
            reject(err);
            this.spinner.hide();
          },
          complete: () => {

          },
        });
        this.subsList.push(sub);
      });


    } else {
      this.errorMessage = this.translate.transform("validation-messages.invalid-data");
      this.errorClass = 'errorMessage';
      this.alertsService.showError(this.errorMessage, this.translate.transform("message-title.wrong"));
      return this.unitTypeForm.markAllAsTouched();
    }
  }

  onUpdate() {

    if (this.unitTypeForm.valid) {
      this.spinner.show();
      this.unitTypeForm.value.id = this.id;
      return new Promise<void>((resolve, reject) => {
        let sub = this.unitsTypesService.updateWithUrl("UpdateWithCheck?uniques=TypeNameAr&uniques=TypeNameEn", this.unitTypeForm.value).subscribe({
          next: (result: ResponseResult<UnitsTypes>) => {
            this.spinner.hide();
            resolve();
            if (result.success && !result.isFound) {
              this.showResponseMessage(
                result.success,
                AlertTypes.success,
                this.translate.transform("messages.add-success")
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
                this.translate.transform("messages.error")
              );
            }

          },
          error: (err: any) => {
            reject(err);
            this.spinner.hide();
          },
          complete: () => {

          },
        });

        this.subsList.push(sub);
      });

    }

    else {
      this.errorMessage = "Please enter valid data";
      this.errorClass = 'errorMessage';
      this.alertsService.showError(this.errorMessage, "خطأ")
      return this.unitTypeForm.markAllAsTouched();
    }
  }

  //#region Main Declarations
  unitsTypes: UnitsTypesVM[] = [];
  unitTypeForm!: FormGroup;
  //sub: any;
  add: boolean = false;
  update: boolean = false;
  id: any = 0;
  currnetUrl;
  addUrl: string = '/control-panel/definitions/add-unit-type';
  updateUrl: string = '/control-panel/definitions/update-unit-type/';
  listUrl: string = '/control-panel/definitions/units-types-list';
  toolbarPathData: ToolbarPath = {
    pageId: PAGEID,
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList: "component-names.list-units-types",
    componentAdd: "component-names.add-unit-type",

  };
  errorMessage = '';
  errorClass = '';
  submited: boolean = false;
  //Response!: ResponseResult<UnitsTypesVM>;
  //#endregion
  //#region Constructor
  constructor(
    private router: Router,
    private unitsTypesService: UnitsTypesService,
    private fb: FormBuilder,
    private rolesPerimssionsService: RolesPermissionsService,
    private route: ActivatedRoute,
    private alertsService: NotificationsAlertsService,
    private spinner: NgxSpinnerService,
    private sharedServices: SharedService,
    private translate: TranslatePipe,
    private managerService:ManagerService
  ) {
    this.createUnitType();
  }
  //#endregion
  //#region ngOnInit
  ngOnInit(): void {

    this.spinner.show();
    
    this.managerService.loadPagePermissions(PAGEID).then(a=>{
      
      this.getRouteData();
      this.changePath();
      this.listenToClickedButton();

    }).catch(err=>{
      this.spinner.hide();
    })
    
    // this.currnetUrl = this.router.url;
    // this.listenToClickedButton();
    // this.sharedServices.changeButton({ action: 'Save', submitMode: false } as ToolbarData);
    // this.changePath();
    // this.add = true;
     
  }

  getRouteData()
  {
   let sub =  this.route.params.subscribe((params) => {
      if (params['id'] != null) {
        this.id = +params['id'];
        if (this.id > 0) {
          this.getUnitTypeById(this.id).then(a=>{          
            this.spinner.hide();
            this.sharedServices.changeButton({ action: 'Update', submitMode: false } as ToolbarData);
            localStorage.setItem("RecordId", this.id);
          }).catch(e=>{          
            this.spinner.hide();
          });         
        }
        else{          
          this.spinner.hide();
          this.sharedServices.changeButton({ action: 'New' } as ToolbarData);          
        }
      }else
      {
        this.spinner.hide();
        this.sharedServices.changeButton({ action: 'New' } as ToolbarData);
      }
    });
    this.subsList.push(sub);
  }
  //#endregion
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
  //   return new Promise<void>((resolve, reject) => {
  //     let sub = this.rolesPerimssionsService.getAll("GetPagePermissionById?pageId=" + pageId).subscribe({
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
  //     this.subsList.push(sub);
  //   });


  // }
  //#endregion
  //#region  State Management
  //#endregion
  //#region Basic Data
  ///Geting form dropdown list data
  getUnitTypeById(id: any) {
    return new Promise<void>((resolve, reject) => {
      let sub = this.unitsTypesService.getWithResponse<UnitsTypes>("GetById?Id=" + id).subscribe({
        next: (res: ResponseResult<UnitsTypes>) => {
          resolve();
          if(res.data){
            this.unitTypeForm.setValue({
              id: res.data.id,
              typeNameAr: res.data.typeNameAr,
              typeNameEn: res.data.typeNameEn,
              addArea: res.data.addArea,
              addNoOfRooms: res.data.addNoOfRooms,
              addNoOfBathRooms: res.data.addNoOfBathRooms,
              addBuildingNo: res.data.addBuildingNo,
              addFloorNo: res.data.addFloorNo,
              addHeight: res.data.addHeight,
              addPropertyCount: res.data.addPropertyCount,
              addDimentionNorth: res.data.addDimentionNorth,
              addDimensionEast: res.data.addDimensionEast,
              addDimensionWest: res.data.addDimensionWest,
              addDimensionSouth: res.data.addDimensionSouth,
              addElectricityMeterNumber: res.data.addElectricityMeterNumber,
              addAge: res.data.addAge,
              addCountOfFloors: res.data.addCountOfFloors,
            });
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
  createUnitType() {
    this.unitTypeForm = this.fb.group({
      id: 0,
      typeNameAr: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z\u0600-\u06FF]+(?:\s*[a-zA-Z\u0600-\u06FF]+)*$/),
      ]),
      typeNameEn: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z\u0600-\u06FF]+(?:\s*[a-zA-Z\u0600-\u06FF]+)*$/),
      ]),
      addArea: false,
      addNoOfRooms: false,
      addNoOfBathRooms: false,
      addBuildingNo: false,
      addFloorNo: false,
      addHeight: false,
      addPropertyCount: false,
      addDimentionNorth: false,
      addDimensionEast: false,
      addDimensionWest: false,
      addDimensionSouth: false,
      addElectricityMeterNumber: false,
      addAge: false,
      addCountOfFloors: false,

    });
  }
  //#endregion
  //#region CRUD Operations
  //#endregion
  //#region Helper Functions

  get f(): { [key: string]: AbstractControl } {
    return this.unitTypeForm.controls;
  }
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
          } else if (currentBtn.action == ToolbarActions.Save && currentBtn.submitMode) {
            this.onSave();
          } else if (currentBtn.action == ToolbarActions.New) {
            this.toolbarPathData.componentAdd = "component-names.add-unit-type";
            this.sharedServices.changeToolbarPath(this.toolbarPathData);
            //this.unitTypeForm.reset();
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
