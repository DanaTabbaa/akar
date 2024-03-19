import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormBuilder, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { ContractsSettings } from 'src/app/core/models/contracts-settings';
import { Store } from '@ngrx/store';
import { EntryTypeService } from 'src/app/core/services/backend-services/entry-type.service';
import { EntryType } from 'src/app/core/models/entry-type';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { AlertTypes, ToolbarActions, contractTypesEnum, AccountStateEnum, AccIntegrationTypeEnum } from 'src/app/core/constants/enumrators/enums';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { TranslatePipe } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Voucher } from 'src/app/core/models/voucher';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { VoucherSelectors } from 'src/app/core/stores/selectors/voucher.selector';
import { VoucherModel } from 'src/app/core/stores/store.model.ts/vouchers.store.model';
import { SubUsers } from 'src/app/core/models/permissions/sub-users';
import { ManagerService } from 'src/app/core/services/backend-services/manager.service';
import { NewCode } from 'src/app/core/view-models/new-code';
import { ResponseResult } from 'src/app/core/models/ResponseResult';
import { navigateUrl } from 'src/app/core/helpers/helper';
import { Accounts } from 'src/app/core/models/accounts';
import { GeneralIntegrationSettings } from 'src/app/core/models/general-integration-settings';
const PAGEID = 17; // from pages table in database seeding table
@Component({
  selector: 'app-entry-types',
  templateUrl: './entry-types.component.html',
  styleUrls: ['./entry-types.component.scss'],
})
export class EntryTypesComponent implements OnInit, OnDestroy, AfterViewInit {
  //properties
  @ViewChild('generateEntry') generateEntry?: ElementRef;
  @ViewChild('relatedToContract') relatedToContract?: ElementRef;
  currnetUrl;
  isGenerateEntry: boolean = false;
  isRelatedToContract: boolean = false;
  submited: boolean = false;
  entryKindId: any;
  subUsers: SubUsers[] = [];
  subUsersList: SubUsers[] = [];
  errorMessage = '';
  errorClass = '';
  id: number = 0;
  voucher: Voucher[] = [];
  contractKindId: any;
  accounts:Accounts[]=[];
  //filterContractSettings: ContractsSettings[] = [];
  generalAccountIntegration!: GeneralIntegrationSettings | null;
  contractKinds: any[] = [
    {
      id: 1,
      nameEn: 'Rent Contract',
      nameAr: ' عقود ايجار',
    },

    {
      id: 2,
      nameEn: 'Sales Contract',
      nameAr: 'عقود مبيعات',
    },
    {
      id: 3,
      nameEn: 'Purchase Contract',
      nameAr: 'عقود مشتريات'
    },
    {
      id: 4,
      nameEn: 'Maintenance Contract',
      nameAr: 'عقود صيانة',
    },

  ];

  addUrl: string = '/control-panel/accounting/add-entry-type';
  updateUrl: string = '/control-panel/accounting/update-entry-type/';
  listUrl: string = '/control-panel/accounting/entry-type-list';

  toolbarPathData: ToolbarPath = {
    pageId: PAGEID,
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList: this.translate.transform('menu.entry-types'),
    componentAdd: this.translate.transform('entry-type.add-entry-type'),
  };

  entryTypesForm!: FormGroup;
  contractSettings: ContractsSettings[] = [];
  selectedContractTypes?: ContractsSettings[];
  subsList: Subscription[] = [];
  entryKinds: any[] = [
    {
      id: 1,
      nameEn: 'Recieve Vouher',
      nameAr: 'سند قبض',
    },
    {
      id: 2,
      nameEn: 'Pay Vouher',
      nameAr: 'سند صرف',
    },
    {
      id: 3,
      nameEn: 'Debit Note',
      nameAr: 'اشعار مدين',
    },
    {
      id: 4,
      nameEn: 'Credit Note',
      nameAr: 'اشعار دائن',
    },
  ];
  // permissionList: any = {
  //   isAdd: false,
  //   isUpdate: false,
  //   isDelete: false,
  //   isShow: false,
  // };

