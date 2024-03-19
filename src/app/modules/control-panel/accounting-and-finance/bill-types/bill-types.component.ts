import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  FormBuilder,
  Validators,
  FormGroup,
  AbstractControl,
} from '@angular/forms';
import { ContractsSettings } from 'src/app/core/models/contracts-settings';
import { Store } from '@ngrx/store';
import { ContractSettingSelectors } from 'src/app/core/stores/selectors/contract-setting.selectors';
import { ContractSettingModel } from 'src/app/core/stores/store.model.ts/contract-setting.store.model';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import {
  AlertTypes,
  contractTypesEnum,
  ToolbarActions,
} from 'src/app/core/constants/enumrators/enums';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { TranslatePipe } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BillType } from 'src/app/core/models/bill-type';
import { BillTypeService } from 'src/app/core/services/backend-services/bill-type.service';
import { BillTypeActions } from 'src/app/core/stores/actions/bill-type.action';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { Bills } from 'src/app/core/models/bills';
import { BillSelectors } from 'src/app/core/stores/selectors/bill.selector';
import { BillModel } from 'src/app/core/stores/store.model.ts/bills.store.model';
import { BillTypeUsersPermissions } from 'src/app/core/models/bill-type-users-permissions';
import { UsersUsersService } from 'src/app/core/services/backend-services/users-users.service';
import { BillTypeUsersPermissionsService } from 'src/app/core/services/backend-services/bill-type-users-permissions.service';
import { RolesPermissionsService } from 'src/app/core/services/backend-services/permissions/roles-permissions.service';
import { RolesPermissionsVm } from 'src/app/core/models/ViewModel/permissions/roles-permissions-vm';
import { UserPermission } from 'src/app/core/models/permissions/user-permissions';
import { BillTypeVm } from 'src/app/core/models/ViewModel/bill-type-vm';
import { SubUsers } from 'src/app/core/models/permissions/sub-users';
import { reloadPage } from 'src/app/core/helpers/router-helper';
const PAGEID = 60; // from pages table in database seeding table

@Component({
  selector: 'app-bill-types',
  templateUrl: './bill-types.component.html',
  styleUrls: ['./bill-types.component.scss'],
})
export class BillTypesComponent implements OnInit, OnDestroy, AfterViewInit {
  //properties
  @ViewChild('generateEntry') generateEntry?: ElementRef;
  @ViewChild('relatedToContract') relatedToContract?: ElementRef;
  currnetUrl;
  public collapse1 = false;
  submited: boolean = false;
  isGenerateEntry: boolean = false;
  isRelatedToContract: boolean = false;
  billTypeKindId: any;
  errorMessage = '';
  errorClass = '';
  id: number = 0;
  bills: Bills[] = [];
  subUsers: SubUsers[] = [];
  billTypeObj!: BillTypeVm;
  billPermissions: BillTypeUsersPermissions[] = [];
  contractTypeIds: any;

  addUrl: string = '/control-panel/accounting/add-bill-type';
  updateUrl: string = '/control-panel/accounting/update-bill-type/';
  listUrl: string = '/control-panel/accounting/bill-type-list';

  toolbarPathData: ToolbarPath = {
    pageId: PAGEID,
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList: this.translate.transform('menu.bill-types'),
    componentAdd: this.translate.transform('bill-type.bill-type'),
  };

  billTypesForm!: FormGroup;
  contractSettings: ContractsSettings[] = [];
  filterContractSettings: ContractsSettings[] = [];
  subUsersList: SubUsers[] = [];
  selectedContractTypes?: ContractsSettings[];
  subsList: Subscription[] = [];
  billTypeUsersPermission: BillTypeUsersPermissions =
    new BillTypeUsersPermissions();
  billTypePermissions: BillTypeUsersPermissions[] = [];
  billTypesUsersPermissions: BillTypeUsersPermissions[] = [];
  lang
  billKinds: any[] = [
    {
      id: 1,
      nameEn: 'Rent Bill',
      nameAr: 'فاتورة إيجارات',
    },
    {
      id: 2,
      nameEn: 'Maintainence Bill',
      nameAr: 'فاتورة صيانة',
    },
    // {
    //   id: 3,
    //   nameEn: 'Service Bill',
    //   nameAr: 'فاتورة خدمات',
    // },
    {
      id: 4,
      nameEn: 'Sales Bill',
      nameAr: 'فاتورة مبيعات',
    },
    {
      id: 5,
      nameEn: 'Purchase Bill',
      nameAr: 'فاتورة مشتريات',
    },
    // {
    //   id: 6,
    //   nameEn: 'Revenue Distribution Bill',
    //   nameAr: 'فاتورة توزيع الايرادات',
    // },
  ];


