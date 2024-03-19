import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AlertTypes, ToolbarActions } from 'src/app/core/constants/enumrators/enums';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { Cities } from 'src/app/core/models/cities';
import { District } from 'src/app/core/models/district';
import { DistrictsService } from 'src/app/core/services/backend-services/district.service';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Subscription } from 'rxjs'
import { Store } from '@ngrx/store';
import { CitySelectors } from 'src/app/core/stores/selectors/city.selectors';
import { CitiesModel } from 'src/app/core/stores/store.model.ts/cities.store.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { districtVM } from 'src/app/core/models/ViewModel/district-vm';
import { ResponseResult } from 'src/app/core/models/ResponseResult';
import { RolesPermissionsService } from 'src/app/core/services/backend-services/permissions/roles-permissions.service';
import { RolesPermissionsVm } from 'src/app/core/models/ViewModel/permissions/roles-permissions-vm';
import { UserPermission } from 'src/app/core/models/permissions/user-permissions';
import { NAME_REQUIRED_VALIDATORS, REQUIRED_VALIDATORS } from 'src/app/core/constants/input-validators';
import { DistrictActions } from 'src/app/core/stores/actions/district.actions';
import { navigateUrl } from 'src/app/core/helpers/helper';
const PAGEID = 40
@Component({
  selector: 'app-districts',
  templateUrl: './districts.component.html',
  styleUrls: ['./districts.component.scss']
})
export class DistrictsComponent implements OnInit, OnDestroy {

