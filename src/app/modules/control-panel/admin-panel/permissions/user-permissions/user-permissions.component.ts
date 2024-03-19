import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { SharedService } from 'src/app/shared/services/shared.service';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { PagePermissionsService } from 'src/app/core/services/backend-services/permissions/page-permissions.service';
import { Subscription } from 'rxjs';
import { ResponseResult } from 'src/app/core/models/ResponseResult';
import { PagePermission } from 'src/app/core/models/pages-permissions/page-permissions';
import { RolesPermissions } from '../../../../../core/models/permissions/roles-permissions';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import {
  AlertTypes,
  EntryTypes,
  ToolbarActions,
} from 'src/app/core/constants/enumrators/enums';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { navigateUrl } from 'src/app/core/helpers/helper';
import { NAME_REQUIRED_VALIDATORS } from 'src/app/core/constants/input-validators';
import { RolesService } from 'src/app/core/services/backend-services/permissions/roles.service';
import { Roles } from 'src/app/core/models/permissions/roles';
import { RolesPermissionsVm } from 'src/app/core/models/ViewModel/permissions/roles-permissions-vm';
import { ThemePalette } from '@angular/material/core';
import { ManagerService } from 'src/app/core/services/backend-services/manager.service';
import { ContractsSettings } from 'src/app/core/models/contracts-settings';
import { ContractSettingsRolePermissionsVm } from 'src/app/core/models/contract-settings-role-permissions';
import { EntryTypeRolesPermissions, EntryTypeRolesPermissionsVM } from 'src/app/core/models/entry-type-roles-permissions';
import { EntryType } from 'src/app/core/models/entry-type';

const PAGEID = 3;
export interface Task {
  name: string;
  completed: boolean;
  color: ThemePalette;
  subtasks?: Task[];
}

@Component({
  selector: 'app-user-permissions',
  templateUrl: './user-permissions.component.html',
  styleUrls: ['./user-permissions.component.scss'],
})
export class UserPermissionsComponent implements OnInit, AfterViewInit, OnDestroy {
  task: Task = {
    name: 'Indeterminate',
    completed: false,
    color: 'warn',

  };
  //#region Main Declarations
  activeTab;
  roleFrom!: FormGroup;
  role: Roles = new Roles();
  pagesPermissionsList: RolesPermissionsVm[] = [];
  //roleViewModel: Roles = new Roles();
  //pagesPermissions: PagePermission[] = [];
  subsList: Subscription[] = [];
  rolesPermissions: RolesPermissions[] = [];
  contractSettings: ContractsSettings[] = [];
  entryTypes:EntryType[]=[];
  contractSettingsPermissions: ContractSettingsRolePermissionsVm[] = []
  entryTypesPermissions: EntryTypeRolesPermissionsVM[] = []
  lang: string = '';
  addUrl: string = '/control-panel/admin-panel/add-role-permissions';
  updateUrl: string = '/control-panel/admin-panel/update-role-permissions/';
  listUrl: string = '/control-panel/admin-panel/roles-permissions';
  toolbarPathData: ToolbarPath = {
    pageId: PAGEID,
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList: 'component-names.list-roles-permissions',
    componentAdd: 'component-names.add-role-permissions',
  };
  //#endregion