  billType: BillType = {
    id: 0,
    contractTypeIds: '',
    kindId: undefined,
    typeNameAr: '',
    typeNameEn: '',
    isGenerateEntry: false,
    isRelatedToContract: false,
  };
  permissionList: any = {
    isAdd: false,
    isUpdate: false,
    isDelete: false,
    isShow: false,
  };

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private store: Store<any>,
    private billTypeService: BillTypeService,
    private sharedService: SharedService,
    private translate: TranslatePipe,
    private spinner: NgxSpinnerService,
    private alertsService: NotificationsAlertsService,
    private subUsersSerivice: UsersUsersService,
    private billTypeUsersPermissionsService: BillTypeUsersPermissionsService,
    private rolesPerimssionsService: RolesPermissionsService
  ) {
    this.billTypesForm = this.fb.group({
      id: 0,
      billTypeNameAr: ['', Validators.compose([Validators.required])],
      billTypeNameEn: ['', Validators.compose([Validators.required])],
      billTypeKindId: ['', Validators.compose([Validators.required])],
    });
    this.billTypeObj = new BillTypeVm();
    this.billTypeObj.billType = new BillType();
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
    this.billType = {
      id: this.billTypesForm.controls['id'].value,
      contractTypeIds: this.contractTypeIds,
      typeNameAr: this.billTypesForm.controls['billTypeNameAr'].value,
      typeNameEn: this.billTypesForm.controls['billTypeNameEn'].value,
      isGenerateEntry: this.isGenerateEntry,
      isRelatedToContract: this.isRelatedToContract,
      kindId: this.billTypesForm.controls['billTypeKindId'].value,
    };
  }

  ngOnDestroy(): void {
    this.subsList.forEach((s) => {
      if (s) {
        s.unsubscribe();
      }
    });
  }
  //

  //oninit

  ngOnInit(): void {
    this.sharedService.getLanguage().subscribe((res) => {
      this.lang = res;
    });
    this.getPagePermissions(PAGEID);
    this.sharedService.changeButton({
      action: 'Save',
      submitMode: false,
    } as ToolbarData);
    this.listenToClickedButton();
    this.changePath();
    this.getContractSettings();

    let sub = this.route.params.subscribe((params) => {
      if (params['id']) {
        this.id = Number(params['id']);
        this.isUpdateMode = true;
        this.getBillType(params['id']);
        this.getBillTypeUserPermissionsById(Number(params['id'])); ///// billTypesUsersPermissions
        this.sharedService.changeButton({
          action: 'Update',
          submitMode: false,
        } as ToolbarData);
      } else {
        this.getSubUsers(localStorage.getItem('UserId')); ///// billTypesUsersPermissions
      }
    });
  }
  ngAfterViewInit(): void {
    //  this.listenToClickedButton();
  }
  getBillType(id: any) {
    return new Promise<void>((resolve, reject) => {
      let sub = this.billTypeService
        .getWithResponse<BillType>(
          'GetByFieldName?fieldName=Id&fieldValue=' + id
        )
        .subscribe({
          next: (res) => {
            if (res.success) {
               
              this.billType = JSON.parse(JSON.stringify(res.data));

              console.log('billType', this.billType);
              this.billTypesForm.patchValue({
                id: this.billType.id,
                billTypeNameAr: this.billType.typeNameAr,
                billTypeNameEn: this.billType.typeNameEn,
                billTypeKindId: this.billType.kindId,
              });
              ;
              this.billTypeKindId = this.billType.kindId;
              this.isGenerateEntry = this.billType.isGenerateEntry;
              this.isRelatedToContract = this.billType.isRelatedToContract;
              this.contractTypeIds = this.billType.contractTypeIds;
              if (this.contractTypeIds != '' && this.contractTypeIds != null) {
                var spiltedIds: string[] = [];
                this.selectedContractTypes = [];
                spiltedIds = this.contractTypeIds.split(',');
                 
                for (var i = 0; i <= spiltedIds.length - 1; i++) {
                   
                  this.selectedContractTypes.push(
                    this.contractSettings.find((x) => x?.id == parseInt(spiltedIds[i]))!
                  );
                }
                this.getFilterContractSettings()
              }

              // this.getFilterContractSettings();
              // let contractTypeIds = JSON.parse(
              //   '[' + this.billType.contractTypeIds + ']'
              // );
              // this.selectedContractTypes = contractTypeIds;
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

  getContractSettings() {
    return new Promise<void>((acc, rej) => {
      let sub = this.store
        .select(ContractSettingSelectors.selectors.getListSelector)
        .subscribe({
          next: (data: ContractSettingModel) => {
            acc();
            this.contractSettings = JSON.parse(JSON.stringify(data.list));
          },
          error: (err: any) => {
            acc();
          },
        });
      this.subsList.push(sub);
    });
  }

  getFilterContractSettings() {
    this.filterContractSettings = [];
    if (this.billTypeKindId == 1) {
      //Rent
      this.filterContractSettings = this.contractSettings.filter(
        (x) => x.contractTypeId == contractTypesEnum.Rent
      );
    } else if (this.billTypeKindId == 2) {
      //Maintenance
      this.filterContractSettings = this.contractSettings.filter(
        (x) => x.contractTypeId == contractTypesEnum.Maintenance
      );
    } else if (this.billTypeKindId == 4) {
      //Sales
      this.filterContractSettings = this.contractSettings.filter(
        (x) => x.contractTypeId == contractTypesEnum.Sell
      );
    } else if (this.billTypeKindId == 5) {
      //Purchase
      this.filterContractSettings = this.contractSettings.filter(
        (x) => x.contractTypeId == contractTypesEnum.Purchase
      );
    }
  }

  //Methods
  get f(): { [key: string]: AbstractControl } {
    return this.billTypesForm.controls;
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
            this.toolbarPathData.componentAdd = 'bill-type.add-bill-type';
            setTimeout(() => {
              this.sharedService.changeToolbarPath(this.toolbarPathData);
              this.router.navigate([this.addUrl]);
            }, 200);
          } else if (
            currentBtn.action == ToolbarActions.Update &&
            currentBtn.submitMode
          ) {
            this.store
              .select(BillSelectors.selectors.getListSelector)
              .subscribe({
                next: (res: BillModel) => {
                  //(('data', res);
                  this.bills = JSON.parse(JSON.stringify(res.list)).filter(
                    (x) => x.billTypeId == this.billTypesForm.value.id
                  );
                  if (this.bills != null && this.bills.length > 0) {
                    this.errorMessage = this.translate.transform(
                      'bill-type.bills-added-with-bill-type'
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
                  //((err);
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
  updateData() {

    this.spinner.show();
    this.billTypeObj.billType = { ...this.billType };
    this.billTypeObj.billTypeUsersPermissions = [...this.billTypePermissions];



    return new Promise<void>((resolve, reject) => {
      let sub = this.billTypeService
        .updateWithUrl('UpdateBillTypeWithPermissions', this.billTypeObj)
        .subscribe({
          next: (res) => {
            this.spinner.hide();
            if (res.success) {
              this.store.dispatch(BillTypeActions.actions.update({
                data: JSON.parse(JSON.stringify({ ...res.data }))
              }));
              this.showResponseMessage(true, AlertTypes.update);
              this.navigateUrl(this.listUrl);
              setTimeout(() => {
                reloadPage();
              }, 2000);
            } else {
              this.showResponseMessage(false, AlertTypes.error);
            }
            resolve();
          },
          error: (err: any) => {
            resolve();
          },
          complete: () => {
            resolve();
          },
        });
      this.subsList.push(sub);
    });
  }
  navigateUrl(urlroute: string) {
    this.router.navigate([urlroute]);
  }
  showResponseMessage(responseStatus, alertType) {
    if (responseStatus == true && AlertTypes.add == alertType) {
      this.alertsService.showSuccess(
        this.translate.transform('general.added-successfully'),
        this.translate.transform('messageTitle.done')
      );
    } else if (responseStatus == true && AlertTypes.update == alertType) {
      this.alertsService.showSuccess(
        this.translate.transform('general.updated-successfully'),
        this.translate.transform('messageTitle.done')
      );
    } else if (responseStatus == false && AlertTypes.error) {
      this.alertsService.showError(
        this.translate.transform('messages.error-occurred-fail'),
        this.translate.transform('messageTitle.error')
      );
    }
  }
  onUpdate() {
    this.submited = true;
    if (this.billTypesForm.value != null) {
      this.setInputData();
      if (this.contractTypeIds == '' || this.contractTypeIds == null || this.contractTypeIds == undefined) {
        this.errorMessage = this.translate.transform('entry-type.contract-types-ids-required');
        this.errorClass = this.translate.transform('general.error-message');
        this.alertsService.showError(this.errorMessage, this.translate.transform('general.error'))
        return
      }
      return this.updateData();
    } else {
      this.errorMessage = this.translate.transform(
        'validation-messages.invalid-data'
      );
      this.errorClass = 'errorMessage';
      this.alertsService.showError(
        this.errorMessage,
        this.translate.transform('message-title.wrong')
      );
      return this.billTypesForm.markAllAsTouched();
    }
  }
  onSave() {
    if (this.billTypesForm.valid) {
      this.setInputData();

      this.sharedService.changeButtonStatus({button:'Save',disabled:true});
      if (this.contractTypeIds == '' || this.contractTypeIds == null || this.contractTypeIds == undefined) {
        this.errorMessage = this.translate.transform('entry-type.contract-types-ids-required');
        this.errorClass = this.translate.transform('general.error-message');
        this.alertsService.showError(this.errorMessage, this.translate.transform('general.error'))
        return
      }
      this.spinner.show();
      this.billTypeObj.billType = { ...this.billType };
      this.billTypeObj.billTypeUsersPermissions = [...this.billTypePermissions];
      console.log('billTypePermissions', this.billTypeObj);
      let sub = this.billTypeService
        .addWithUrl('AddBillTypeWithPermissions', this.billTypeObj)
        .subscribe({
          next: (res) => {
            this.spinner.hide();
            if (res.success) {
              this.store.dispatch(
                BillTypeActions.actions.insert({
                  data: JSON.parse(JSON.stringify(res.data)),
                })
              );
              this.showResponseMessage(true, AlertTypes.add);
              this.navigateUrl(this.listUrl);
              setTimeout(() => {
                reloadPage();
              }, 2000);
            } else {
              this.showResponseMessage(false, AlertTypes.error);
            }
          },
          error: (err) => {
            this.spinner.hide();
          },
        });

      this.subsList.push(sub);
    } else {
      return this.billTypesForm.markAllAsTouched();
    }
  }

  //#region Permissions
  rolePermission!: RolesPermissionsVm;
  userPermissions!: UserPermission;
  getPagePermissions(pageId) {
    const promise = new Promise<void>((resolve, reject) => {
      this.rolesPerimssionsService
        .getAll('GetPagePermissionById?pageId=' + pageId)
        .subscribe({
          next: (res: any) => {
            this.rolePermission = JSON.parse(JSON.stringify(res.data));
            this.userPermissions = JSON.parse(
              this.rolePermission.permissionJson
            );
            this.sharedService.setUserPermissions(this.userPermissions);
            resolve();
          },
         error: (err: any) => {
            this.spinner.hide();
            reject(err);
          },
          complete: () => { },
        });
    });
    return promise;
  }
  //billTypeUsersPermissions

  getBillTypeUserPermissionsById(id) {
    return new Promise<void>((resolve, reject) => {
      let sub = this.billTypeUsersPermissionsService
        .getAll('GetAllData')
        .subscribe({
          next: (res) => {
            if (res.success) {
              this.billTypesUsersPermissions = JSON.parse(
                JSON.stringify(res.data)
              );
              this.billPermissions = this.billTypesUsersPermissions.filter(
                (x) => x.billTypeId == id
              );
            } else {
              this.showResponseMessage(false, AlertTypes.error);
            }
            resolve();
          },
          error: (err: any) => {
            //reject(err);
            resolve();
          },
          complete: () => {
            ////(('complete');
            resolve();
          },
        });
      this.subsList.push(sub);
    }).then((a) => {
      this.getSubUsers(localStorage.getItem('UserId'));
    });
  }
  getSubUsers(userId) {
    const promise = new Promise<void>((resolve, reject) => {
      this.subUsersSerivice
        .getAll('getManagerSubUsers?userId=' + userId)
        .subscribe({
          next: (res: any) => {
            this.subUsersList = [];
            this.subUsers = JSON.parse(JSON.stringify(res.data));
            this.subUsers.forEach((element) => {
              let item = this.billPermissions.find(
                (x) => x.userId == element.userId
              );
              if (item ?? null) {
                element.permissionJson = JSON.parse(item?.permissionsJson!);
                if (item?.isUserChecked ?? false) {
                  element.isUserChecked = true;
                } else {
                  element.isUserChecked = false;
                }
                this.subUsersList.push(element);
              } else {
                element.permissionJson = {
                  isAdd: false,
                  isUpdate: false,
                  isDelete: false,
                  isShow: false,
                };
                this.subUsersList.push(element);
              }
            });
            if (this.id > 0) {
              this.setSubUserDataOnUpdate();
            }

            resolve();
          },
         error: (err: any) => {
            this.spinner.hide();
            reject(err);
          },
          complete: () => { },
        });
    });
    return promise;
  }

  //#endregion
  isUpdateMode: boolean = false;
  checkedUserValue: boolean = false;
  onCheckUserChange(e: any, userId) {

    this.billTypeUsersPermission = new BillTypeUsersPermissions();
    let item = this.subUsers.find(x => x.userId == userId) as SubUsers;
    let index = this.subUsers.indexOf(item);
    item.isUserChecked = e.target.checked;
    Object.entries(item.permissionJson).forEach(
      ([permissionKey, permissionValue], index) => {
        item.permissionJson[permissionKey] = e.target.checked;
        this.billTypeUsersPermission.permissionsJson = JSON.stringify(item.permissionJson)
      }

    );
    if (this.isUpdateMode) {
      let billTypePermissionItem = this.billTypePermissions.find(
        (x) => x.userId == userId
      );
      if (billTypePermissionItem ?? null) {
        this.billTypeUsersPermission.permissionsJson =
          JSON.stringify(item.permissionJson);
        this.billTypeUsersPermission.userId = userId;
        this.billTypeUsersPermission.isUserChecked = e.target.checked;
        let index = this.billTypePermissions.findIndex(
          (x) => x.userId == billTypePermissionItem?.userId
        );
        this.billTypePermissions.splice(index, 1);
        this.billTypePermissions.push(this.billTypeUsersPermission);
      } else {
        this.billTypeUsersPermission.permissionsJson =
          JSON.stringify(item.permissionJson);
        this.billTypeUsersPermission.userId = userId;
        this.billTypeUsersPermission.isUserChecked = e.target.checked;
        this.billTypePermissions.push(this.billTypeUsersPermission);
      }

    } else {
      this.billTypeUsersPermission.userId = userId;
      this.billTypeUsersPermission.isUserChecked = e.target.checked;
      this.billTypePermissions.push(this.billTypeUsersPermission);
    }

    this.subUsers[index] = item;
  }

  permissionJson = {
    isAdd: false,
    isUpdate: false,
    isDelete: false,
    isShow: false,
  };

  onCheckboxChange(e: any, permissionJson, key, userId) {
    if (this.subUsers.length > 0) {
      let item = this.subUsers.find((x) => x.userId == userId) as SubUsers;
      let index = this.subUsers.indexOf(item);
      item.isUserChecked = e.target.checked;
      permissionJson[key] = e.target.checked;
      this.subUsers[index] = item;
      if (item ?? null) {
        let ispermissionChecked = false;
        Object.entries(permissionJson).forEach(
          ([permissionKey, permissionValue], index) => {
            if (permissionValue) {
              ispermissionChecked = true;
              return;
            }
          }
        );
        if (ispermissionChecked) {
          item.isUserChecked = true;
        } else {
          item.isUserChecked = e.target.checked;
        }
      }
    }
    this.billTypeUsersPermission = new BillTypeUsersPermissions();
    this.billTypeUsersPermission.id = 0;
    this.billTypeUsersPermission.billTypeId = 0;
    permissionJson[key] = e.target.checked;
    this.permissionJson[key] = e.target.checked;
    let entryTypePermissionItem = this.billTypePermissions.find(
      (x) => x.userId == userId
    );
    if (entryTypePermissionItem ?? null) {
      this.billTypeUsersPermission.permissionsJson =
        JSON.stringify(permissionJson);
      this.billTypeUsersPermission.userId = userId;
      this.billTypeUsersPermission.isUserChecked = e.target.checked;
      let index = this.billTypePermissions.findIndex(
        (x) => x.userId == entryTypePermissionItem?.userId
      );
      this.billTypePermissions.splice(index, 1);
      this.billTypePermissions.push(this.billTypeUsersPermission);
    } else {
      this.billTypeUsersPermission.permissionsJson =
        JSON.stringify(permissionJson);
      this.billTypeUsersPermission.userId = userId;
      this.billTypeUsersPermission.isUserChecked = e.target.checked;
      this.billTypePermissions.push(this.billTypeUsersPermission);
    }
  }

  setSubUserDataOnUpdate() {
    this.subUsersList.forEach((element) => {
      this.billTypePermissions.push({
        billTypeId: 0,
        id: 0,
        userId: element.userId,
        isUserChecked: element.isUserChecked,
        permissionsJson: JSON.stringify(element.permissionJson),
      } as BillTypeUsersPermissions);
    });
  }
}
