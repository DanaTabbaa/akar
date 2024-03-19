import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  AlertTypes,
  ToolbarActions,
} from 'src/app/core/constants/enumrators/enums';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { ResponseResult } from 'src/app/core/models/ResponseResult';
import { CountriesVM } from 'src/app/core/models/ViewModel/countries-vm';
import { CountriesService } from 'src/app/core/services/backend-services/countries.service';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Subscription } from 'rxjs';
import { navigateUrl } from 'src/app/core/helpers/helper';
import { NAME_REQUIRED_VALIDATORS } from 'src/app/core/constants/input-validators';
import { TranslatePipe } from '@ngx-translate/core';
import { RolesPermissionsService } from 'src/app/core/services/backend-services/permissions/roles-permissions.service';
import { RolesPermissionsVm } from 'src/app/core/models/ViewModel/permissions/roles-permissions-vm';
import { UserPermission } from 'src/app/core/models/permissions/user-permissions';
import { CountryActions } from 'src/app/core/stores/actions/country.actions';
import { Store } from '@ngrx/store';
const PAGEID = 37; // from pages table in database seeding table
@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.scss'],
})
export class CountriesComponent implements OnInit, OnDestroy {
  //#region Main Declarations

  changeCountriesFlag: number = 0;
  countries: CountriesVM[] = [];
  CountriesForm!: FormGroup;
  sub: any;
  url: any;
  id: any = 0;
  currnetUrl;
  addUrl: string = '/control-panel/settings/add-country';
  updateUrl: string = '/control-panel/settings/update-country/';
  listUrl: string = '/control-panel/settings/countries-list';
  toolbarPathData: ToolbarPath = {
    pageId: PAGEID,
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList: 'component-names.list-countries',
    componentAdd: 'component-names.add-country',
  };
  errorMessage = '';
  errorClass = '';
  submited: boolean = false;
  Response!: ResponseResult<CountriesVM>;
  //#endregion

  //#region Constructor

  constructor(
    private router: Router,
    private CountriesService: CountriesService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private rolesPerimssionsService: RolesPermissionsService,
    private alertsService: NotificationsAlertsService,
    private spinner: NgxSpinnerService,
    private sharedServices: SharedService,
    private translate: TranslatePipe,
    private store: Store<any>
  ) {
    this.defineCountryForm();
  }
  //#endregion

  //#region ngOnInit
  ngOnInit(): void {
    this.getPagePermissions(PAGEID);

    this.listenToClickedButton();
    this.changePath();
    this.sub = this.route.params.subscribe((params) => {
      if (params['id'] != null) {
        this.id = Number(params['id']);
        if (this.id > 0) {
          this.getCountryById(this.id);
          this.sharedServices.changeButton({
            action: 'Update',
            submitMode: false,
          } as ToolbarData);
        }
      } else {
        this.sharedServices.changeButton({
          action: 'SinglePage',
          submitMode: false,
        } as ToolbarData);
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

  //#region Authentications

  //#endregion

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
            this.sharedServices.setUserPermissions(this.userPermissions);
            resolve();
          },
         error: (err: any) => {
            this.spinner.hide();
            reject(err);
          },
          complete: () => {},
        });
    });
    return promise;
  }
  //#endregion

  //#region  State Management
  //#endregion

  //#region Basic Data
  ///Geting form dropdown list data
  defineCountryForm() {
    this.CountriesForm = this.fb.group({
      id: 0,
      countryNameAr: NAME_REQUIRED_VALIDATORS,
      countryNameEn: NAME_REQUIRED_VALIDATORS,
      countryIsoCode:NAME_REQUIRED_VALIDATORS
    });
  }

  //#endregion

  //#region CRUD Operations
  getCountryById(id: any) {
    const promise = new Promise<void>((resolve, reject) => {
      this.CountriesService.getByIdWithUrl('GetById?id=' + id).subscribe({
        next: (res: any) => {
          this.CountriesForm.setValue({
            id: res.data.id,
            countryNameAr: res.data.countryNameAr,
            countryNameEn: res.data.countryNameEn,
          });
        },
        error: (err: any) => {
          reject(err);
        },
        complete: () => {},
      });
    });
    return promise;
  }

  //#endregion

  //#region Helper Functions

  get f(): { [key: string]: AbstractControl } {
    return this.CountriesForm.controls;
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
  //#region Toolbar
  subsList: Subscription[] = [];
  currentBtnResult;
  listenToClickedButton() {
    let sub = this.sharedServices.getClickedbutton().subscribe({
      next: (currentBtn: ToolbarData) => {
        currentBtn;

        if (currentBtn != null) {
          if (currentBtn.action == ToolbarActions.List) {
            this.sharedServices.changeToolbarPath(this.toolbarPathData);
            //  this.router.navigate([this.listUrl]);
          } else if (
            currentBtn.action == ToolbarActions.Save &&
            currentBtn.submitMode
          ) {
            this.onSave();
          } else if (currentBtn.action == ToolbarActions.New) {
            this.toolbarPathData.componentAdd = this.translate.transform(
              'component-names.add-country'
            );

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

  //#endregion

  onSave() {
    if (this.CountriesForm.valid) {
      this.sharedServices.changeButtonStatus({button:'Save',disabled:true})
      const promise = new Promise<void>((resolve, reject) => {
        this.CountriesService.addWithUrl(
          'Insert',
          this.CountriesForm.value
        ).subscribe({
          next: (result: any) => {
            this.spinner.show();
            this.Response = { ...result.response };
            if (result.success && !result.isFound) {
              this.changeCountriesFlag++;
              this.store.dispatch(
                CountryActions.actions.insert({
                  data: JSON.parse(JSON.stringify({ ...result.data })),
                })
              );
              //  this.defineCountryForm();

              setTimeout(() => {
                this.spinner.hide();
                this.showResponseMessage(
                  this.Response.success,
                  AlertTypes.success,
                  this.translate.transform('messages.add-success')
                );
                // navigateUrl(this.addUrl, this.router);
              }, 500);
            } else if (result.isFound) {
              this.spinner.hide();
              this.showResponseMessage(
                result.success,
                AlertTypes.warning,
                this.translate.transform('messages.record-exsiting')
              );
            }
          },
         error: (err: any) => {
            this.spinner.hide();
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
      return this.CountriesForm.markAllAsTouched();
    }
  }
  onUpdate() {
     ;
    if (this.CountriesForm.valid) {
      this.CountriesForm.value.id = this.id;
      const promise = new Promise<void>((resolve, reject) => {
        this.CountriesService.updateWithUrl(
          'Update',
          this.CountriesForm.value
        ).subscribe({
          next: (result: any) => {
            this.spinner.show();
            this.Response = { ...result.response };
            if (result.success && !result.isFound) {
              this.changeCountriesFlag++;
              this.store.dispatch(
                CountryActions.actions.update({
                  data: JSON.parse(JSON.stringify({ ...result.data })),
                })
              );

              setTimeout(() => {
                this.spinner.hide();
                this.showResponseMessage(
                  result.success,
                  AlertTypes.success,
                  this.translate.transform('messages.update-success')
                );
                //  navigateUrl(this.addUrl, this.router);
              }, 500);
            } else if (result.isFound) {
              this.spinner.hide();
              this.showResponseMessage(
                result.success,
                AlertTypes.warning,
                this.translate.transform('messages.record-exsiting')
              );
            }
          },
         error: (err: any) => {
            this.spinner.hide();
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
      return this.CountriesForm.markAllAsTouched();
    }
  }
}
