import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertTypes,
  convertEnumToArray,
  pursposeTypeArEnum,
  pursposeTypeEnum,
  realEstateTypesArEnum,
  realEstateTypesEnum,
  ToolbarActions,
} from 'src/app/core/constants/enumrators/enums';
import { ICustomEnum } from 'src/app/core/interfaces/ICustom-enum';
import { UnitsTypesVM } from 'src/app/core/models/ViewModel/units-types-vm';
import { RealestatesService } from 'src/app/core/services/backend-services/realestates.service';
import { Office } from 'src/app/core/models/offices';
import { Owner } from 'src/app/core/models/owners';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { ResponseResult } from 'src/app/core/models/ResponseResult';
import { Realestate } from 'src/app/core/models/realestates';
import { RealestateVM } from 'src/app/core/models/ViewModel/realestates-vm';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Subscription } from 'rxjs';
import { navigateUrl } from 'src/app/core/helpers/helper';
import { TranslatePipe } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { RolesPermissionsVm } from 'src/app/core/models/ViewModel/permissions/roles-permissions-vm';
import { UserPermission } from 'src/app/core/models/permissions/user-permissions';
import { RolesPermissionsService } from 'src/app/core/services/backend-services/permissions/roles-permissions.service';
import { RealestateActions } from 'src/app/core/stores/actions/realestate.actions';
import { SystemSettingsService } from 'src/app/core/services/backend-services/system-settings.service';
import { Store } from '@ngrx/store';
import { ManagerService } from 'src/app/core/services/backend-services/manager.service';
const PAGEID = 5; // from pages table in database seeding table
@Component({
  selector: 'app-real-estate-groups',
  templateUrl: './real-estate-groups.component.html',
  styleUrls: ['./real-estate-groups.component.scss'],
})
export class RealEstateGroupsComponent implements OnInit, OnDestroy, AfterViewInit {

  //properties
  //realestateObj!: Realestate;
  lang: string = '';
  realestateForm!: FormGroup;
  realestateTypes: ICustomEnum[] = [];
  unitsTypes: UnitsTypesVM[] = [];
  purposeTypes: ICustomEnum[] = [];
  offices: Office[] = [];
  owners: Owner[] = [];
  id: any = 0;
  public gfg = false;
  public gfg2 = false;
  public gfg3 = false;
  public gfg4 = false;
  public gfg5 = false;
  public gfg6 = false;
  // add!: boolean;
  // update!: boolean;
  showOfferInformation: boolean = false;
  showGarageInformation: boolean = false;
  errorMessage = '';
  errorClass = '';
  submited: boolean = false;
  //Response!: ResponseResult<Realestate>;
  realestateList: RealestateVM[] = [];
  annualRent: any;
  monthlyRent: any;
  insuranceRatio: any;
  insuranceValue: any;
  showDecimalPoint!: boolean;
  showThousandsComma!: boolean;
  showRoundingFractions!: boolean;
  numberOfFraction!: number;
  /////toolbar
  currnetUrl: any;
  addUrl: string = '/control-panel/definitions/add-real-estate-group';
  updateUrl: string = '/control-panel/definitions/update-real-estate-group/';
  listUrl: string = '/control-panel/definitions/real-estate-groups-list';
  toolbarPathData: ToolbarPath = {
    pageId: PAGEID,
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList: "component-names.list-realestates",
    componentAdd: "component-names.add-realestate",
  };
  //


  //#region ngOnDestory
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
  //constructor
  constructor(
    private realestatesService: RealestatesService,    
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private sharedServices: SharedService,
    private translate: TranslatePipe,
    private alertsService: NotificationsAlertsService,    
    private spinner: NgxSpinnerService,
    private store: Store<any>,    
    private managerService: ManagerService
  ) {
    this.defineRealestateForm();
  }
  //

