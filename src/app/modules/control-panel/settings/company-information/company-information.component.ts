import { Component, OnInit,AfterViewInit,OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertTypes, ToolbarActions } from 'src/app/core/constants/enumrators/enums';
import { EMAIL_REQUIRED_VALIDATORS, EMAIL_VALIDATORS, FAX_VALIDATORS, MOBILE_REQUIRED_VALIDATORS, MOBILE_VALIDATORS, PHONE_VALIDATORS, Phone_REQUIRED_VALIDATORS } from 'src/app/core/constants/input-validators';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { ResponseResult } from 'src/app/core/models/ResponseResult';
import { CompaniesActivitiesVM } from 'src/app/core/models/ViewModel/companies-activities-vm';
import { RolesPermissionsVm } from 'src/app/core/models/ViewModel/permissions/roles-permissions-vm';
import { CompaniesActivities } from 'src/app/core/models/companies-activities';
import { CompanyInformation } from 'src/app/core/models/company-information';
import { UserPermission } from 'src/app/core/models/permissions/user-permissions';
import { CompaniesActivitiesService } from 'src/app/core/services/backend-services/companies-activities.service';
import { CompanyInformationService } from 'src/app/core/services/backend-services/company-information.service';
import { RolesPermissionsService } from 'src/app/core/services/backend-services/permissions/roles-permissions.service';
import { DateConverterService } from 'src/app/core/services/local-services/date-services/date-converter.service';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { DateModel } from 'src/app/core/view-models/date-model';
import { showResponseMessage } from 'src/app/helper/helper';
import { SharedService } from 'src/app/shared/services/shared.service';
import {Subscription} from 'rxjs'
const PAGEID = 64;
@Component({
  selector: 'app-company-information',
  templateUrl: './company-information.component.html',
  styleUrls: ['./company-information.component.scss']
})

export class CompanyInformationComponent implements OnInit,OnDestroy,AfterViewInit {

  //#region Main Declarations
  currentUserId:any=localStorage.getItem("UserId")
  Response!: ResponseResult<CompanyInformation>;
  CompanyInformationForm!:FormGroup;
  companiesActivities: CompaniesActivities[] = [];
  lang: string = '';
  commercialRegisterExpireDate!: DateModel;
  commercialRegisterDate!: DateModel;
  isCommercialRegisterGreater: boolean = false;
  onSelectCommercialRegisterExpireDate: boolean = false;
  listUrl: string = '/control-panel/settings/system-settings';
  addUrl: string = '/control-panel/settings/company-information';
  toolbarPathData: ToolbarPath = {
    pageId:PAGEID,
    listPath: '',
    updatePath: '',
    addPath: '',
    componentList: "system-settings.system-setting",
    componentAdd: 'component-names.company-information',
  };
  errorMessage;
  errorClass;
  userId
  sub: any;
  //#endregion

  //#region Constructor

  constructor(
   private fb: FormBuilder,
   private CompaniesActivitiesService: CompaniesActivitiesService,
   private sharedServices:SharedService,
   private dateService: DateConverterService,
   private rolesPerimssionsService: RolesPermissionsService,
   private companyInformationService:CompanyInformationService,
   private alertsService: NotificationsAlertsService,
   private translate: TranslatePipe,
   private spinner: NgxSpinnerService,
   private router:Router,
   private route:ActivatedRoute
    ) {
      this.createCompanyInformationForm();
    }
  //#endregion