  //properties
  DistrictForm!: FormGroup;
  sub: any;
  districts: District[] = [];
  cities: Cities[] = [];
  id: number = 0;
  Response!: ResponseResult<districtVM>;
  errorMessage = '';
  errorClass = '';
  submited: boolean = false;
  lang
  changeDistrictFlag:number = 0;
  addUrl: string = '/control-panel/settings/add-district';
  updateUrl: string = '/control-panel/settings/update-district/';
  listUrl: string = '/control-panel/settings/districts-list';
  toolbarPathData: ToolbarPath = {
    pageId:PAGEID,
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList: "component-names.list-districts",
    componentAdd: "component-names.add-district",
  };
  ///
  defineDistrictForm() {
    this.DistrictForm = this.fb.group({
      id: 0,
      districtNameAr: NAME_REQUIRED_VALIDATORS,
      districtNameEn: NAME_REQUIRED_VALIDATORS,
      cityId: REQUIRED_VALIDATORS
    })
  }
clearDistrictForm() {
  this.DistrictForm.patchValue({
    id:0,
    districtNameAr:'',
    districtNameEn:'',

  });
  this.DistrictForm.get('districtNameAr')?.clearValidators();
  this.DistrictForm.get('districtNameEn')?.clearValidators();
  this.DistrictForm.markAsUntouched();



  }
  //Constructor
  constructor(private router: Router,
    private districtsService: DistrictsService,
    private translate: TranslatePipe,
    private sharedServices: SharedService,
    private alertsService: NotificationsAlertsService,
    private spinner: NgxSpinnerService,
    private rolesPerimssionsService: RolesPermissionsService,
    private store: Store<any>,
    private fb: FormBuilder, private route: ActivatedRoute) {
    this.defineDistrictForm();
  }
  //
  //onInit
  ngOnInit(): void {
    this.getLanguage();
    this.getPagePermissions(PAGEID);
    this.listenToClickedButton();
    this.changePath();
    this.getCities();
    this.sub = this.route.params.subscribe(params => {
       ;
      if (Number(params['id']) != null) {
        this.id = Number(params['id']);
        if (this.id > 0) {
          this.sharedServices.changeButton({action:"Update"}as ToolbarData);
          this.getDistrictById(this.id);
        }else{
          this.sharedServices.changeButton({ action: 'SinglePage',submitMode:false } as ToolbarData);
        }
      }
    })
  }
  getLanguage() {
    this.sharedServices.getLanguage().subscribe(res => {
      this.lang = res
    })
  }
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
          complete: () => { },
        });
    });
    return promise;
  }
  //#endregion


  getCities() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.store.select(CitySelectors.selectors.getListSelector).subscribe({
        next: (res: CitiesModel) => {
          this.cities = JSON.parse(JSON.stringify(res.list))
          resolve();
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

  getDistrictById(id: any) {
    const promise = new Promise<void>((resolve, reject) => {
      this.districtsService.getByIdWithUrl("GetById?id=" + id).subscribe({
        next: (res: any) => {
          this.DistrictForm.setValue({
            id: res.data.id,
            districtNameAr: res.data.districtNameAr,
            districtNameEn: res.data.districtNameEn,
            cityId: res.data.cityId
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
           // this.router.navigate([this.listUrl]);
           this.sharedServices.changeButton({ action: 'SinglePage',submitMode:false } as ToolbarData);
          } else if (currentBtn.action == ToolbarActions.Save && currentBtn.submitMode) {
            this.onSave();
          } else if (currentBtn.action == ToolbarActions.New) {
            this.toolbarPathData.componentAdd = this.translate.transform("component-names.add-city");
            this.sharedServices.changeToolbarPath(this.toolbarPathData);
             this.defineDistrictForm();
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
  get f(): { [key: string]: AbstractControl } {
    return this.DistrictForm.controls;
  }

  onSave() {
    if (this.DistrictForm.valid) {
      this.sharedServices.changeButtonStatus({button:'Save',disabled:true})
      this.spinner.show();
      const promise = new Promise<void>((resolve, reject) => {
        this.districtsService.addWithUrl(
          'Insert',
          this.DistrictForm.value
        ).subscribe({
          next: (result: any) => {


            this.Response = { ...result};
            if(result.success&& !result.isFound)
            {
            this.store.dispatch(DistrictActions.actions.insert({
              data: JSON.parse(JSON.stringify({ ...result.data }))
            }));
            //this.defineDistrictForm();

            this.changeDistrictFlag++;
           this.clearDistrictForm();
            setTimeout(() => {
              this.spinner.hide();
              this.showResponseMessage(
                result.success,
                AlertTypes.success,
                this.translate.transform("messages.add-success")
              );
              navigateUrl(this.addUrl, this.router);
            },500);
          }else if(result.isFound)
          {
            this.spinner.hide();
            this.showResponseMessage(
              result.success,
              AlertTypes.warning,
              this.translate.transform("messages.record-exsiting")
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
      return promise;

    } else {
      this.sharedServices.changeButtonStatus({button:'Save',disabled:false})
      this.errorMessage = this.translate.transform("validation-messages.invalid-data");
      this.errorClass = 'errorMessage';
      this.alertsService.showError(this.errorMessage, this.translate.transform("message-title.wrong"));
      return this.DistrictForm.markAllAsTouched();
    }
  }
  onUpdate() {
    if (this.DistrictForm.valid) {

      this.DistrictForm.value.id = this.id;
      const promise = new Promise<void>((resolve, reject) => {
        this.districtsService.updateWithUrl("Update", this.DistrictForm.value).subscribe({
          next: (result: any) => {

            this.Response = { ...result.data };
            if(result.success&&!result.isFound)
            {


            this.changeDistrictFlag++;
            this.store.dispatch(DistrictActions.actions.update({
              data: JSON.parse(JSON.stringify({ ...result.data }))
            }));

            this.defineDistrictForm();
            this.submited = false;
            setTimeout(() => {
              this.spinner.hide();
              this.sharedServices.changeButton({ action: 'SinglePage',submitMode:false } as ToolbarData);
              this.showResponseMessage(
                result.success,
                AlertTypes.success,
                this.translate.transform("messages.update-success")
              );
            //  navigateUrl(this.listUrl, this.router);
            },500);
          }else if(result.isFound)
          {
            this.spinner.hide();
            this.showResponseMessage(
              result.success,
              AlertTypes.warning,
              this.translate.transform("messages.record-exsiting")
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
      return promise;
    }

    else {
      this.errorMessage = this.translate.transform("validation-messages.invalid-data");
      this.errorClass = 'errorMessage';
      this.alertsService.showError(this.errorMessage, this.translate.transform("message-title.wrong"));
      return this.DistrictForm.markAllAsTouched();
    }
  }
}