  defineRealestateForm() {
    this.realestateForm = this.fb.group({
      id: 0,
      // realestateType: 0,
      realestateNameAr: ['', Validators.compose([Validators.required])],
      realestateNameEn: ['', Validators.compose([Validators.required])],
      unitTypeId: ['', Validators.compose([Validators.required])],
      purposeType: ['', Validators.compose([Validators.required])],
      realestateNumber: ['',/* Validators.compose([Validators.required])*/],
      realestateCount: ['', /*Validators.compose([Validators.required])*/],
      parentId: '',
      isFeatured: false,
      hasPriceOffer: false,
      hasGarage: false,
      offerPrice: '',
      offerDescription: '',
      garageArea: '',
      vehiclesCount: '',
      customGarageCount: '',
      officeId: '',
      ownerId: '',
      realestateDescription: '',
      annualRent: '',
      monthlyRent: '',
      insuranceRatio: '',
      insuranceValue: '',
      electricityCounterNo: '',
      realestateTypeId: ''
    });
  }

  ngAfterViewInit(): void {


  }
  //oninit
  ngOnInit(): void {

    localStorage.setItem("PageId", PAGEID.toString());

    //this.add = true;

    //
    this.getRealestateTypes();
    this.getPurposeTypes();
    //Promises functions
    this.spinner.show();
    Promise.all([this.getLanguage(),
    this.managerService.loadPagePermissions(PAGEID),
    this.managerService.loadSystemSettings(),
    this.managerService.loadRealestate(),
    this.managerService.loadUnitTypes(),
    this.managerService.loadOffices(),
    this.managerService.loadOwners()]).then(a => {
      this.offices = this.managerService.getOffices();
      this.realestateList = this.managerService.getRealestates();
      this.unitsTypes = this.managerService.getUnitTypes();
      this.owners = this.managerService.getOwners();

      
      this.getSystemSettings();

      //Load Compelete

      //this.sharedServices.changeButton({ action: 'Save', submitMode: false } as ToolbarData);
      this.getRoutData();
      this.changePath();
      this.listenToClickedButton();
    }).catch(err => {
      this.spinner.hide();
    });






  }
  getRoutData() {
    let sub = this.route.params.subscribe((params) => {
      if (params['id'] != null) {
        // this.update = true;
        // this.add = false;
        this.id = params['id'];
        if (this.id > 0) {
           

          this.getRealEstateById(this.id).then(a => {

            this.spinner.hide();
            this.sharedServices.changeButton({ action: 'Update', submitMode: false } as ToolbarData);
            localStorage.setItem("RecordId", params["id"]);
          }).catch(e => {
            this.sharedServices.changeButton({ action: 'New' } as ToolbarData);
            this.spinner.hide();
          });

        }
        else {
          this.sharedServices.changeButton({ action: 'New' } as ToolbarData);
          this.spinner.hide();
        }
      } else {
        this.selectedOption = 'main';
        this.sharedServices.changeButton({ action: 'New' } as ToolbarData);
        this.spinner.hide();
      }
    });
    this.subsList.push(sub);
  }
  //
  getLanguage() {
    return new Promise<void>((acc, rej) => {
      this.sharedServices.getLanguage().subscribe({
        next: (res) => {
          this.lang = res;
          acc();
        },
        error: (err) => {
          console.log(err);
          acc();
        }
      });
    });

  }
  //#region Helper Functions
  // rolePermission!: RolesPermissionsVm;
  // userPermissions!: UserPermission;
  // getPagePermissions(pageId) {
  //   return new Promise<void>((resolve, reject) => {
  //     this.rolesPerimssionsService.getAll("GetPagePermissionById?pageId=" + pageId).subscribe({
  //       next: (res: any) => {
  //         this.rolePermission = JSON.parse(JSON.stringify(res.data));
  //         this.userPermissions = JSON.parse(this.rolePermission.permissionJson);
  //         this.sharedServices.setUserPermissions(this.userPermissions);
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


  // }
  //#endregion
  //methods
  getRealestateTypes() {
    if (this.lang == 'en') {
      this.realestateTypes = convertEnumToArray(realEstateTypesEnum);
    }
    else {
      this.realestateTypes = convertEnumToArray(realEstateTypesArEnum);

    }
  }
  getPurposeTypes() {
    if (this.lang == 'en') {
      this.purposeTypes = convertEnumToArray(pursposeTypeEnum);
    }
    else {
      this.purposeTypes = convertEnumToArray(pursposeTypeArEnum);

    }
  }
  printValue() {
    console.log("this.selectedOption", this.selectedOption)
  }

