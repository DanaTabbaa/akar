import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AlertTypes, ToolbarActions } from 'src/app/core/constants/enumrators/enums';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { Countries } from 'src/app/core/models/countries';
import { RegionVM } from 'src/app/core/models/ViewModel/regions-vm';
import { CitiesService } from 'src/app/core/services/backend-services/cities.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Subscription } from 'rxjs'
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { Cities } from 'src/app/core/models/cities';
import { ResponseResult } from 'src/app/core/models/ResponseResult';
import { Store } from '@ngrx/store';
import { RegionSelectors } from 'src/app/core/stores/selectors/region.selectors';
import { RegionsModel } from 'src/app/core/stores/store.model.ts/regions.store.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { RolesPermissionsVm } from 'src/app/core/models/ViewModel/permissions/roles-permissions-vm';
import { RolesPermissionsService } from 'src/app/core/services/backend-services/permissions/roles-permissions.service';
import { UserPermission } from 'src/app/core/models/permissions/user-permissions';
import { NAME_REQUIRED_VALIDATORS, REQUIRED_VALIDATORS } from 'src/app/core/constants/input-validators';
import { CityActions } from 'src/app/core/stores/actions/city.actions';
import { navigateUrl } from 'src/app/core/helpers/helper';
const PAGEID = 39; // from pages table in database seeding table

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.scss']
})
export class CitiesComponent implements OnInit, OnDestroy {
  //properties
  changeCityFlag:number = 0;
  CitiesForm!: FormGroup;
  rolesPermissions: RolesPermissionsVm[] = [];
  sub: any;
  countries: Countries[] = [];
  regions: RegionVM[] = [];
  response!: ResponseResult<Cities>
  id: number = 0;
  errorMessage = '';
  errorClass = '';
  lang
  submited: boolean = false;
  addUrl: string = '/control-panel/settings/add-city';
  updateUrl: string = '/control-panel/settings/update-city/';
  listUrl: string = '/control-panel/settings/cities-list';
  toolbarPathData: ToolbarPath = {
    pageId:PAGEID,
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList: "component-names.list-cities",
    componentAdd: "component-names.add-city",
  };


  ///


  //#region ngOnDestory
  ngOnDestroy() {
    this.subsList.forEach((s) => {
      if (s) {
        s.unsubscribe();
      }
    });
  }
  //#endregion

  //Constructor
  constructor(private router: Router,
    private CitiesService: CitiesService,
    private translate: TranslatePipe,
    private rolesPerimssionsService: RolesPermissionsService,
    private sharedServices: SharedService,
    private alertsService: NotificationsAlertsService,
    private spinner: NgxSpinnerService,
    private store: Store<any>,
    private fb: FormBuilder, private route: ActivatedRoute) {
    this.createCityForm();
    this.rolesPermissions = JSON.parse(localStorage.getItem('USER_PERMISSIONS')!);
  }
  //
  //onInit
    ngOnInit(): void {
    localStorage.setItem("PageId",PAGEID.toString());
    this.getLanguage();
    this.getPagePermissions(PAGEID)
    this.listenToClickedButton();
    this.changePath();
    this.getRegions();
    this.sub = this.route.params.subscribe(params => {

      if (params['id'] != null) {
         this.id = Number(params['id']);
        if (this.id > 0) {
          this.sharedServices.changeButton({action:'Update'}as ToolbarData )
          this.getCityById(this.id);
        }
      }else{
        this.sharedServices.changeButton({ action: 'SinglePage',submitMode:false } as ToolbarData);
      }
    })

  }
  getLanguage() {
    this.sharedServices.getLanguage().subscribe(res => {
      this.lang = res
    })
  }
  //
  ///Geting form dropdown list data
  createCityForm() {
    this.CitiesForm = this.fb.group({
      id: 0,
      cityNameAr: NAME_REQUIRED_VALIDATORS,
      cityNameEn: NAME_REQUIRED_VALIDATORS,
      regionId: REQUIRED_VALIDATORS

    });
  }

