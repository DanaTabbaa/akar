import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AlertTypes, ToolbarActions } from 'src/app/core/constants/enumrators/enums';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { Countries } from 'src/app/core/models/countries';
import { CountriesVM } from 'src/app/core/models/ViewModel/countries-vm';
import { RegionVM } from 'src/app/core/models/ViewModel/regions-vm';
import { CountriesService } from 'src/app/core/services/backend-services/countries.service';
import { RegionsService } from 'src/app/core/services/backend-services/regions.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import {Subscription} from 'rxjs'
import { NgxSpinnerService } from 'ngx-spinner';
import { Store } from '@ngrx/store';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { RolesPermissionsService } from 'src/app/core/services/backend-services/permissions/roles-permissions.service';
import { RolesPermissionsVm } from 'src/app/core/models/ViewModel/permissions/roles-permissions-vm';
import { UserPermission } from 'src/app/core/models/permissions/user-permissions';
import { RegionActions } from 'src/app/core/stores/actions/region.actions';
import { ResponseResult } from 'src/app/core/models/ResponseResult';
import { NAME_REQUIRED_VALIDATORS, REQUIRED_VALIDATORS } from 'src/app/core/constants/input-validators';
import { navigateUrl } from 'src/app/core/helpers/helper';
const PAGEID=38; // from pages table in database seeding table
@Component({
  selector: 'app-regions',
  templateUrl: './regions.component.html',
  styleUrls: ['./regions.component.scss']
})
export class RegionsComponent implements OnInit,OnDestroy {
//properties
  RegionsForm!: FormGroup;
  sub: any;
  countries: Countries[] = [];
  regions: RegionVM[] = [];
  Response!: ResponseResult<RegionVM>;
  errorMessage = '';
  errorClass = '';
  lang
  id: number=0;
  submited: boolean = false;
  addUrl: string = '/control-panel/settings/add-region';
  updateUrl: string = '/control-panel/settings/update-region/';
  listUrl: string = '/control-panel/settings/regions-list';
  toolbarPathData: ToolbarPath = {
    pageId:PAGEID,
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList:"component-names.list-regions",
    componentAdd: "component-names.add-region",
  };
  //
  defineRegionForm() {
    this.RegionsForm = this.fb.group({
      id: 0,
      regionNameAr: NAME_REQUIRED_VALIDATORS,
      regionNameEn: NAME_REQUIRED_VALIDATORS,
      countryId:REQUIRED_VALIDATORS
    })
  }
//Constructor
  constructor( private router: Router,
    private translate:TranslatePipe,
    private rolesPerimssionsService:RolesPermissionsService,
    private RegionsService: RegionsService,
    private CountriesService: CountriesService,
    private sharedServices:SharedService,
    private spinner:NgxSpinnerService,
    private alertsService:NotificationsAlertsService,
    private store:Store<any>,
    private fb: FormBuilder, private route: ActivatedRoute) {
    this.defineRegionForm();
  }
  //#region ngOnDestory
  ngOnDestroy() {
    this.subsList.forEach((s) => {
      if (s) {
        s.unsubscribe();
      }
    });
  }
  getLanguage() {
    this.sharedServices.getLanguage().subscribe(res => {
      this.lang = res
    })
  }
  //#endregion
  //
//onInit
  ngOnInit(): void {
    this.getLanguage();
    this.getPagePermissions(PAGEID)
    this.listenToClickedButton();
    this.changePath();
    this.getCountries();
    this.sub = this.route.params.subscribe(params => {
      if (params['id'] != null) {
        this.id = +params['id'];
        if (this.id > 0) {
          this.getRegionById(this.id);
          this.sharedServices.changeButton({action:'Update',submitMode:false}as ToolbarData);
        }
      }else{
        this.sharedServices.changeButton({action:'SinglePage',submitMode:false}as ToolbarData);

      }
    })
  }
  //



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
            this.spinner.hide();
            reject(err);
          },
          complete: () => {

          },
        });
      });
      return promise;

  }