  //#region ngOnInit
  ngOnInit(): void {
    let currentUserId=Number(localStorage.getItem("UserId"))
    this.loadData();
    this.getCompanyInformationByUserId(currentUserId);

  }
  //#region Create Form
  createCompanyInformationForm() {
    this.CompanyInformationForm = this.fb.group({
      id: 0,
      companyNameAr: '',
      companyNameEn: '',
      companyActivityId: '',
      companyPhone: Phone_REQUIRED_VALIDATORS,
      companyMobile: MOBILE_REQUIRED_VALIDATORS,
      companyFax: FAX_VALIDATORS,
      companyPostalBoxNumber: '',
      commercialRegisterNumber: '',
      taxNumber: '',
      commercialRegisterDate: '',
      commercialRegisterExpireDate: '',
      commercialRegisterPlace: '',
    companyEmail: EMAIL_REQUIRED_VALIDATORS,
      userId:''
    });
    this.commercialRegisterDate = this.dateService.getCurrentDate();
    this.commercialRegisterExpireDate = this.dateService.getCurrentDate();

  }
  //#region

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
  }
  //#endregion
  //#region ngAfterViewInit
  ngAfterViewInit(): void {
    this.commercialRegisterExpireDate =  this.dateService.getDateForCalender(this.commercialRegisterDate.month +1+  "/" + (this.commercialRegisterDate.day+1) + "/" + (this.commercialRegisterDate.year));
  }

  //#endregion
  //#region Authentications

  //#endregion

  //#region Permissions
  rolePermission!: RolesPermissionsVm;
  userPermissions!: UserPermission;
  getPagePermissions(pageId) {
    const promise = new Promise<void>((resolve, reject) => {
      this.rolesPerimssionsService.getAll("GetPagePermissionById?pageId=" + pageId).subscribe({
        next: (res: any) => {
          ;
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

  //#region  State Management
  //#endregion

  //#region Basic Data
  ///Geting form dropdown list data
  loadData(){
    this.sharedServices.changeButton({action:'Update'}as ToolbarData)//Set toolbar to New
    this.sharedServices.changeToolbarPath(this.toolbarPathData); //Set toolbar breadcrumb
    this.getPagePermissions(PAGEID);//Get Page Permissions
    this.getCompanyActivities();
    this.listenToClickedButton();
  }
  getCompanyActivities() {
    const promise = new Promise<void>((resolve, reject) => {
      this.CompaniesActivitiesService.getAll("GetAll").subscribe({
        next: (res: any) => {

          this.companiesActivities = res.data.map(
            (res: CompaniesActivitiesVM[]) => {
              return res;
            }
          );
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

  //#region CRUD Operations

  setInputData(){
    this.CompanyInformationForm.value.userId=this.currentUserId;
      this.CompanyInformationForm.value.commercialRegisterDate=this.dateService.getDateForInsertISO_Format(this.commercialRegisterDate);
      this.CompanyInformationForm.value.commercialRegisterExpireDate=this.dateService.getDateForInsertISO_Format(this.commercialRegisterExpireDate);
  }
  onUpdate(){
    let i=+1;
    console.log("i",i)
    if (this.CompanyInformationForm.valid) {
      this.setInputData();
      const promise = new Promise<void>((resolve, reject) => {
        this.companyInformationService.updateWithUrl(
          'Update?idColName=Id&checkAll=false',
          this.CompanyInformationForm.value
        ).subscribe({
          next: (result: any) => {
            this.spinner.show();
            this.Response=result

            setTimeout(() => {
              this.spinner.hide();

              showResponseMessage(this.translate,this.alertsService,
                this.Response.success, AlertTypes.success, this.translate.transform("messages.update-success")
              );
              this.getCompanyInformationByUserId(this.userId )
            //  navigateUrl(this.listUrl, this.router);
            }, 500);
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
      this.errorMessage = this.translate.transform("validation-messages.invalid-data");
      this.errorClass = 'errorMessage';
      this.alertsService.showError(this.errorMessage, this.translate.transform("message-title.wrong"));
      return this.CompanyInformationForm.markAllAsTouched();
    }

  }
  getCompanyInformationByUserId(userId: any) {

    const promise = new Promise<void>((resolve, reject) => {
      this.companyInformationService.getByIdWithUrl('GetByFieldName?fieldName=userId&fieldValue=' + userId).subscribe({
        next: (res: any) => {
            console.log("getCompanyInformationByUserId",res.data)
          this.CompanyInformationForm.patchValue({...res.data});

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

  //#region Helper Functions
  get f(): { [key: string]: AbstractControl } {
    return this.CompanyInformationForm.controls;
  }
  getLanguage()
  {
    this.sharedServices.getLanguage().subscribe(res => {
      this.lang = res
    })
  }

  getCommercialRegisterExpireDate(selectedDate: DateModel) {
    this.isCommercialRegisterGreater =
      this.dateService.compareStartDateIsGreater(
        this.commercialRegisterDate,
        selectedDate
      );
    if (this.isCommercialRegisterGreater == false) {
      this.onSelectCommercialRegisterExpireDate = true;
      this.commercialRegisterExpireDate = selectedDate;
    } else {
      this.onSelectCommercialRegisterExpireDate = false;
    }
  }
  getCommercialRegisterDate(selectedDate: DateModel) {
    this.commercialRegisterDate = selectedDate;
    this.getCommercialRegisterExpireDate(selectedDate);
    this.checkCommercialRegisterExpireDate()
  }
  checkCommercialRegisterExpireDate() {
    this.commercialRegisterExpireDate = this.dateService.getDateForCalender(this.commercialRegisterDate.month+1 + "/" + (this.commercialRegisterDate.day+1)+ "/" + (this.commercialRegisterDate.year ));
    this.getCommercialRegisterExpireDate(this.commercialRegisterExpireDate)
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
             this.sharedServices.changeToolbarPath({
               listPath: this.listUrl,
             } as ToolbarPath);
             this.router.navigate([this.listUrl]);
           } else if (currentBtn.action == ToolbarActions.Save && currentBtn.submitMode) {
             this.onUpdate();
           } else if (currentBtn.action == ToolbarActions.New) {
             this.toolbarPathData.componentAdd = this.translate.transform("component-names.add-country");

             this.sharedServices.changeToolbarPath(this.toolbarPathData);
                //this.router.navigate([this.addUrl])
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
