import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AlertTypes, contractTypesArEnum, contractTypesEnum, convertEnumToArray, SubLeasingArEnum, SubLeasingEnum, TenantRepresentativeArEnum, TenantRepresentativeEnum, ToolbarActions } from 'src/app/core/constants/enumrators/enums';
import { ICustomEnum } from 'src/app/core/interfaces/ICustom-enum';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { ContractsSettings } from 'src/app/core/models/contracts-settings';
import { ResponseResult } from 'src/app/core/models/ResponseResult';
import { ContractsSettingsService } from 'src/app/core/services/backend-services/contracts-settings.service';
import { RentContractsSettingsDetailsService } from 'src/app/core/services/backend-services/rent-contracts-settings-details.service';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Subscription } from 'rxjs'
import { NgxSpinnerService } from 'ngx-spinner';
import { MaintenanceContractsSettingsDetailsService } from 'src/app/core/services/backend-services/maintenance-contracts-Settings-details.service';
import { MaintenanceContractsSettingsDetails } from 'src/app/core/models/maintenance-contract-settings-details';
import { SubUsers } from 'src/app/core/models/permissions/sub-users';

import { SalesBuyContractsSettingsDetailsService } from 'src/app/core/services/backend-services/sales-buy-contracts-Settings-details.service';
import { ManagerService } from 'src/app/core/services/backend-services/manager.service';
import { navigateUrl } from 'src/app/core/helpers/helper';
const PAGEID = 34; // from pages table in database seeding table
@Component({
  selector: 'app-contracts-settings',
  templateUrl: './contracts-settings.component.html',
  styleUrls: ['./contracts-settings.component.scss']
})
export class ContractsSettingsComponent implements OnInit, OnDestroy, AfterViewInit {
  //properties
  contractsSettingsForm!: FormGroup;
  // rentContractsSettingsDetailsForm!: FormGroup;
  // maintenanceContractsSettingsDetailsForm!: FormGroup;
  // sellBuyContractsSettingsDetailsForm!: FormGroup;

  //sub: any;
  url: any;
  public gfg = false;
  public gfg2 = false;

  subLeasing: ICustomEnum[] = [];
  tenantRepresentative: ICustomEnum[] = [];
  //contractTypes: ContractTypes[] = []
  contractTypes: ICustomEnum[] = [];
  id: any = 0;
  errorMessage = '';
  errorClass = ''
  submited: boolean = false;
  //Response!: ResponseResult<ContractsSettings>;
  maintenanceContractsSettingsDetails?: MaintenanceContractsSettingsDetails;
  subUsers: SubUsers[] = [];
  subUsersList: SubUsers[] = [];
  lang: string = '';
  currentUserId = localStorage.getItem("UserId")
  //contractSettingObj!:ContractSettingVm;