//#endregion
  getCountries() {

    const promise = new Promise<void>((resolve, reject) => {
      this.CountriesService.getAll("GetAll").subscribe({
        next: (res: any) => {
          this.countries = res.data.map((res: CountriesVM[]) => {
            return res
          });
          resolve();
          //(("res", res);
          //((" this.countries", this.countries);
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

  saveRegion() {
    this.spinner.show();
    if (this.id == 0) {
      this.RegionsService.addRequest(this.RegionsForm.value).subscribe(
        result => {
          if (result != null) {

            setTimeout(() => {


              this.showResponseMessage(true,AlertTypes.success,this.translate.transform("messages.add-success"))
              this.router.navigate([this.listUrl]);
              this.spinner.hide();
            },2000 );

          }
        },
        error => console.error(error))
    }
    else {

      this.RegionsForm.value.id = this.id;
      this.RegionsService.updateWithUrl("Update",this.RegionsForm.value).subscribe(
        result => {
          if (result != null) {
            setTimeout(() => {
              this.showResponseMessage(true,AlertTypes.success,this.translate.transform("messages.update-success"))
              this.router.navigate([this.listUrl]);
              this.spinner.hide();
            },2000 );
          }
        },
        error => console.error(error))
    }
  }
  getRegionById(id: any) {
    const promise = new Promise<void>((resolve, reject) => {
      this.RegionsService.getByIdWithUrl("GetById?id="+id).subscribe({
        next: (res: any) => {
          ;
          //(("result data getbyid", res.data);
          this.RegionsForm.setValue({
            id: res.data.id,
          regionNameAr: res.data.regionNameAr,
          regionNameEn: res.data.regionNameEn,
          countryId:res.data.countryId
          });
          //(("this.RegionsForm.value set value", this.RegionsForm.value)
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
  changeDistrictFlag:number = 0;
  onSave() {
    if (this.RegionsForm.valid) {
      this.sharedServices.changeButtonStatus({button:'Save',disabled:true})
      const promise = new Promise<void>((resolve, reject) => {
        this.RegionsService.addWithUrl(
          'Insert',
          this.RegionsForm.value
        ).subscribe({
          next: (result: any) => {
            this.spinner.show();
            this.Response = { ...result };
 
            if(result.success && !result.isFound)
            {
            this.store.dispatch(RegionActions.actions.insert({
              data: JSON.parse(JSON.stringify({ ...result.data }))
            }));
            //this.defineDistrictForm();
            this.changeDistrictFlag++;
            this.submited = false;
            setTimeout(() => {
              this.spinner.hide();
              this.showResponseMessage(
                this.Response.success,
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
      return this.RegionsForm.markAllAsTouched();
    }
  }
  onUpdate() {
    if (this.RegionsForm.valid) {
      this.RegionsForm.value.id = this.id;
      const promise = new Promise<void>((resolve, reject) => {
        this.RegionsService.updateWithUrl("Update", this.RegionsForm.value).subscribe({
          next: (result: any) => {
            this.spinner.show();
            this.Response = { ...result.response };
               if(result.success &&!result.isFound)
               {


            this.store.dispatch(RegionActions.actions.update({
              data: JSON.parse(JSON.stringify({ ...result.data }))
            }));
            this.changeDistrictFlag++;
            this.defineRegionForm();
            this.submited = false;
            setTimeout(() => {
              this.spinner.hide();
              this.showResponseMessage(
                result.success,
                AlertTypes.success,
                this.translate.transform("messages.update-success")
              );
             // navigateUrl(this.listUrl, this.router);
            },500);
          }else if(result.isFound){
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
      return this.RegionsForm.markAllAsTouched();
    }
  }
  //#region Tabulator
  subsList: Subscription[] = [];
  currentBtnResult;
  listenToClickedButton() {
    let sub = this.sharedServices.getClickedbutton().subscribe({
      next: (currentBtn: ToolbarData) => {
        currentBtn;
        if (currentBtn != null) {
          if (currentBtn.action == ToolbarActions.List) {
            this.sharedServices.changeToolbarPath(this.toolbarPathData);
            this.router.navigate([this.addUrl]);
          } else if (currentBtn.action == ToolbarActions.Save && currentBtn.submitMode) {
            this.onSave();
          } else if (currentBtn.action == ToolbarActions.New) {
            this.toolbarPathData.componentAdd = this.translate.transform("component-names.add-region");
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

  showResponseMessage(responseStatus,alertType, message) {

    if (responseStatus == true && AlertTypes.success==alertType) {
      this.alertsService.showSuccess(message, this.translate.transform("messageTitle.done"))
    } else if(responseStatus==true&&AlertTypes.warning) {
      this.alertsService.showWarning(message, this.translate.transform("messageTitle.alert"))
    }else if(responseStatus==true&&AlertTypes.info) {
      this.alertsService.showInfo(message, this.translate.transform("messageTitle.info"))
    }else if(responseStatus==false&&AlertTypes.error) {
      this.alertsService.showError(message, this.translate.transform("messageTitle.error"))
    }
  }
  get f(): { [key: string]: AbstractControl } {
    return this.RegionsForm.controls;
  }
}