  get f(): { [key: string]: AbstractControl } {
    return this.realestateForm.controls;
  }
  // getOffices() {
  //   return new Promise<void>((resolve, reject) => {
  //     let sub = this.officesService.getAll("GetAll").subscribe({
  //       next: (res: any) => {
  //         this.offices = res.data.map((res: OfficesVM[]) => {
  //           return res;
  //         });
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
  // getOwners() {
  //   return new Promise<void>((resolve, reject) => {
  //     let sub = this.ownersService.getAll("GetAllVM").subscribe({
  //       next: (res: any) => {
  //         this.owners = res.data.map((res: OwnersVM[]) => {
  //           return res;
  //         });
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
  // navigateUrl(urlroute: string) {
  //   this.router.navigate([urlroute]);
  // }
  selectedOption
  rentPuropseType = pursposeTypeEnum['For Rent']
  setRadioBottonData() {
    if (this.selectedOption == 'main') {
      this.realestateForm.value.realestateTypeId = 1;
    } else if (this.selectedOption == 'main') {
      this.realestateForm.value.realestateTypeId = 2;
    }
  }
  //#region Crud Operations
  onSubmit() {

    if (this.realestateForm.valid) {
      //this.sharedServices.changeButtonStatus({ button: 'Save', disabled: true })

      this.realestateForm.value.id = 0;
      this.setRadioBottonData();
      this.realestateForm.value.monthlyRent = this.monthlyRent;
      this.realestateForm.value.insuranceValue = this.insuranceValue;

      this.spinner.show();
      this.confirmSubmit().then(a => {
        this.spinner.hide();
      }).catch(err => {
        this.spinner.hide();
      });
    } else {
      this.sharedServices.changeButtonStatus({ button: 'Save', disabled: false })

      this.errorMessage = this.translate.transform("validation-messages.invalid-data");
      this.errorClass = 'errorMessage';
      this.alertsService.showError(this.errorMessage, this.translate.transform("message-title.wrong"));
      return this.realestateForm.markAllAsTouched();
    }

  }