  currnetUrl;
  addUrl: string = '/control-panel/settings/add-contract-setting';
  updateUrl: string = '/control-panel/settings/update-contract-setting/';
  listUrl: string = '/control-panel/settings/contracts-settings-list';
  toolbarPathData: ToolbarPath = {
    pageId: PAGEID,
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList: "component-names.list-contracts-settings",
    componentAdd: "component-names.add-contract-setting",
  };
  permissionList: any = {
    isAdd: false,
    isUpdate: false,
    isDelete: false,
    isShow: false
  };
  //
  //constructor
  constructor(private router: Router,
    private translate: TranslatePipe,
    private spinner: NgxSpinnerService,
    private sharedServices: SharedService,
    private contractsSettingsService: ContractsSettingsService,   
    private alertsService: NotificationsAlertsService,    
    private managerService: ManagerService,
    private fb: FormBuilder, private route: ActivatedRoute) {
    this.contractsSettingsForm = this.fb.group({
      id: 0,
      contractArName: ['', Validators.compose([Validators.required])],
      contractEnName: ['', Validators.compose([Validators.required])],
      contractTypeId: ['', Validators.compose([Validators.required])],
      isGenerateEntryByDue: false,
      isTaxIncludedInDivision: false,
      isDivisionByUnit: false,
      isCalacAmountOnDuePeriod: false,
      isCalcServiceDependOnMonthlyRent: false,
      isDivideServiceTax: false,
      isGenerateEntryWithAccrudDefferAcc: false,
      isDivideAnnualSrvsDependOnContractTerms: false,
      isGenerateEntryOnRemain: false,
      
      tenantRepresentativeId: '',
      sublease: 0,
      penaltyClauseEvacuation: 0,
      notes: '',
      showMaintenance: false,
      isGenerateEntryWithCreateContract:false
      // displayArName: ['', Validators.compose([Validators.required])],
      // displayEnName: ['', Validators.compose([Validators.required])],
    })
    // this.rentContractsSettingsDetailsForm = this.fb.group({
    //   id: 0,
    //   isGenerateEntryByDue: false,
    //   isTaxIncludedInDivision: false,
    //   isDivisionByUnit: false,
    //   isCalacAmountOnDuePeriod: false,
    //   isCalcServiceDependOnMonthlyRent: false,
    //   isDivideServiceTax: false,
    //   isGenerateEntryWithAccrudDefferAcc: false,
    //   isDivideAnnualSrvsDependOnContractTerms: false,
    //   isGenerateEntryOnRemain: false,
    //   tenantRepresentativeId: '',
    //   sublease: 0,
    //   penaltyClauseEvacuation: 0,
    //   notes: '',
    //   showMaintenance: false
    // })

    // this.maintenanceContractsSettingsDetailsForm = this.fb.group({
    //   id: 0,
    //   contractSettingId: '',
    //   isGenerateEntryByDue: false,



    // })

    // this.sellBuyContractsSettingsDetailsForm = this.fb.group({
    //   id: 0,
    //   contractSettingId: 0,
    //   isGenerateEntryByDue: false,
    //   isTaxIncludedInDivision: false,
    //   isDivisionByUnit: false,
    //   isGenerateEntryWithCreateContract: false
    // })
    // this.contractsSettingsObj = new ContractSettingVm();
    // this.contractsSettingsObj.contractsSettings = new ContractsSettings();
    //this.userPermission = new SubUsers();
  }
  //
  ngAfterViewInit(): void {

  }
  //#region ngOnDestroy
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
  //oninit
  ngOnInit(): void {
    localStorage.setItem("PageId", PAGEID.toString());
    this.getContractTypes();
    this.getTenantRepresentative();
    this.getSubLeasing();
    this.spinner.show();
    Promise.all([
      this.getLanguage(),
      this.managerService.loadPagePermissions(PAGEID)
    ]).then(a => {
      this.getRouteData();
      this.changePath();
      this.listenToClickedButton();
    });
  }

  getRouteData() {
    let sub = this.route.params.subscribe(params => {
      if (params["id"]) {

        //this.isUpdateMode = true;
        this.id = Number(params["id"])
        this.getContractSettingById(Number(params["id"])).then(a => {
          this.spinner.hide();
          this.sharedServices.changeButton({ action: 'Update' } as ToolbarData);
          localStorage.setItem("RecordId", params["id"]);
        }).catch(e => {
          this.spinner.hide();
        });
        // Promise.all([

        //this.getContractSettingsUserPermissionsById(Number(params["id"])),///// contractTypePermissions
        //this.isContractSettingHaveContracts(this.id)

        // ]).then(a => {
        //   this.spinner.hide();
        //   if (this.isContractSettingHasContractsStatus) {
        //     this.sharedServices.changeButton({ action: 'NoAction', submitMode: false } as ToolbarData);
        //   } else {
        //     this.sharedServices.changeButton({ action: 'Update', submitMode: false } as ToolbarData);
        //   }
        // });
      }
      else {
        // this.getSubUsers(localStorage.getItem("UserId"));///// contractTypePermissions

        this.spinner.hide();
        this.sharedServices.changeButton({ action: 'New' } as ToolbarData);

      }

      // }
    });
    this.subsList.push(sub);
  }

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
  //         // this.seedCurrentUserPermissions(this.currentUserId);
  //         resolve();

  //       },
  //       error: (err: any) => {
  //         this.spinner.hide();
  //         reject(err);
  //       },
  //       complete: () => {

  //       },
  //     });
  //   });
  //   return promise;