  //#region Constructor
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private alertsService: NotificationsAlertsService,
    private spinner: NgxSpinnerService,
    private translate: TranslatePipe,
    private sharedServices: SharedService,
    private pagePermissionsServices: PagePermissionsService,
    private roleServices: RolesService,
    private managerService: ManagerService

  ) {
    this.lang = localStorage.getItem('language')!;
    this.createRoleForm();
  }
  //#endregion
  //sub;
  id = 0;
  //#region ngOnInit
  ngOnInit(): void {
    this.spinner.show();
    Promise.all([
      this.managerService.loadPagePermissions(PAGEID),
      this.loadPagesPermissions(),
      this.managerService.loadEntryTypes(),
      this.managerService.loadContractSettings(),
    ]).then(a => {
       
      this.preparePermissions();
      this.getRolePermissions();
      this.getRouteData();
      this.changePath();
      this.listenToClickedButton();
    })
      .catch(e => {
         
        this.spinner.hide();
      });
    // this.getPagePermissionById(PAGEID);

  }

  preparePermissions() {
    this.contractSettings = this.managerService.getContractSettings();
    this.contractSettings.forEach(c => {
      this.contractSettingsPermissions.push({
        contractSettingId: c.id,
        isUserChecked: true,
        id: c.id,
        permissionsJson: JSON.parse(`{"isAdd":false, "isUpdate":false,"isDelete":false,"isIssue":false,"isSettelment":false, "isRenew":false,"isShow":false,"isDisplay":false,"isPrint":false}`),
        roleId: 0,
        contractArName: c.contractArName,
        contractEnName: c.contractEnName


      });
    });

 

    this.entryTypes = this.managerService.getEntryTypes();
    this.entryTypes.forEach(c => {
      this.entryTypesPermissions.push({
        entryTypeId: c.id,
        isUserChecked: true,
        id: c.id,
        permissionsJson: JSON.parse(`{"isAdd":false,"isUpdate":false,"isDelete":false,"isShow":false}`),
        roleId: 0,
        entryNameAr: c.entryNameAr,
        entryNameEn: c.entryNameEn,
      });
    });




  }


  prepareRolePermissions() {
    if (this.role) {
      this.role.rolesPermissions.forEach(p => {
        let perm = this.pages.find(x => x.id == p.pageId);
        if (perm) {
          if (p.permissionJson) {
            perm.pagePermissionJson = JSON.parse(p.permissionJson);
          }
        }
      });
    }
  }

  getRouteData() {
    let sub = this.route.params.subscribe((params) => {
      if (params['id'] != null) {
        this.id = +params['id'];
        if (this.id > 0) {
          this.getRoleById(this.id).then(a => {
            //this.getRolePermissions();
            this.prepareRolePermissions();
            this.getRoleContractsPermissions();
            this.getRoleEntryTypePermissions();
            this.spinner.hide();
            this.sharedServices.changeButton({ action: 'Update', submitMode: false, } as ToolbarData);
          });

        }
        else {
          this.spinner.hide();
          this.sharedServices.changeButton({ action: 'New' } as ToolbarData);
        }
      } else {
        this.spinner.hide();
        this.sharedServices.changeButton({ action: 'New' } as ToolbarData);
      }
    });

    this.subsList.push(sub);
  }

  ngAfterViewInit() {

  }
  //#endregion

  //#region ngOnDestory
  ngOnDestroy() {
    this.subsList.forEach((s) => {
      if (s) {
        s.unsubscribe();
      }
    });

    this.managerService.destroy();
  }
  //#endregion
  //#region Authentications

  //#endregion

  //#region Permissions

  // rolePermissions!:RolesPermissionsVm;
  // userPermissions!:UserPermission;
  // getPagePermissionById(pageId)
  // {


  //   return new Promise<void>((resolve, reject) => {
  //       this.rolePermissionsServices.getAll("GetPagePermissionById?pageId="+pageId).subscribe({
  //         next: (res: any) => {
  //           this.rolePermission = JSON.parse(JSON.stringify(res.data));
  //            let userPermissions:UserPermission =JSON.parse(this.rolePermissions?.permissionJson??null);
  //            this.sharedServices.setUserPermissions(userPermissions);
  //           resolve();

  //         },
  //        error: (err: any) => {
  //           this.spinner.hide();
  //           reject(err);
  //         },
  //         complete: () => {

  //         },
  //       });
  //     });
  //     return promise;

  // }
  //#endregion
  //#endregion

  //#region  State Management
  //#endregion

  //#region Basic Data
  ///Geting form dropdown list data

  arr: any[] = [];
  pages: PagePermission[] = [];


  // public objectKeys = Object.keys;
  public data: any = {}; // your data
  setInputValue() {

    this.roleFrom.patchValue({
      roleNameAr: this.role.roleNameAr,
      roleNameEn: this.role.roleNameEn,
      isActive: this.role.isActive,
      remark: this.role.remark,
      checkAllPermissions: this.role.checkAllPermissions
    });
  }
  getRoleById(id) {


    return new Promise<void>((resolve, reject) => {
      let sub = this.roleServices.getWithResponse<Roles>('GetCurrentRole?roleId=' + id ).subscribe({
        next: (res: ResponseResult<Roles>) => {
          //(('res getRolePermissions', res);
          // Get all pages permissions
          this.role = JSON.parse(JSON.stringify(res.data));
          console.log(this.role);
          this.setInputValue();
          //(('Pages', this.pages);
          resolve();
        },
        error: (err: any) => {
          reject(err);
          this.spinner.hide();
        },
        complete: () => {

          this.spinner.hide();
        },
      });
      this.subsList.push(sub);
    });
  }

  getRolePermissions() {
    this.pages.forEach(p => {
      if (p.pagePermissionJson) {
        p.pagePermissionJson = JSON.parse(p.pagePermissionJson);
      }

    });
  }
  // getRolePermissions() {
  //   // this.pages = [];
  //   // if (this.rolePermission) {
  //   //   this.pagesPermissionsList = JSON.parse(JSON.stringify(this.rolePermission.rolesPermissions));
  //   //   //this.pagesPermissionsList = this.pagesPermissionsList.filter((x) => x.roleId == id);
  //   //   this.pagesPermissionsList.forEach((element) => {
  //   //     element.permissionJson = JSON.parse(element.permissionJson);
  //   //     this.pages.push({ "id": element.pageId, "pageNameAr": element.pageNameAr, "pageNameEn": element.pageNameEn, "pagePermissionJson": element.permissionJson, "checkAllPagePermissions": (element.checkAllPagePermissions ?? false) } as PagePermission);
  //   //   });
  //   // }


  //   if (this.role) {
  //     this.pages = [];


  //     if (this.role.rolesPermissions) {
  //       this.role.contractSettingsRolesPermissions.forEach(x => {

  //         let c = this.contractSettingsPermissions.find(a => a.contractSettingId == x.contractSettingId);

  //         if (c) {
  //           c.permissionsJson = JSON.parse(x.permissionsJson);
  //         }
  //       })
  //     }


  //   }
  // }


  getRoleContractsPermissions() {
    //this.pages = [];

    if (this.role) {
      //this.contractSettingsPermissions = JSON.parse(JSON.stringify(this.rolePermission.contractSettingsRolesPermissions));
      console.log("*******************************", this.contractSettingsPermissions, this.role.contractSettingsRolesPermissions);
      if (this.role.contractSettingsRolesPermissions) {
        this.role.contractSettingsRolesPermissions.forEach(x => {

          let c = this.contractSettingsPermissions.find(a => a.contractSettingId == x.contractSettingId);

          if (c) {
            c.permissionsJson = JSON.parse(x.permissionsJson);
          }
        })
      }


    }
  }


  getRoleEntryTypePermissions() {
    //this.pages = [];

    if (this.role) {
      //this.contractSettingsPermissions = JSON.parse(JSON.stringify(this.rolePermission.contractSettingsRolesPermissions));
      console.log("1111111111111111111111111111111111111", this.entryTypesPermissions, this.role.entryTypeRolesPermissions);
      if (this.role.entryTypeRolesPermissions) {
        this.role.entryTypeRolesPermissions.forEach(x => {

          let c = this.entryTypesPermissions.find(a => a.entryTypeId == x.entryTypeId);

          if (c) {
            c.permissionsJson = JSON.parse(x.permissionsJson);
          }
        })
      }


    }
  }

  loadPagesPermissions() {

    //this.pages = [];
    // this.pagesPermissions = [];

    return new Promise<void>((resolve, reject) => {
      let sub = this.pagePermissionsServices.getWithResponse<PagePermission[]>('GetAllData').subscribe({
        next: (res: ResponseResult<PagePermission[]>) => {
          resolve();
          // Get all pages permissions
          if (res.data) {
            // this.pagesPermissions = JSON.parse(JSON.stringify(res.data));
            // this.pagesPermissions.forEach((element) => {
            //   element.pagePermissionJson = JSON.parse(element.pagePermissionJson);
            //   this.pages.push(element);
            // });
            this.pages = res.data;
          }


          //(('Pages', this.pages);

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

  setPagePermissions() {
    this.role.rolesPermissions = [];

    this.pages.forEach((element) => {
      // element.pagePermissionJson = JSON.stringify(element.pagePermissionJson);

      this.role.rolesPermissions.push({
        id: 0,
        pageId: element.id,
        permissionJson: JSON.stringify(element.pagePermissionJson),
        roleId: 0,
      });
    });
  }

  setPagePermissionsForUpdate() {


    this.pages.forEach((element) => {
      // element.pagePermissionJson = JSON.stringify(element.pagePermissionJson);
      let pagePermission = this.role.rolesPermissions.find(x => x.pageId == element.id);
      if (pagePermission) {
        pagePermission.permissionJson = JSON.stringify(element.pagePermissionJson);
      }
      else {
        this.role.rolesPermissions.push({
          id: 0,
          pageId: element.id,
          permissionJson: JSON.stringify(element.pagePermissionJson),
          roleId: this.role.id,
        });
      }


    });
  }

  setPermissionsJson() {
    this.setPagePermissions();
    this.setContractSettigsPermissions();
    this.setEntryTypesPermissions();
  }

  setContractSettigsPermissions(){
    this.role.contractSettingsRolesPermissions = [];
    this.contractSettingsPermissions.forEach(a => {
      this.role.contractSettingsRolesPermissions.push({
        contractSettingId: a.contractSettingId,
        id: 0,
        isUserChecked: a.isUserChecked,
        permissionsJson: JSON.stringify(a.permissionsJson),
        roleId: 0,

      });
    });
  }

  setEntryTypesPermissions(){
    this.role.entryTypeRolesPermissions = [];
    this.entryTypesPermissions.forEach(a => {
      this.role.entryTypeRolesPermissions.push({
        entryTypeId: a.entryTypeId,
        id: 0,
        isUserChecked: a.isUserChecked,
        permissionsJson: JSON.stringify(a.permissionsJson),
        roleId: 0,

      });
    });
  }
  //#endregion

  //#region CRUD Operations
  onSave() {
    if (this.roleFrom.valid) {

      this.roleFrom.value.id = 0;
      this.role.roleNameAr = this.roleFrom.value.roleNameAr;
      this.role.roleNameEn = this.roleFrom.value.roleNameEn;
      this.role.checkAllPermissions = this.roleFrom.value.checkAllPermissions;
      this.role.isActive = this.roleFrom.value.isActive;
      this.role.remark = this.roleFrom.value.remark;

      this.setPermissionsJson();
      this.spinner.show();
      new Promise<void>((resolve, reject) => {
        let sub = this.roleServices.addWithResponse<Roles>('AddWithCheck?uniques=RoleNameAr&uniques=RoleNameEn', this.role).subscribe({
          next: (result: ResponseResult<Roles>) => {
            this.spinner.hide();
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
            this.showResponseMessage(
              false,
              AlertTypes.error,
              this.translate.transform("messages.connection-error")
            );
            this.spinner.hide();
            reject(err);
          },
          complete: () => {

          },
        });
        this.subsList.push(sub);
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
      return this.roleFrom.markAllAsTouched();
    }
  }

  prepareContractSettingsPermissionsForUpdate() {
    if (!this.role.contractSettingsRolesPermissions) {
      this.role.contractSettingsRolesPermissions = [];
    }

    this.contractSettingsPermissions.forEach(c => {
      let p = this.role.contractSettingsRolesPermissions.find(x => x.contractSettingId == c.contractSettingId);
      if (p) {
        p.permissionsJson = JSON.stringify(c.permissionsJson)
      }
      else {
        this.role.contractSettingsRolesPermissions.push({
          contractSettingId: c.contractSettingId,
          id: 0,
          isUserChecked: c.isUserChecked,
          permissionsJson: JSON.stringify(c.permissionsJson),
          roleId: this.role.id
        });
      }
    });

  }


  prepareEntryTypesPermissionsForUpdate() {
    if (!this.role.entryTypeRolesPermissions) {
      this.role.entryTypeRolesPermissions = [];
    }

    this.entryTypesPermissions.forEach(c => {
      let p = this.role.entryTypeRolesPermissions.find(x => x.entryTypeId == c.entryTypeId);
      if (p) {
        p.permissionsJson = JSON.stringify(c.permissionsJson)
      }
      else {
        this.role.entryTypeRolesPermissions.push({
          entryTypeId: c.entryTypeId,
          id: 0,
          isUserChecked: c.isUserChecked,
          permissionsJson: JSON.stringify(c.permissionsJson),
          roleId: this.role.id
        });
      }
    });

  }
  onUpdate() {
    

    if (this.roleFrom.valid) {
      this.role.roleNameAr = this.roleFrom.value.roleNameAr;
      this.role.roleNameEn = this.roleFrom.value.roleNameEn;
      this.role.checkAllPermissions = this.roleFrom.value.checkAllPermissions;
      this.role.isActive = this.roleFrom.value.isActive;
      this.role.remark = this.roleFrom.value.remark;
      this.prepareContractSettingsPermissionsForUpdate();
      this.prepareEntryTypesPermissionsForUpdate();
      this.roleFrom.value.id = this.id;
      this.setPagePermissionsForUpdate();
      this.spinner.show();
      new Promise<void>((resolve, reject) => {
        let sub = this.roleServices.updateWithUrl('UpdateWithCheck?uniques=RoleNameAr&uniques=RoleNameEn', this.role).subscribe({
          next: (result: ResponseResult<Roles>) => {
            this.spinner.hide();
            resolve();
            if (result.success && !result.isFound) {
              this.showResponseMessage(
                result.success, AlertTypes.success, this.translate.transform("messages.update-success")
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
                this.translate.transform("messages.update-failed")
              );
            }

          },
          error: (err: any) => {
            this.showResponseMessage(
              false,
              AlertTypes.error,
              this.translate.transform("messages.connection-error")
            );
            this.spinner.hide();
            reject(err);

          },
          complete: () => {

          },
        });
        this.subsList.push(sub);
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
      return this.roleFrom.markAllAsTouched();
    }
  }


  errorMessage = '';
  errorClass = '';
  // onSave() {

  //   //(("---------------------------roleFrom---------------------------",this.roleFrom);
  //   let sub = this.rolePermissionsServices.addWithResponse("Add?checkAll=false",this.roleFrom).subscribe({
  //     next:(res)=>{
  //       if(res.success){
  //         alert(" Data saved successfully");

  //       }else
  //       {
  //         alert(res.message);
  //       }
  //     },
  //     error:(err)=>{},
  //     complete:()=>{}
  //   });

  //   this.subsList.push(sub);

  // }

  //#endregion

  //#region Helper Functions
  get f(): { [key: string]: AbstractControl } {
    return this.roleFrom.controls;
  }
  //#endregion

  createRoleForm() {
    this.roleFrom = this.fb.group({
      id: '',
      roleNameAr: '',
      roleNameEn: NAME_REQUIRED_VALIDATORS,
      remark: '',
      isActive: '',
      checkAllPermissions: '',
      checkAllPermissionsContracts: '',
      checkAllPermissionsEntryTypes:''
    });
  }

  //#region multi checkbox functions

  permissionObject!: PagePermission;
  onCheckboxChange(e: any, page: PagePermission, key) {

    page.pagePermissionJson[key] = e.target.checked;
    //this.submitForm();
  }

  onCheckboxContractSettingsChange(e: any, contractSettingPer: ContractSettingsRolePermissionsVm, key) {
    
    contractSettingPer.permissionsJson[key] = e.target.checked;
    //this.submitForm();
  }

  onCheckboxEntryTypeChange(e: any, entryTypePermission: EntryTypeRolesPermissionsVM, key) {
    
    entryTypePermission.permissionsJson[key] = e.target.checked;
    //this.submitForm();
  }

  // submitForm() {
  //   //(('pages: ', this.pages);
  // }

  // onCheckboxChange(e: any,page:PagePermission, key) {
  //
  //   page.pagePermissionJson[key] = e.target.checked
  //   //(('this.pages : ', this.pages);

  //   const checkArray: FormArray = this.roleFrom.get('checkArray') as FormArray;
  //   if (e.target.checked) {
  //     checkArray.push(new FormControl(e.target.id));
  //     //(("checkArray",checkArray)
  //     //(("page onCheckboxChange",page)

  //   } else {
  //     let i: number = 0;
  //     checkArray.controls.forEach((item: any) => {
  //       if (item.value == e.target.id) {
  //         checkArray.removeAt(i);
  //         return;
  //       }
  //       i++;
  //     });
  //     //(("else checkArray",checkArray)
  //   }

  // }

  //#endregion
  //#region Toolbar

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
          } else if (
            currentBtn.action == ToolbarActions.Save &&
            currentBtn.submitMode
          ) {
            this.onSave();
          } else if (currentBtn.action == ToolbarActions.New) {

            this.toolbarPathData.componentAdd =
              'component-names.add-role-permissions';
            this.sharedServices.changeToolbarPath(this.toolbarPathData);
            this.router.navigate([this.addUrl]);
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
  checkAll: boolean = false;
  searchText!: string;
  searchTextContract: string = "";
  searchTextEntry:string = "";
  onSelecetAllPermissions(event) {


    const checkAllPerPage = document.getElementsByClassName('choose-all') as HTMLCollectionOf<HTMLInputElement>;

    if (event.target.checked) {
      for (let i = 0; i < checkAllPerPage.length; i++) {
        checkAllPerPage[i].checked = true
      }
    }

    if (!event.target.checked) {
      for (let i = 0; i < checkAllPerPage.length; i++) {
        checkAllPerPage[i].checked = false
      }
    }

    this.pages.forEach(page => {
      if (page.pagePermissionJson) {
        for (let [key, value] of Object.entries(page.pagePermissionJson)) {
          page.pagePermissionJson[key] = event.target.checked;
          page.checkAllPagePermissions = event.target.checked;
        }
      }
    });

  }


  onSelecetAllContactsPermissions(event) {
    const checkAllPerPage = document.getElementsByClassName('choose-all-contract') as HTMLCollectionOf<HTMLInputElement>;
    if (event.target.checked) {
      for (let i = 0; i < checkAllPerPage.length; i++) {
        checkAllPerPage[i].checked = true
      }
    }

    if (!event.target.checked) {
      for (let i = 0; i < checkAllPerPage.length; i++) {
        checkAllPerPage[i].checked = false
      }
    }

    this.contractSettingsPermissions.forEach(c => {
      for (let [key, value] of Object.entries(c.permissionsJson)) {
        c.permissionsJson[key] = event.target.checked;
        c.isUserChecked = event.target.checked;
      }


    });

  }

  onSelecetAllEntryTypesPermissions(event) {
    const checkAllPerPage = document.getElementsByClassName('choose-all-entry-type') as HTMLCollectionOf<HTMLInputElement>;
    if (event.target.checked) {
      for (let i = 0; i < checkAllPerPage.length; i++) {
        checkAllPerPage[i].checked = true
      }
    }

    if (!event.target.checked) {
      for (let i = 0; i < checkAllPerPage.length; i++) {
        checkAllPerPage[i].checked = false
      }
    }

    this.contractSettingsPermissions.forEach(c => {
      for (let [key, value] of Object.entries(c.permissionsJson)) {
        c.permissionsJson[key] = event.target.checked;
        c.isUserChecked = event.target.checked;
      }


    });

  }

  onSelecetAllPermissionsContract(event) {


    const checkAllPerPage = document.getElementsByClassName('choose-all-contract') as HTMLCollectionOf<HTMLInputElement>;

    if (event.target.checked) {
      for (let i = 0; i < checkAllPerPage.length; i++) {
        checkAllPerPage[i].checked = true
      }
    }

    if (!event.target.checked) {
      for (let i = 0; i < checkAllPerPage.length; i++) {
        checkAllPerPage[i].checked = false
      }
    }

    this.pages.forEach(page => {
      for (let [key, value] of Object.entries(page.pagePermissionJson)) {
        page.pagePermissionJson[key] = event.target.checked;
        page.checkAllPagePermissions = event.target.checked;
      }


    });

  }
  checkAllPagePermissions: boolean = false;

  onSelecetPageAllPermissions(event, page: PagePermission) {
    page.checkAllPagePermissions = event.target.checked;
    for (let [key, value] of Object.entries(page.pagePermissionJson)) {

      page.pagePermissionJson[key] = event.target.checked;
    }



  }

  onSelecetPageAllContractPermissions(event, contractPermission: ContractSettingsRolePermissionsVm) {
    
    contractPermission.isUserChecked = event.target.checked;
    for (let [key, value] of Object.entries(contractPermission.permissionsJson)) {
      

      contractPermission.permissionsJson[key] = event.target.checked;
    }



  }


  onSelecetPageAllEntryTypesPermissions(event, entryTypePermission: EntryTypeRolesPermissionsVM) {
     
    entryTypePermission.isUserChecked = event.target.checked;
    for (let [key, value] of Object.entries(entryTypePermission.permissionsJson)) {
      

      entryTypePermission.permissionsJson[key] = event.target.checked;
    }



  }
  setCheckedValuePerPagePermissions(pages: PagePermission[]) {
    if (pages.length ?? false) {
      let ispermissionChecked = false;
      this.pages.forEach(element => {
        Object.entries(element.pagePermissionJson).forEach(
          ([permissionKey, permissionValue], index) => {
            if (permissionValue == false) {
              ispermissionChecked = false;
              return
            }
          }
        );
        if (!ispermissionChecked) {

        } else {

        }

      });


    }
  }


}