  //#endregion
  //#region Permissions
  rolePermission!: RolesPermissionsVm;
  userPermissions!: UserPermission;
  getPagePermissions(pageId) {
    const promise = new Promise<void>((resolve, reject) => {
      this.rolesPerimssionsService.getAll("GetPagePermissionById?pageId=" + pageId).subscribe({
        next: (res: any) => {
          this.rolePermission = JSON.parse(JSON.stringify(res.data));
          this.userPermissions = JSON.parse(this.rolePermission.permissionJson);
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


  getRegions() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.store.select(RegionSelectors.selectors.getListSelector).subscribe({
        next: (res: RegionsModel) => {
          this.regions = JSON.parse(JSON.stringify(res.list))
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
  onSave() {
    if (this.CitiesForm.valid) {
      this.sharedServices.changeButtonStatus({button:'Save',disabled:true})
      const promise = new Promise<void>((resolve, reject) => {
        this.CitiesService.addWithUrl(
          'Insert',
          this.CitiesForm.value
        ).subscribe({
          next: (result: any) => {
            this.spinner.show();
            this.response = { ...result };

         //   this.defineCityForm();
         if(result.success && !result.isFound)
         {
          this.store.dispatch(CityActions.actions.insert({
            data: JSON.parse(JSON.stringify({ ...result.data }))
          }));
         //this.defineDistrictForm();
         this.changeCityFlag++;
         this.submited = false;
         setTimeout(() => {
           this.spinner.hide();
           this.showResponseMessage(
            result.success,
             AlertTypes.success,
             this.translate.transform("messages.add-success")
           );
           //navigateUrl(this.listUrl, this.router);
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

          },
        });
      });
      return promise;

    } else {
      this.sharedServices.changeButtonStatus({button:'Save',disabled:false})
      this.errorMessage = this.translate.transform("validation-messages.invalid-data");
      this.errorClass = 'errorMessage';
      this.alertsService.showError(this.errorMessage, this.translate.transform("message-title.wrong"));
      return this.CitiesForm.markAllAsTouched();
    }
  }
  onUpdate() {
    if (this.CitiesForm.valid) {
      this.CitiesForm.value.id = this.id;
      const promise = new Promise<void>((resolve, reject) => {
        this.CitiesService.updateWithUrl("Update", this.CitiesForm.value).subscribe({
          next: (result: any) => {
            this.spinner.show();
          //  this.response = { ...result.response };
               if(result.success && !result.isFound)
               {


            this.store.dispatch(CityActions.actions.update({
              data: JSON.parse(JSON.stringify({ ...result.data }))
            }));
            this.changeCityFlag++;
            this.createCityForm();
            this.submited = false;
            setTimeout(() => {
              this.spinner.hide();
              this.showResponseMessage(
                result.success,
                AlertTypes.success,
                this.translate.transform("messages.update-success")
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

          },
        });
      });
      return promise;
    }

    else {
      this.errorMessage = this.translate.transform("validation-messages.invalid-data");
      this.errorClass = 'errorMessage';
      this.alertsService.showError(this.errorMessage, this.translate.transform("message-title.wrong"));
      return this.CitiesForm.markAllAsTouched();
    }
  }

  getCityById(id: any) {
    const promise = new Promise<void>((resolve, reject) => {
      this.CitiesService.getByIdWithUrl("getbyId?Id=" + id).subscribe({
        next: (res: any) => {
          this.CitiesForm.patchValue({
            id: res.data.id,
            cityNameAr: res.data.cityNameAr,
            cityNameEn: res.data.cityNameEn,
            regionId: res.data.regionId
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
            this.router.navigate([this.addUrl])
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
  showResponseMessage(responseStatus, alertType, message) {

    if (responseStatus == true && AlertTypes.success == alertType) {
      this.alertsService.showSuccess(message, this.translate.transform("messageTitle.done"))
    } else if (responseStatus == true && AlertTypes.warning) {
      this.alertsService.showWarning(message, this.translate.transform("messageTitle.alert"))
    } else if (responseStatus == true && AlertTypes.info) {
      this.alertsService.showInfo(message, this.translate.transform("messageTitle.info"))
    } else if (responseStatus == false && AlertTypes.error) {
      this.alertsService.showError(message, this.translate.transform("messageTitle.error"))
    }
  }
  //#endregion

  get f(): { [key: string]: AbstractControl } {
    return this.CitiesForm.controls;
  }

}