  // }
  //#endregion
  //
  //Methods
  get f(): { [key: string]: AbstractControl } {
    return this.contractsSettingsForm.controls;
  }
  getContractTypes() {
    if (this.lang == 'en') {
      this.contractTypes = convertEnumToArray(contractTypesEnum);
    }
    else {
      this.contractTypes = convertEnumToArray(contractTypesArEnum);

    }
  }
  getLanguage() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.sharedServices.getLanguage().subscribe(res => {
        resolve();
        this.lang = res
      }, err => {
        resolve();
      });
      this.subsList.push(sub);
    });

  }
  //contractsSettingsObj: ContractsSettingsVm = new ContractsSettingsVm();
  confirmSave() {

    return new Promise<void>((resolve, reject) => {
      let sub = this.contractsSettingsService.addWithResponse<ContractsSettings>("AddWithCheck?uniques=ContractArName&uniques=ContractEnName",
        this.contractsSettingsForm.value).subscribe({
          next: (result: ResponseResult<ContractsSettings>) => {
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
          error: (err) => {
            resolve();
          },
          complete: () => { }
        });

      this.subsList.push(sub);
    });

    // if (this.contractsSettingsForm.valid) {
    //   //this.contractsSettingsObj.contractSettingsUsersPermissions = [...this.contractSettingsPermissions]
    //   this.contractsSettingsObj.contractsSettings = JSON.parse(JSON.stringify(this.contractsSettingsForm.value));
    //   if (this.contractsSettingsForm.value.contractTypeId == 2 || this.contractsSettingsForm.value.contractTypeId == 3) {
    //     this.spinner.show();
    //     this.contractsSettingsObj.contractsSettings.contractsSettingsDetails = [];
    //     this.contractsSettingsObj.contractsSettings.contractsSettingsDetails.push(JSON.parse(JSON.stringify(this.sellBuyContractsSettingsDetailsForm.value)));

    //   }
    //   else {
    //     let sub = this.contractsSettingsService.addWithUrl("AddContractSettingWithPermissions", this.contractsSettingsObj).subscribe(
    //       result => {
    //         if (result != null) {
    //           console.log("addWithResponse", result)
    //           let contractSettingId = result?.data?.id
    //           if (this.contractsSettingsForm.value.contractTypeId == 1) {
    //             this.rentContractsSettingsDetailsForm.value.contractSettingId = contractSettingId;

    //             this.rentContractsSettingsDetailsService.addRequest(this.rentContractsSettingsDetailsForm.value).subscribe(
    //               result => {

    //               })

    //           }
    //           else if (this.contractsSettingsForm.value.contractTypeId == 4) {

    //             this.maintenanceContractsSettingsDetailsForm.value.contractSettingId = contractSettingId;
    //             this.maintenanceContractsSettingsDetailsService.addWithResponse("Add?checkAll=false", this.maintenanceContractsSettingsDetailsForm.value).subscribe(
    //               result => {

    //               })
    //           }

    //           this.sharedServices.setReloadSidebarStatues(true)
    //           this.showResponseMessage(true, AlertTypes.add)
    //           this.router.navigate(['/control-panel/settings/contracts-settings-list']);






    //         }
    //       },
    //       error => console.error(error));

    //     this.subsList.push(sub);
    //   }


    // }
  }

  confirmUpdate() {

    return new Promise<void>((resolve, reject) => {
      let sub = this.contractsSettingsService.updateWithUrl('UpdateWithCheck', this.contractsSettingsForm.value).subscribe(
        {
          next: (result: ResponseResult<ContractsSettings>) => {
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
            }
          },
          error: error => { console.error(error) },
          complete: () => {

          }
        });
      this.subsList.push(sub);
    });



    // if (this.contractsSettingsForm.valid) {
    //   this.spinner.show();
    //   //console.log("this.contractSettingsPermissions", this.contractSettingsPermissions)
    //   this.contractsSettingsForm.value.id = this.id;
    //   //this.contractsSettingsObj.contractSettingsUsersPermissions = [...this.contractSettingsPermissions]
    //   this.contractsSettingsObj.contractsSettings = JSON.parse(JSON.stringify(this.contractsSettingsForm.value));

    // }

  }

  onSave() {
    this.submited = true;
    if (this.contractsSettingsForm.valid) {
      this.spinner.show();
      this.confirmSave().then(a => {
        this.spinner.hide();
      }).catch(e => {
        this.spinner.hide();
      });

    }
    else {
      this.errorMessage = this.translate.transform("validation-messages.invalid-data");
      this.errorClass = 'errorMessage';
      this.alertsService.showError(this.errorMessage, this.translate.transform("message-title.wrong"));
      this.contractsSettingsForm.markAllAsTouched();
    }
  }
  onUpdate() {
    this.submited = true;
    if (this.contractsSettingsForm.value != null) {
      this.spinner.show();

      this.confirmUpdate().then(a => {
        this.spinner.hide();
      }).catch(e => {
        this.spinner.hide();
      });
    }
    else {
      this.sharedServices.changeButtonStatus({ button: 'Save', disabled: false })
      this.errorMessage = this.translate.transform("validation-messages.invalid-data");
      this.errorClass = 'errorMessage';
      this.alertsService.showError(this.errorMessage, this.translate.transform("message-title.wrong"));
      this.contractsSettingsForm.markAllAsTouched();
    }
  }

  showResponseMessage(responseStatus, alertType, message) {
    let displayedMessage = this.translate.transform(message);
    if (responseStatus == true && AlertTypes.success == alertType) {
      this.alertsService.showSuccess(
        displayedMessage,
        this.translate.transform('messageTitle.done')
      );
    } else if (responseStatus == true && AlertTypes.warning) {
      this.alertsService.showWarning(
        displayedMessage,
        this.translate.transform('messageTitle.alert')
      );
    } else if (responseStatus == true && AlertTypes.info) {
      this.alertsService.showInfo(
        displayedMessage,
        this.translate.transform('messageTitle.info')
      );
    } else if (responseStatus == false && AlertTypes.error) {
      this.alertsService.showError(
        displayedMessage,
        this.translate.transform('messageTitle.error')
      );
    }
  }
  getContractSettingById(id: any) {
    return new Promise<void>((resolve, reject) => {
      let sub = this.contractsSettingsService.getWithResponse<ContractsSettings>("GetById?id=" + id).subscribe({
        next: (res: ResponseResult<ContractsSettings>) => {
          resolve();
          if (res.success && res.data) {

            this.contractsSettingsForm.patchValue({
              id: res.data.id,
              contractArName: res.data.contractArName,
              contractEnName: res.data.contractEnName,
              contractTypeId: res.data.contractTypeId,
              isGenerateEntryByDue: res.data.isGenerateEntryByDue,
              isTaxIncludedInDivision: res.data.isTaxIncludedInDivision,
              isDivisionByUnit: res.data.isDivisionByUnit,
              isCalacAmountOnDuePeriod: res.data.isCalacAmountOnDuePeriod,
              isCalcServiceDependOnMonthlyRent: res.data.isCalcServiceDependOnMonthlyRent,
              isDivideServiceTax: res.data.isDivideServiceTax,
              isGenerateEntryWithAccrudDefferAcc: res.data.isGenerateEntryWithAccrudDefferAcc,
              isDivideAnnualSrvsDependOnContractTerms: res.data.isDivideAnnualSrvsDependOnContractTerms,
              isGenerateEntryOnRemain: res.data.isGenerateEntryOnRemain,
              isGenerateEntryWithCreateContract:res.data.isGenerateEntryWithCreateContract,
              //tenantRepresentativeId: '',
              //sublease: res.data.contractTypeId,
              //penaltyClauseEvacuation: res.data.contractTypeId,
              //notes: res.data.contractTypeId,
              showMaintenance: res.data.showMaintenance

            });
            // if (res.data.contractTypeId == 2 || res.data.contractTypeId == 3) {
            //   if (res.data.contractsSettingsDetails.length > 0) {
            //     this.sellBuyContractsSettingsDetailsForm.patchValue(
            //       JSON.parse(JSON.stringify(res.data.contractsSettingsDetails[0]))
            //     )
            //   }
            // }

            // else if (res.data.contractTypeId == 1) {
            //   this.rentContractsSettingsDetailsService.getByIdWithUrl("GetBySettingId?settingid=" + id).subscribe({
            //     next: (res2: any) => {

            //       this.rentContractsSettingsDetailsForm.patchValue({
            //         id: res2.data.id,
            //         isGenerateEntryByDue: res2.data.isGenerateEntryByDue,
            //         isTaxIncludedInDivision: res2.data.isTaxIncludedInDivision,
            //         isDivisionByUnit: res2.data.isDivisionByUnit,
            //         isCalacAmountOnDuePeriod: res2.data.isCalacAmountOnDuePeriod,
            //         isCalcServiceDependOnMonthlyRent: res2.data.isCalcServiceDependOnMonthlyRent,
            //         isDivideServiceTax: res2.data.isDivideServiceTax,
            //         isGenerateEntryWithAccrudDefferAcc: res2.data.isGenerateEntryWithAccrudDefferAcc,
            //         isDivideAnnualSrvsDependOnContractTerms: res2.data.isDivideAnnualSrvsDependOnContractTerms,
            //         isGenerateEntryOnRemain: res2.data.isGenerateEntryOnRemain,
            //         tenantRepresentativeId: res2.data.tenantRepresentativeId,
            //         sublease: res2.data.sublease == 1 ? 1 : 0,
            //         penaltyClauseEvacuation: res2.data.penaltyClauseEvacuation,
            //         notes: res2.data.notes,
            //         showMaintenance: res2.data.showMaintenance

            //       });





            //     }
            //   });
            // }

            // else if (res.data.contractTypeId == 4) {

            //   new Promise<void>((resolve, reject) => {
            //     let sub = this.maintenanceContractsSettingsDetailsService.getWithResponse<MaintenanceContractsSettingsDetails>("GetByFieldName?fieldName=Contract_Setting_Id&fieldValue=" + id).subscribe({
            //       next: (res: any) => {
            //         this.maintenanceContractsSettingsDetailsForm.setValue({

            //           id: res.data?.id,
            //           contractSettingId: res.data?.contractSettingId,
            //           isGenerateEntryByDue: res.data?.isGenerateEntryByDue
            //         });
            //         // this.maintenanceContractsSettingsDetails = JSON.parse(JSON.stringify(res.data));
            //         // this.setMaintenanceContractsSettingsDetailsFormValue();


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
  // setMaintenanceContractsSettingsDetailsFormValue() {

  //   //(("maintenanceContractsSettingsDetails",this.maintenanceContractsSettingsDetails)
  //   this.maintenanceContractsSettingsDetailsForm.setValue({
  //     id: this.maintenanceContractsSettingsDetails?.id,
  //     isGenerateEntryByDue: this.maintenanceContractsSettingsDetails?.isGenerateEntryByDue



  //   });



  // }
  getSubLeasing() {
    if (this.lang == 'en') {
      this.subLeasing = convertEnumToArray(SubLeasingEnum);
    }
    else {
      this.subLeasing = convertEnumToArray(SubLeasingArEnum);

    }
  }
  getTenantRepresentative() {
    if (this.lang == 'en') {
      this.tenantRepresentative = convertEnumToArray(TenantRepresentativeEnum);
    }
  }

  subsList: Subscription[] = [];
  currentBtnResult;
  // listenToClickedButton() {
  //   let sub = this.sharedServices.getClickedbutton().subscribe({
  //     next: (currentBtn: ToolbarData) => {
  //       if (currentBtn != null) {
  //         if (currentBtn.action == ToolbarActions.List) {
  //           this.sharedServices.changeToolbarPath({ listPath: this.listUrl } as ToolbarPath);
  //           this.router.navigate([this.listUrl]);
  //         } else if (currentBtn.action == ToolbarActions.Save && currentBtn.submitMode) {
  //           this.onSave();
  //         } else if (currentBtn.action == ToolbarActions.New) {
  //           this.toolbarPathData.componentAdd = "component-names.add-contract-setting";
  //           setTimeout(() => {
  //             this.sharedServices.changeToolbarPath(this.toolbarPathData);
  //             this.router.navigate([this.addUrl])
  //           }, 200);
  //         } else if (currentBtn.action == ToolbarActions.Update && currentBtn.submitMode) {
  //           this.onUpdate();
  //         }
  //       }
  //     },
  //   });
  //   this.subsList.push(sub);
  // }


  listenToClickedButton() {
    let sub = this.sharedServices.getClickedbutton().subscribe({
      next: (currentBtn: ToolbarData) => {
        if (currentBtn != null) {
          if (currentBtn.action == ToolbarActions.List) {
            this.sharedServices.changeToolbarPath({
              listPath: this.listUrl,
            } as ToolbarPath);
            navigateUrl(this.listUrl, this.router);
          } else if (currentBtn.action == ToolbarActions.Save && currentBtn.submitMode) {

            this.onSave();
          } else if (currentBtn.action == ToolbarActions.New) {
            this.toolbarPathData.componentAdd = "component-names.add-contract-setting";
            this.sharedServices.changeToolbarPath(this.toolbarPathData);
            //this.ownerForm.reset();
            navigateUrl(this.addUrl, this.router);
          } else if (currentBtn.action == ToolbarActions.Update && currentBtn.submitMode) {
            this.onUpdate();
          }
        }
      },
    });
    this.subsList.push(sub);
  }

  // listenToClickedButton2() {
  //   let sub = this.sharedServices.getClickedbutton().subscribe({
  //     next: (currentBtn: ToolbarData) => {

  //       if (currentBtn != null) {
  //         if (currentBtn.action == ToolbarActions.List) {
  //           this.sharedServices.changeToolbarPath({
  //             listPath: this.listUrl,
  //           } as ToolbarPath);
  //           this.router.navigate([this.listUrl]);
  //         } else if (currentBtn.action == ToolbarActions.Save && currentBtn.submitMode) {
  //           this.onSave();

  //         } else if (currentBtn.action == ToolbarActions.New) {
  //           this.toolbarPathData.componentAdd = "component-names.add-contract-setting";
  //           this.sharedServices.changeToolbarPath(this.toolbarPathData);
  //           this.router.navigate([this.addUrl])
  //         } else if (currentBtn.action == ToolbarActions.Update && currentBtn.submitMode) {
  //           this.onUpdate()
  //         }
  //       }
  //     },
  //   });
  //   this.subsList.push(sub);
  // }
  changePath() {
    this.sharedServices.changeToolbarPath(this.toolbarPathData);
  }
  //
  //contractSettingUsersPermissions

  // contractSettingsUsersPermissions: ContractSettingsUsersPermissions[] = [];
  // contractSettingsPermissions: ContractSettingsUsersPermissions[] = [];
  // contractsPermissions: ContractSettingsUsersPermissions[] = [];
  // getContractSettingsUserPermissionsById(id) {

  //   return new Promise<void>((resolve, reject) => {
  //     let sub = this.contractSettingsUsersPermissionsService.getWithResponse<ContractSettingsUsersPermissions>('GetAllData').subscribe({
  //       next: (res: ResponseResult<ContractSettingsUsersPermissions>) => {
  //         resolve();
  //         if (res.success) {
  //           this.contractSettingsUsersPermissions = JSON.parse(JSON.stringify(res.data));
  //           this.contractsPermissions = this.contractSettingsUsersPermissions.filter(x => x.contractSettingId == id);
  //           if (this.contractsPermissions.length > 0) {
  //             this.contractsPermissions.forEach(element => {
  //               if (element.isUserChecked) {
  //                 this.checkAllPermissions = true;
  //               } else {
  //                 this.checkAllPermissions = false;
  //               }
  //             });
  //           }
  //         }
  //       },
  //       error: (err: any) => {
  //         resolve();
  //       },
  //       complete: () => {
  //       },
  //     })
  //     this.subsList.push(sub);
  //   }).then(a => {
  //     this.getSubUsers(localStorage.getItem("UserId"));
  //     this.spinner.hide();
  //   });
  // }



  // getSubUsers(userId) {
  //   return new Promise<void>((resolve, reject) => {
  //     let sub = this.subUsersSerivice.getWithResponse<>("getManagerSubUsers?userId=" + userId).subscribe({
  //       next: (res: any) => {
  //         resolve();
  //         this.subUsersList = [];
  //         this.subUsers = JSON.parse(JSON.stringify(res.data));
  //         console.log("this res.data", res.data)
  //         this.subUsers.forEach(element => {
  //           let item = this.contractsPermissions.find(x => x.userId == element.userId);
  //           if (item ?? null) {
  //             element.permissionJson = JSON.parse(item?.permissionsJson!);
  //             if (item?.isUserChecked ?? false) {
  //               element.isUserChecked = true;
  //             } else {
  //               element.isUserChecked = false;
  //             }

  //             this.subUsersList.push(element);
  //           } else {
  //             element.permissionJson = { "isAdd": false, "isUpdate": false, "isDelete": false, "isShow": false };
  //             this.subUsersList.push(element);
  //           }

  //         });
  //         if (this.id > 0) {
  //           this.setSubUserDataOnUpdate();
  //         }




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
  // checkedUserValue:boolean=false;


  //permissionJson = { "isAdd": false, "isUpdate": false, "isDelete": false, "isShow": false };
  //contractSettingsUsersPermission: ContractSettingsUsersPermissions = new ContractSettingsUsersPermissions();
  isUpdateMode: boolean = false;
  // onCheckUserChange(e: any, userId) {
  //   ;
  //   this.contractSettingsUsersPermission = new ContractSettingsUsersPermissions();
  //   let item = this.subUsers.find(x => x.userId == userId) as SubUsers;
  //   let index = this.subUsers.indexOf(item);
  //   item.isUserChecked = e.target.checked;
  //   Object.entries(item.permissionJson).forEach(
  //     ([permissionKey, permissionValue], index) => {
  //       item.permissionJson[permissionKey] = e.target.checked;
  //       this.contractSettingsUsersPermission.permissionsJson = JSON.stringify(item.permissionJson)
  //     }

  //   );
  //   if (this.isUpdateMode) {
  //     let entryTypePermissionItem = this.contractSettingsPermissions.find(
  //       (x) => x.userId == userId
  //     );
  //     if (entryTypePermissionItem ?? null) {
  //       this.contractSettingsUsersPermission.permissionsJson =
  //         JSON.stringify(item.permissionJson);
  //       this.contractSettingsUsersPermission.userId = userId;
  //       this.contractSettingsUsersPermission.isUserChecked = e.target.checked;
  //       let index = this.contractSettingsPermissions.findIndex(
  //         (x) => x.userId == entryTypePermissionItem?.userId
  //       );
  //       this.contractSettingsPermissions.splice(index, 1);
  //       this.contractSettingsPermissions.push(this.contractSettingsUsersPermission);
  //     } else {
  //       this.contractSettingsUsersPermission.permissionsJson =
  //         JSON.stringify(item.permissionJson);
  //       this.contractSettingsUsersPermission.userId = userId;
  //       this.contractSettingsUsersPermission.isUserChecked = e.target.checked;
  //       this.contractSettingsPermissions.push(this.contractSettingsUsersPermission);
  //     }

  //   } else {
  //     this.contractSettingsUsersPermission.userId = userId;
  //     this.contractSettingsUsersPermission.isUserChecked = e.target.checked;
  //     this.contractSettingsPermissions.push(this.contractSettingsUsersPermission);
  //   }

  //   this.subUsers[index] = item;



  // }
  checkAllPermissions: boolean = false;
  userData: boolean = false;
  onSelectAllChecked(event) {
    //this.contractSettingsPermissions = [];
    this.subUsers.forEach(element => {
      element.isUserChecked = event.target.checked;
    });
    // this.subUsersList.forEach(element => {
    //   this.contractSettingsUsersPermission = new ContractSettingsUsersPermissions();
    //   Object.entries(element.permissionJson).forEach(
    //     ([permissionKey, permissionValue], index) => {
    //       element.permissionJson[permissionKey] = event.target.checked;
    //       this.contractSettingsUsersPermission.permissionsJson = JSON.stringify(element.permissionJson)

    //     }
    //   )
    //   this.contractSettingsUsersPermission.userId = element.userId;
    //   this.contractSettingsUsersPermission.isUserChecked = event.target.checked;
    //   this.contractSettingsPermissions.push(this.contractSettingsUsersPermission);


    // });

  }
  // onCheckboxChange(e: any, permissionJson, key, userId) {
  //   ;
  //   console.log("onCheckboxChange check box main user", this.userData)
  //   if (this.subUsers.length > 0) {
  //     let item = this.subUsers.find((x) => x.userId == userId) as SubUsers;
  //     let index = this.subUsers.indexOf(item);
  //     item.isUserChecked = e.target.checked;
  //     permissionJson[key] = e.target.checked;

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
  //       this.subUsers[index] = item;

  //     }
  //   }
  //   this.contractSettingsUsersPermission = new ContractSettingsUsersPermissions();
  //   this.contractSettingsUsersPermission.id = 0;
  //   this.contractSettingsUsersPermission.contractSettingId = 0;
  //   permissionJson[key] = e.target.checked;
  //   this.permissionJson[key] = e.target.checked;
  //   let contractSettingsPermissionsItem = this.contractSettingsPermissions.find(x => x.userId == userId);
  //   if (contractSettingsPermissionsItem ?? null) {
  //     this.contractSettingsUsersPermission.permissionsJson = JSON.stringify(permissionJson);
  //     this.contractSettingsUsersPermission.userId = userId;
  //     this.contractSettingsUsersPermission.isUserChecked = e.target.checked;
  //     let index = this.contractSettingsPermissions.findIndex(x => x.userId == contractSettingsPermissionsItem?.userId)
  //     this.contractSettingsPermissions.splice(index, 1);
  //     this.contractSettingsPermissions.push(this.contractSettingsUsersPermission);
  //   } else {
  //     this.contractSettingsUsersPermission.permissionsJson = JSON.stringify(permissionJson);
  //     this.contractSettingsUsersPermission.userId = userId;
  //     this.contractSettingsUsersPermission.isUserChecked = e.target.checked;
  //     this.contractSettingsPermissions.push(this.contractSettingsUsersPermission);
  //   }

  // }
  // setSubUserDataOnUpdate() {
  //   this.subUsersList.forEach(element => {
  //     this.contractSettingsPermissions.push({ id: 0, contractSettingId: 0, userId: element.userId, isUserChecked: element.isUserChecked, permissionsJson: JSON.stringify(element.permissionJson) } as ContractSettingsUsersPermissions)
  //   });
  // }

  // disablecurrentUser: boolean = false;
  // userPermission: SubUsers = new SubUsers();
  // seedCurrentUserPermissions(userId) {
  //    ;
  //   this.disablecurrentUser = true;
  //   this.contractSettingsUsersPermission = new ContractSettingsUsersPermissions();
  //   this.userPermission = this.subUsers.find(x => x.userId == userId) as SubUsers;
  //   let index = this.subUsers.indexOf(this.userPermission);
  //   this.userPermission.isUserChecked = true;
  //   Object.entries(this.userPermission.permissionJson).forEach(
  //     ([permissionKey, permissionValue], index) => {
  //       this.userPermission.permissionJson[permissionKey] = true;
  //       this.contractSettingsUsersPermission.permissionsJson = JSON.stringify(this.userPermission.permissionJson)
  //     }

  //   );
  //   this.contractSettingsUsersPermission.userId = userId;
  //   this.contractSettingsUsersPermission.isUserChecked = true;
  //   this.contractSettingsPermissions.push(this.contractSettingsUsersPermission);
  //   this.subUsers[index] = this.userPermission;


  // }
  //rentContractList: RentContract[] = [];
  // isContractSettingHasContractsStatus: boolean = false;
  // isContractSettingHaveContracts(contractSettingId) {
  //   return new Promise<void>((resolve, reject) => {
  //     let sub = this.rentContractsService.getWithResponse("GetAll").subscribe({
  //       next: (res: any) => {
  //         this.rentContractList = res.data.filter(x => x.rentContractSettingId == contractSettingId).map((res: RentContract[]) => {
  //           return res
  //         });
  //         ;
  //         if (this.rentContractList.length > 0) {
  //           this.isContractSettingHasContractsStatus = true;
  //         } else {
  //           this.isContractSettingHasContractsStatus = false;
  //         }

  //         resolve();
  //       },
  //       error: (err: any) => {
  //         this.spinner.hide();
  //         reject(err);
  //       },
  //       complete: () => {
  //       },
  //     });
  //     this.subsList.push(sub);
  //   });
  // }


  showGenerateEntryByDue(typeId:any){
    return true;
  }

}