  entryType: EntryType = {
    id: 0,
    contractTypeIds: '',
    kindId: undefined,
    entryNameAr: '',
    entryNameEn: '',
    isGenerateEntry: false,
    isRelatedToContract: false,
    contractKindId: undefined,
    code:''
  };

  public collapse1 = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private store: Store<any>,
    private entryTypeService: EntryTypeService,
    //private rolesPerimssionsService: RolesPermissionsService,
    private sharedService: SharedService,
    private translate: TranslatePipe,
    private spinner: NgxSpinnerService,
    private alertsService: NotificationsAlertsService,
    //private subUsersSerivice: UsersUsersService,
    //private entryTypeUsersPermissionsService: EntryTypeUsersPermissionsService
    private managerService:ManagerService
  ) {
    this.entryTypesForm = this.fb.group({
      id: 0,
      entryNameAr: ['', Validators.compose([Validators.required])],
      entryNameEn: ['', Validators.compose([Validators.required])],
      entryKindId: ['', Validators.compose([Validators.required])],
      contractKindId: [''],
      code:['', Validators.compose([Validators.required])],
      defaultAccId:''

    });
    // this.entryTypeUsersPermission.permissionsJson = new UserPermission();
    // this.entryTypeObj = new EntryTypeVm();
    // this.entryTypeObj.entryType = new EntryType();
  }

  getResortAccounts() {
    this.accounts = this.managerService.getAccounts().filter(x => x.resortAccGuid && !x.ownerId);
   
  }


  getWebAccounts() {
    this.accounts = this.managerService.getAccounts().filter(x => x.extAccId && !x.ownerId);
    
  }


  

  setInputData() {
    this.contractTypeIds = '';
    if (this.selectedContractTypes?.length == undefined || this.selectedContractTypes?.length == 0) {
      this.contractTypeIds = '';
    }
    else {
      this.selectedContractTypes?.forEach((c) => {
        this.contractTypeIds += c.id + ',';
      });

      this.contractTypeIds = this.contractTypeIds.substring(0, this.contractTypeIds.length - 1);
    }
    this.entryType = {
      id: this.entryTypesForm.controls['id'].value,
      contractTypeIds: this.contractTypeIds,
      entryNameAr: this.entryTypesForm.controls['entryNameAr'].value,
      entryNameEn: this.entryTypesForm.controls['entryNameEn'].value,
      isGenerateEntry: true,
      isRelatedToContract: true,
      kindId: this.entryTypesForm.controls['entryKindId'].value,
      contractKindId: this.entryTypesForm.controls['contractKindId'].value,
      code:this.entryTypesForm.controls['code'].value,
      defaultAccId:this.entryTypesForm.controls['defaultAccId'].value,

    };
  }
  getFilterContractSettings(contractKindId:any) {    
    this.selectedContractTypes = [];
    this.contractSettings = [];
    this.contractSettings = this.managerService.getContractSettings().filter(
      (x) => x.contractTypeId == contractKindId
    );
  }  

  ngOnDestroy(): void {
    this.subsList.forEach((s) => {
      if (s) {
        s.unsubscribe();
      }
    });
  }
  //
  isUpdateMode: boolean = false;
  //oninit
  lang;
  ngOnInit(): void {
    this.lang = localStorage.getItem('language')!;
    localStorage.setItem("PageId", PAGEID.toString());
    this.spinner.show();
    Promise.all([
      this.managerService.loadGeneralAccountIntegrationSetting(),
      this.getLanguage(),
      this.managerService.loadPagePermissions(PAGEID),
      this.managerService.loadContractSettings(),
      this.managerService.loadAccounts()
    ]).then(a=>{
       
      console.log("Account General Integraion Settings", a[0]);
      this.generalAccountIntegration = a[0];
      if (this.generalAccountIntegration) //General Account Integration 
      {
        if (this.generalAccountIntegration.accIntegrationType == AccIntegrationTypeEnum.Resort) {
          this.getResortAccounts();
        }
        else if (this.generalAccountIntegration.accIntegrationType == AccIntegrationTypeEnum.Web) {
          this.getWebAccounts();
        }
        else{
          this.accounts = this.managerService.getAccounts().filter(x=>!x.deActivate && x.accState == AccountStateEnum.Sub);
        }
      }
      else{
        this.accounts = this.managerService.getAccounts().filter(x=>!x.deActivate && x.accState == AccountStateEnum.Sub);
      }

      this.contractSettings = this.managerService.getContractSettings();      
    
      this.getRouteData();
      this.changePath();
      this.listenToClickedButton();
    });
  }

  getRouteData(){
    let sub = this.route.params.subscribe((params) => {
      if (params['id'] != null) {
        this.id = params['id'];
        if (this.id > 0) {
          this.getEntryTypeById(this.id).then(a => {
            this.spinner.hide();
            this.sharedService.changeButton({ action: 'Update', submitMode: false } as ToolbarData);
            localStorage.setItem("RecordId", this.id.toString());
          }).catch(err => {
            this.spinner.hide();
          });
        }
        else {
          this.sharedService.changeButton({ action: 'New' } as ToolbarData);
          this.spinner.hide();
        }
      }
      else {
        this.getNewCode().then(newCode=>{
          this.spinner.hide();          
          this.sharedService.changeButton({ action: 'New' } as ToolbarData);
          this.entryTypesForm.controls['code'].setValue(newCode);
        }).catch(e=>{
          this.spinner.hide();
        });
        
        
      }
    });
    this.subsList.push(sub);
  }

  getLanguage()
  {
    return new Promise<void>((resolve, reject)=>{
      let sub = this.sharedService.getLanguage().subscribe({
        next:res => {
          resolve();
          this.lang = res;
        },error:(err)=>{
          resolve();
        },
        complete:()=>{

        }
      });
      this.subsList.push(sub);
    });
    
  }
  contractTypeIds: any = '';
  getEntryTypeById(id: any) {
    return new Promise<void>((resolve, reject) => {
      let sub = this.entryTypeService
        .getWithResponse<EntryType>(
          'GetById?Id=' + id
        )
        .subscribe({
          next: (res) => {
            resolve();
            if (res.success) {
              this.entryType = JSON.parse(JSON.stringify(res.data));
              this.entryTypesForm.setValue({
                id: this.entryType.id,
                entryNameAr: this.entryType.entryNameAr,
                entryNameEn: this.entryType.entryNameEn,
                entryKindId: this.entryType.kindId,
                contractKindId: this.entryType.contractKindId,
                code:this.entryType.code,
                defaultAccId:this.entryType.defaultAccId

              });
              
              //this.contractTypeIds = this.entryType.contractTypeIds;
             
              this.entryKindId = this.entryType.kindId;
              this.isGenerateEntry = this.entryType.isGenerateEntry;
              this.isRelatedToContract = this.entryType.isRelatedToContract;
              this.contractKindId = this.entryType.contractKindId;
              this.getFilterContractSettings(this.entryType.contractKindId);

              if (this.entryType.contractTypeIds) {
               
                this.selectedContractTypes = [];
                this.entryType.contractTypeIds.split(',').forEach(p=>{
                  let contract = this.managerService.getContractSettings().find(x=>x.id == p);
                  if(contract)
                  {
                    this.selectedContractTypes?.push(contract);
                  } 
                  
                });
                 
                // for (var i = 0; i <= spiltedIds.length - 1; i++) {
                //    
                //   this.selectedContractTypes.push(
                //     this.contractSettings.find((x) => x?.id == parseInt(spiltedIds[i]))!
                //   );
                // }

              }
              


            }
          },
         error: (err: any) => {
            this.spinner.hide();
            reject(err);
          },
          complete: () => { },
        });
      this.subsList.push(sub);
    });
  }

  // getContractSettings() {
  //   return new Promise<void>((acc, rej) => {
  //     let sub = this.store
  //       .select(ContractSettingSelectors.selectors.getListSelector)
  //       .subscribe({
  //         next: (data: ContractSettingModel) => {
  //           acc();
  //            
  //           this.contractSettings = JSON.parse(JSON.stringify(data.list));
  //         },
  //         error: (err: any) => {
  //           acc();
  //         },
  //       });
  //     this.subsList.push(sub);
  //   });
  // }

  //

  //Methods
  get f(): { [key: string]: AbstractControl } {
    return this.entryTypesForm.controls;
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
  listenToClickedButton() {
    let sub = this.sharedService.getClickedbutton().subscribe({
      next: (currentBtn: ToolbarData) => {
        if (currentBtn != null) {
          if (currentBtn.action == ToolbarActions.List) {
            this.sharedService.changeToolbarPath({
              listPath: this.listUrl,
            } as ToolbarPath);
            this.router.navigate([this.listUrl]);
          } else if (
            currentBtn.action == ToolbarActions.Save &&
            currentBtn.submitMode
          ) {
            this.onSave();
          } else if (currentBtn.action == ToolbarActions.New) {
            this.toolbarPathData.componentAdd = 'entry-type.add-entry-type';
               this.sharedService.changeToolbarPath(this.toolbarPathData);
              this.router.navigate([this.addUrl]);
            // setTimeout(() => {
           
            // }, 200);
          } else if (
            currentBtn.action == ToolbarActions.Update &&
            currentBtn.submitMode
          ) {
            this.store
              .select(VoucherSelectors.selectors.getListSelector)
              .subscribe({
                next: (res: VoucherModel) => {
                  this.voucher = JSON.parse(JSON.stringify(res.list)).filter(
                    (x) => x.typeId == this.entryTypesForm.value.id
                  );
                  if (this.voucher != null && this.voucher.length > 0) {
                    this.errorMessage = this.translate.transform(
                      'entry-type.vouchers-added-with-entry-type'
                    );
                    this.errorClass =
                      this.translate.transform('general.warning');
                    this.alertsService.showWarning(
                      this.errorMessage,
                      this.translate.transform('general.warning')
                    );
                    return;
                  } else {
                    this.onUpdate();
                  }
                },
                error: (err) => {
                },
              });
          }
        }
      },
    });
    this.subsList.push(sub);
  }
  changePath() {
    this.sharedService.changeToolbarPath(this.toolbarPathData);
  }
  confirmUpdate() {
 
    return new Promise<void>((resolve, reject) => {
      let sub = this.entryTypeService
      .updateWithUrl("UpdateWithCheck?uniques=EntryNameAr&uniques=EntryNameEn&uniques=Code", this.entryType).subscribe({
        next: (result: ResponseResult<EntryType>) => {
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
          this.showResponseMessage(
            false,
            AlertTypes.error,
            this.translate.transform("messages.connection-error")
          );
          //reject(err);
          resolve();
        },
        complete: () => {
        },
      });
      this.subsList.push(sub);
    });
  }

  navigateUrl(urlroute: string) {
    this.router.navigate([urlroute]);
  }

  onUpdate() {
    
    if (this.entryTypesForm.value != null) {
      this.submited = true;
      this.setInputData();
      
      // if (this.contractTypeIds == '' || this.contractTypeIds == null || this.contractTypeIds == undefined) {
      //   this.errorMessage = this.translate.transform('entry-type.contract-types-ids-required');
      //   this.errorClass = this.translate.transform('general.error-message');
      //   this.alertsService.showError(this.errorMessage, this.translate.transform('general.error'))
      //   return
      // }
      this.spinner.show();
      return this.confirmUpdate().then(a=>{
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
      return this.entryTypesForm.markAllAsTouched();
    }
  }
  
  onSave() {    
    if (this.entryTypesForm.valid) {      
      this.setInputData();
      this.spinner.show();
     this.confirmSave().then(a=>{
      this.spinner.hide();
     }).catch(e=>{
      this.spinner.hide();
     });
    } else {
      return this.entryTypesForm.markAllAsTouched();
    }
  }

  confirmSave()
  {
    return new Promise<void>((resolve,reject)=>{
      let sub = this.entryTypeService.addWithResponse<EntryType>
      ('AddWithCheck?uniques=EntryNameAr&uniques=EntryNameEn&uniques=Code',
        this.entryType).subscribe({
          next: (result: ResponseResult<EntryType>) => {
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
          error: (error) => {
            this.showResponseMessage(
              false,
              AlertTypes.error,
              this.translate.transform("messages.connection-error")
            );
            resolve();
            console.error(error)
          }
        });
      this.subsList.push(sub);
    });
  
  }

  ngAfterViewInit(): void {
    //this.listenToClickedButton();
  }

  getNewCode(){
    return new Promise<string>((resolve,reject)=>{
      let sub = this.entryTypeService.getWithResponse<NewCode[]>("GetNewCode").subscribe({
        next:(res)=>{
          
          let newCode:string = "";
          if(res.data && res.data.length){
             newCode = res.data[0].code;
          }
          resolve(newCode);
          
          
        },
        error:(err)=>{
          resolve('');
        },
        complete:()=>{}
      });
      this.subsList.push(sub);
    });
    
  }

  //entryTypeUsersPermissions

  // entryTypesRolesPermissions: EntryTypeRolesPermissions[] = [];
  // //entryPermissions: EntryTypeRolesPermissions[] = [];
  // getEntryTypeUserPermissionsById(id) {
  //   return new Promise<void>((resolve, reject) => {
  //     let sub = this.entryTypeUsersPermissionsService
  //       .getAll('GetAllData')
  //       .subscribe({
  //         next: (res) => {

  //           if (res.success) {
  //             this.entryTypesUsersPermissions = JSON.parse(
  //               JSON.stringify(res.data)
  //             );
  //             this.entryPermissions = this.entryTypesUsersPermissions.filter(
  //               (x) => x.entryTypeId == id
  //             );

  //           }
  //           resolve();
  //         },
  //         error: (err: any) => {
  //           //reject(err);
  //           resolve();
  //         },
  //         complete: () => {
  //           ////(('complete');
  //           resolve();
  //         },
  //       });
  //     this.subsList.push(sub);
  //   }).then((a) => {
  //     this.getSubUsers(localStorage.getItem('UserId'));
  //   });
  // }
  // getSubUsers(userId) {
  //   const promise = new Promise<void>((resolve, reject) => {
  //     this.subUsersSerivice
  //       .getAll('getManagerSubUsers?userId=' + userId)
  //       .subscribe({
  //         next: (res: any) => {
  //           this.subUsersList = [];
  //           this.subUsers = JSON.parse(JSON.stringify(res.data));
  //           this.subUsers.forEach((element) => {
  //             let item = this.entryPermissions.find(
  //               (x) => x.userId == element.userId
  //             );
  //             if (item ?? null) {
  //               element.permissionJson = JSON.parse(item?.permissionsJson!);
  //               if (item?.isUserChecked ?? false) {
  //                 element.isUserChecked = true;
  //               } else {
  //                 element.isUserChecked = false;
  //               }
  //               this.subUsersList.push(element);
  //             } else {
  //               element.permissionJson = {
  //                 isAdd: false,
  //                 isUpdate: false,
  //                 isDelete: false,
  //                 isShow: false,
  //               };
  //               this.subUsersList.push(element);
  //             }
  //           });
  //           if (this.id > 0) {
  //             this.setSubUserDataOnUpdate();
  //           }

  //           resolve();
  //         },
  //        error: (err: any) => {
  //           this.spinner.hide();
  //           reject(err);
  //         },
  //         complete: () => { },
  //       });
  //   });
  //   return promise;
  // }
  // permissionJson = {
  //   isAdd: false,
  //   isUpdate: false,
  //   isDelete: false,
  //   isShow: false,
  // };
  // entryTypeUsersPermission: EntryTypeUsersPermissions =
  //   new EntryTypeUsersPermissions();
  // entryTypePermissions: EntryTypeUsersPermissions[] = [];

  // checkedUserValue:boolean=false;
  // onCheckUserChange(e: any, userId) {
  //   ;
  //   this.entryTypeUsersPermission = new EntryTypeUsersPermissions();
  //   let item = this.subUsers.find(x => x.userId == userId) as SubUsers;
  //   let index = this.subUsers.indexOf(item);
  //   item.isUserChecked = e.target.checked;
  //   Object.entries(item.permissionJson).forEach(
  //     ([permissionKey, permissionValue], index) => {
  //       item.permissionJson[permissionKey] = e.target.checked;
  //       this.entryTypeUsersPermission.permissionsJson = JSON.stringify(item.permissionJson)
  //     }

  //   );
  //   if (this.isUpdateMode) {
  //     let entryTypePermissionItem = this.entryTypePermissions.find(
  //       (x) => x.userId == userId
  //     );
  //     if (entryTypePermissionItem ?? null) {
  //       this.entryTypeUsersPermission.permissionsJson =
  //         JSON.stringify(item.permissionJson);
  //       this.entryTypeUsersPermission.userId = userId;
  //       this.entryTypeUsersPermission.isUserChecked = e.target.checked;
  //       let index = this.entryTypePermissions.findIndex(
  //         (x) => x.userId == entryTypePermissionItem?.userId
  //       );
  //       this.entryTypePermissions.splice(index, 1);
  //       this.entryTypePermissions.push(this.entryTypeUsersPermission);
  //     } else {
  //       this.entryTypeUsersPermission.permissionsJson =
  //         JSON.stringify(item.permissionJson);
  //       this.entryTypeUsersPermission.userId = userId;
  //       this.entryTypeUsersPermission.isUserChecked = e.target.checked;
  //       this.entryTypePermissions.push(this.entryTypeUsersPermission);
  //     }

  //   } else {
  //     this.entryTypeUsersPermission.userId = userId;
  //     this.entryTypeUsersPermission.isUserChecked = e.target.checked;
  //     this.entryTypePermissions.push(this.entryTypeUsersPermission);
  //   }

  //   this.subUsers[index] = item;
  // }

  // onCheckboxChange(e: any, permissionJson, key, userId) {
  //   this.entryTypeUsersPermission = new EntryTypeUsersPermissions();
  //   if (this.subUsers.length > 0) {
  //     let item = this.subUsers.find((x) => x.userId == userId) as SubUsers;
  //     let index = this.subUsers.indexOf(item);
  //     item.isUserChecked = e.target.checked;
  //     permissionJson[key] = e.target.checked;
  //     this.subUsers[index] = item;
  //     if (item ?? null) {
  //       let ispermissionChecked = false;
  //       Object.entries(permissionJson).forEach(
  //         ([permissionKey, permissionValue], index) => {
  //           if (permissionValue) {
  //             ispermissionChecked = true;
  //             return
  //           }
  //         }
  //       );
  //       if (ispermissionChecked) {
  //         item.isUserChecked = true;
  //       } else {
  //         item.isUserChecked = e.target.checked;
  //       }


  //     }
  //   }
  //   this.entryTypeUsersPermission = new EntryTypeUsersPermissions();
  //   this.entryTypeUsersPermission.id = 0;
  //   this.entryTypeUsersPermission.entryTypeId = 0;
  //   permissionJson[key] = e.target.checked;
  //   this.permissionJson[key] = e.target.checked;
  //   let entryTypePermissionItem = this.entryTypePermissions.find(
  //     (x) => x.userId == userId
  //   );
  //   if (entryTypePermissionItem ?? null) {
  //     this.entryTypeUsersPermission.permissionsJson =
  //       JSON.stringify(permissionJson);
  //     this.entryTypeUsersPermission.userId = userId;
  //     this.entryTypeUsersPermission.isUserChecked = e.target.checked;
  //     let index = this.entryTypePermissions.findIndex(
  //       (x) => x.userId == entryTypePermissionItem?.userId
  //     );
  //     this.entryTypePermissions.splice(index, 1);
  //     this.entryTypePermissions.push(this.entryTypeUsersPermission);
  //   } else {
  //     this.entryTypeUsersPermission.permissionsJson =
  //       JSON.stringify(permissionJson);
  //     this.entryTypeUsersPermission.userId = userId;
  //     this.entryTypeUsersPermission.isUserChecked = e.target.checked;
  //     this.entryTypePermissions.push(this.entryTypeUsersPermission);
  //   }
  // }
  // setSubUserDataOnUpdate() {

  //   this.subUsersList.forEach((element) => {
  //     this.entryTypePermissions.push({
  //       entryTypeId: 0,
  //       id: 0,
  //       userId: element.userId,
  //       isUserChecked: element.isUserChecked,
  //       permissionsJson: JSON.stringify(element.permissionJson),
  //     } as EntryTypeUsersPermissions);
  //   });
  // }
}