  confirmSubmit() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.realestatesService.addWithResponse('AddWithCheck?uniques=RealestateNameAr&uniques=RealestateNameEn', this.realestateForm.value).subscribe({
        next: (result: ResponseResult<Realestate>) => {
          // this.Response = { ...result.response };
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
          }else {
            this.showResponseMessage(
              result.success,
              AlertTypes.error,
              this.translate.transform("messages.error")
            );
          }
          

        },
        error: (err) => {
          reject(err);
        }
      });
      this.subsList.push(sub);
    });

  }

  onUpdate() {
    if (this.id) {
      this.realestateForm.value.id = this.id;
      this.setRadioBottonData();

      this.spinner.show();
      this.confirmUpdate().then(a => {
        this.spinner.hide();
      }).catch(err => {
        this.spinner.hide();
      });


    }

    else {
      this.errorMessage = this.translate.transform("validation-messages.invalid-data");
      this.errorClass = 'errorMessage';
      this.alertsService.showError(this.errorMessage, this.translate.transform("message-title.wrong"));
      return this.realestateForm.markAllAsTouched();
    }
  }
  //#endregion

  confirmUpdate() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.realestatesService.updateWithUrl("UpdateWithCheck?uniques=RealestateNameAr&uniques=RealestateNameEn", this.realestateForm.value).subscribe({
        next: (result: ResponseResult<Realestate>) => {
          resolve();
          if (result.success && !result.isFound) {


            this.store.dispatch(RealestateActions.actions.update({
              data: JSON.parse(JSON.stringify({ ...result.data }))
            }));

            this.defineRealestateForm();



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
          else {
            this.showResponseMessage(
              result.success,
              AlertTypes.error,
              result.message
            );
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

  getRealEstateById(id: any) {
    return new Promise<void>((resolve, reject) => {
      let sub = this.realestatesService.getWithResponse<Realestate>("GetById?Id=" + id).subscribe({
        next: (res: ResponseResult<Realestate>) => {
          resolve();
          //this.realestateObj = { ...res.data }
          if(res.data){
            this.realestateForm.patchValue({
              id: id,
              // realestateType: res.data.realestateType,
              realestateNameAr: res.data.realestateNameAr,
              realestateNameEn: res.data.realestateNameEn,
              parentId: res.data.parentId,
              unitTypeId: res.data.unitTypeId,
              purposeType: res.data.purposeType,
              realestateNumber: res.data.realestateNumber,
              realestateCount: res.data.realestateCount,
              isFeatured: res.data.isFeatured,
              hasPriceOffer: res.data.hasPriceOffer,
              hasGarage: res.data.hasGarage,
              offerPrice: res.data.offerPrice,
              offerDescription: res.data.offerDescription,
              garageArea: res.data.garageArea,
              vehiclesCount: res.data.vehiclesCount,
              customGarageCount: res.data.customGarageCount,
              officeId: res.data.officeId,
              ownerId: res.data.ownerId,
              realestateDescription: res.data.realestateDescription,
              annualRent: res.data.annualRent,
              monthlyRent: res.data.monthlyRent,
              insuranceRatio: res.data.insuranceRatio,
              insuranceValue: res.data.insuranceValue,
              electricityCounterNo: res.data.electricityCounterNo,
            });
            if (res.data.realestateTypeId == 1) {
              this.selectedOption = 'main'
            } else {
              this.selectedOption = 'sub'
            }
            this.annualRent = res.data.annualRent;
            this.monthlyRent = res.data.monthlyRent;
            this.insuranceRatio = res.data.insuranceRatio;
            this.insuranceValue = res.data.insuranceValue;
            this.garageInformationChange();
            this.offerInformationChange();
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
  cancel() {
    this.realestateForm = this.fb.group({
      id: 0,
      realestateNameAr: '',
      realestateNameEn: '',
      unitTypeId: '',
      purposeType: '',
      realestateNumber: '0',
      realestateCount: '0',
      isFeatured: false,
      hasPriceOffer: false,
      hasGarage: false,
      offerPrice: '',
      offerDescription: '',
      garageArea: '',
      vehiclesCount: '',
      customGarageCount: '',
      officeId: '',
      ownerId: '',
      realestateDescription: '',
      annualRent: '',
      monthlyRent: '',
      insuranceRatio: '',
      insuranceValue: '',
      electricityCounterNo: '',
    });
  }
  offerInformationChange() {
    if (this.realestateForm.value.hasPriceOffer == true) {
      this.showOfferInformation = true;
    } else {
      this.showOfferInformation = false;
    }
  }
  garageInformationChange() {
    if (this.realestateForm.value.hasGarage == true) {
      this.showGarageInformation = true;
    } else {
      this.showGarageInformation = false;
    }
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
  
  getMonthlyRent() {
    if (this.annualRent != null || this.annualRent != '') {
      this.monthlyRent =
        Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? (this.annualRent / 12).toFixed(this.numberOfFraction)
          : this.annualRent / 12)
    } else {
      this.monthlyRent = '';
    }
  }
  getInsuranceValue() {
    if (this.annualRent != null || this.annualRent != '') {
      this.insuranceValue =

        Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? ((this.annualRent * this.insuranceRatio) / 100).toFixed(this.numberOfFraction)
          : (this.annualRent * this.insuranceRatio) / 100)
    } else {
      this.insuranceValue = '';
    }
  }
  //
  getSystemSettings() {

    if (this.managerService.getSystemSettings().length) {
      this.showDecimalPoint = this.managerService.getSystemSettings()[0].showDecimalPoint;
      this.showThousandsComma = this.managerService.getSystemSettings()[0].showThousandsComma;
      this.showRoundingFractions = this.managerService.getSystemSettings()[0].showRoundingFractions;
      this.numberOfFraction = this.managerService.getSystemSettings()[0].numberOfFraction;
    }
  }

  //#region Toolbar Service
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
            this.onSubmit();
          } else if (currentBtn.action == ToolbarActions.New) {
            this.toolbarPathData.componentAdd = "component-names.add-realestate";
            this.sharedServices.changeToolbarPath(this.toolbarPathData);
            this.realestateForm.reset();
            navigateUrl(this.addUrl, this.router);
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
