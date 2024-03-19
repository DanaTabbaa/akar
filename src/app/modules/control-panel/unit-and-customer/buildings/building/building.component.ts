import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit
} from '@angular/core';
import { Subscription } from 'rxjs';
import { Realestate } from 'src/app/core/models/realestates';
import { ICustomEnum } from 'src/app/core/interfaces/ICustom-enum';
import {
  accountType,
  AlertTypes,
  buildingTypeEnum,
  buildingTypeArEnum,
  convertEnumToArray,
  propertyTypeEnum,
  propertyTypeArEnum,
  ToolbarActions,
} from 'src/app/core/constants/enumrators/enums';
import { Countries } from 'src/app/core/models/countries';
import { Cities } from 'src/app/core/models/cities';
import { Region } from 'src/app/core/models/regions';
import { Floor } from 'src/app/core/models/floors';
import { BuildingsService } from 'src/app/core/services/backend-services/buildings.service';
import { Building } from 'src/app/core/models/buildings';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  FormGroup
} from '@angular/forms';
import { CostCenters } from 'src/app/core/models/cost-centers';
import { Owner } from 'src/app/core/models/owners';
import { Office } from 'src/app/core/models/offices';
import {
  getParmasFromActiveUrl,
  navigateUrl,
} from 'src/app/core/helpers/helper';
import { ResponseResult } from 'src/app/core/models/ResponseResult';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageModalComponent } from 'src/app/shared/message-modal/message-modal.component';
import { ConfirmMessage } from 'src/app/core/interfaces/confirm-message';
import { TranslatePipe } from '@ngx-translate/core';
import { DateModel } from 'src/app/core/view-models/date-model';
import { NgxSpinnerService } from 'ngx-spinner';
import { DateConverterService } from 'src/app/core/services/local-services/date-services/date-converter.service';
import { NAME_REQUIRED_VALIDATORS } from 'src/app/core/constants/input-validators';
import { District } from 'src/app/core/models/district';
import { Accounts } from 'src/app/core/models/accounts';
import { ManagerService } from 'src/app/core/services/backend-services/manager.service';
const PAGEID = 7; // from pages table in database seeding table
@Component({
  selector: 'app-building',
  templateUrl: './building.component.html',
  styleUrls: ['./building.component.scss'],
})
export class BuildingComponent implements OnInit, OnDestroy, AfterViewInit {

  id: any;
  constructor(
    private buildingsService: BuildingsService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private alertsService: NotificationsAlertsService,
    private sharedServices: SharedService,
    private modalService: NgbModal,
    private translate: TranslatePipe,
    private dateService: DateConverterService,
    private spinner: NgxSpinnerService,
    private managerService: ManagerService
  ) {
    this.createbuildingForm();
  }
  //#endregion
  position: { lat: number, lng: number } = { lat: 0, lng: 0 };
  //#region Main Declarations
  buildingForm!: FormGroup;
  lang: any = '';
  floorIds: any = '';
  //mainRealestateGroup: Realestate[] = [];
  realestateGroup: Realestate[] = [];
  //subRealestateGroup: Realestate[] = [];
  offices: Office[] = [];
  owners: Owner[] = [];
  floors: Floor[] = [];
  selectedFloors: Floor[] = [];
  realestateList: Realestate[] = [];
  countries: Countries[] = [];
  searchCountries: Countries[] = [];
  cities: Cities[] = [];
  regions: Region[] = [];
  districts: District[] = [];
  floorsListSelected: Floor[] = [];
  costCenters: CostCenters[] = [];
  deferredRevenueAccounts: Accounts[] = [];
  accuredRevenueAccounts: Accounts[] = [];
  taxAccounts: Accounts[] = [];
  insuranceAccounts: Accounts[] = [];
  serviceAccounts: Accounts[] = [];
  building: Building[] = [];
  propertyType: ICustomEnum[] = [];
  buildingTypes: ICustomEnum[] = [];
  //Response!: ResponseResult<Building>;
  //buildingObj: Building = {} as Building;
  addUrl: string = '/control-panel/definitions/add-building';
  listUrl: string = '/control-panel/definitions/buildings';
  updateUrl: string = '/control-panel/definitions/update-building/';
  toolbarPathData: ToolbarPath = {
    pageId: PAGEID,
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList: "component-names.list-buildings",
    componentAdd: "component-names.add-building",
  };
  //#endregion

  //#region ngOnInit
  ngOnInit(): void {

    localStorage.setItem("PageId", PAGEID.toString());
    this.loadData();
  }

  public ngAfterViewInit(): void {
    //this.loadMap();
  }
  //#endregion
  //#region Form Group
  createbuildingForm() {
    this.buildingForm = this.fb.group({
      id: 0,
      buildingNameAr: NAME_REQUIRED_VALIDATORS,
      buildingNameEn: NAME_REQUIRED_VALIDATORS,
      ownerId: '',
      cityId: '',
      areaSize: '',
      realestateId: '',
      subRealestateId: '',
      officeId: '',
      unitNumber: '',
      galleriesNumber: '',
      parkingSlotsNumber: '',
      subParkingNumber: '',
      elevatorNumber: '',
      propertyType: '',
      roleNumber: '',
      deedNumber: '',
      propertyDeedDate: '',
      permitNumber: '',
      permitDate: '',
      buildingAddress: '',
      countryId: '',
      regionId: '',
      costCenterId: '',
      deferredRevenueAccountId: '',
      accuredRevenueAccountId: '',
      taxAccountId: '',
      insuranceAccountId: '',
      serviceAccountId: '',
      buildingLicenseNumber: '',
      propertyInstrument: '',
      propertyInstrumentDate: '',
      issueDate: '',
      buildingType: '',
      issuePlace: '',
      issuer: '',
      districtId: '',
      floorIds: '',
      lat: 0,
      lng: 0,
      locationDescription: ''

    });
    this.setInitialDates();

  }

  setInitialDates() {
    this.permitDate = this.dateService.getCurrentDate();
    this.issueDate = this.dateService.getCurrentDate();
    this.propertyDeedDate = this.dateService.getCurrentDate();
  }
  get f(): { [key: string]: AbstractControl } {
    return this.buildingForm.controls;
  }
  //#endregion
  //#region ngOnDestory
  ngOnDestroy() {
    this.managerService.destroy();
    this.subsList.forEach((s) => {
      if (s) {
        s.unsubscribe();
      }
    });
    this.createbuildingForm();
    localStorage.removeItem("PageId");
    localStorage.removeItem("RecordId");
  }
  //#endregion

  //#region Basic Data
  currnetUrl;

  loadData() {

    //this.listenToLocationsDetails();

    this.currnetUrl = this.router.url;

    this.lang = localStorage.getItem('language')!;
    this.getPropertyTypes();
    this.getBuildingTypes();

    this.spinner.show();
    Promise.all([
      this.getLanguage(),
      this.managerService.loadPagePermissions(PAGEID),
      this.managerService.loadAccounts(),
      this.managerService.loadCostCenters(),
      this.managerService.loadRealestate(),
      this.managerService.loadOffices(),
      this.managerService.loadOwners(),
      this.managerService.loadCountries(),
      this.managerService.loadFloors(),
      this.managerService.loadRegions(),
      this.managerService.loadCities(),
      this.managerService.loadDistricts()

    ]).then(a => {
      this.countries = this.managerService.getCountries();
      this.owners = this.managerService.getOwners();
      this.offices = this.managerService.getOffices();
      this.costCenters = this.managerService.getCostCenters();
      this.realestateGroup = this.managerService.getRealestates();
      this.floors = this.managerService.getFloors();
      this.getAccounts();
      this.getRouteData();
      this.changePath();
      this.listenToClickedButton();
    }).catch((err) => {
      this.spinner.hide();
    });
  }

  getRouteData() {
    let sub = this.route.params.subscribe((params) => {
      if (params["id"]) {
        this.id = params["id"];
        if (this.id > 0) {
          this.getbuildingById(params["id"]).then(a => {
            this.spinner.hide();
            this.sharedServices.changeButton({ action: 'Update', submitMode: false } as ToolbarData);
            localStorage.setItem("RecordId", params["id"]);
          }).catch(err => {
            this.spinner.hide();
          });
        } else {
          this.sharedServices.changeButton({ action: 'New' } as ToolbarData);
          this.spinner.hide();
        }

      }
      else {
         
        this.sharedServices.changeButton({ action: 'New' } as ToolbarData);
        this.spinner.hide();
      }

    });
    this.subsList.push(sub);
  }


  //#endregion
  getLanguage() {
    return new Promise<void>((acc, rej) => {
      let sub = this.sharedServices.getLanguage().subscribe({
        next: (res) => {
          this.lang = res;
          acc();

        },
        error: (err) => {
          acc();
        }
      });
      this.subsList.push(sub);
    })

  }
  getPropertyTypes() {
    if (this.lang == 'en') {
      this.propertyType = convertEnumToArray(propertyTypeEnum);
    }
    else {
      this.propertyType = convertEnumToArray(propertyTypeArEnum);

    }
  }
  getBuildingTypes() {
    if (this.lang == 'en') {
      this.buildingTypes = convertEnumToArray(buildingTypeEnum);
    }
    else {
      this.buildingTypes = convertEnumToArray(buildingTypeArEnum);

    }
  }

  getAccounts() {

    this.deferredRevenueAccounts = this.managerService.getAccounts().filter((x) => x.accountType == accountType['Deferred Revenue']);
    this.accuredRevenueAccounts = this.managerService.getAccounts().filter((x) => x.accountType == accountType['Accured Revenue']);
    this.taxAccounts = this.managerService.getAccounts().filter((x) => x.accountType == accountType.Tax);
    this.insuranceAccounts = this.managerService.getAccounts().filter((x) => x.accountType == accountType.Insurance)
    this.serviceAccounts = this.managerService.getAccounts().filter((x) => x.accountType == accountType.Service);

  }
  //#endregion
  //#region Crud Opertions

  submited: boolean = false;
  errorMessage = '';
  errorClass = '';
  setDate() {
    this.buildingForm.value.permitDate =
      this.dateService.getDateForInsertISO_Format(this.permitDate);
    this.buildingForm.value.propertyDeedDate =
      this.dateService.getDateForInsertISO_Format(this.propertyDeedDate);
    this.buildingForm.value.issueDate =
      this.dateService.getDateForInsertISO_Format(this.issueDate);
  }

  onSubmit() {
    this.submited = true;
    if (this.buildingForm.valid) {
      this.buildingForm.value.id = 0;
      this.setDate()
      this.setInputData()
      this.buildingForm.value.floorIds = this.floorIds;
      this.spinner.show();
      this.confirmSubmit().then(a => {
        this.spinner.hide();
      }).catch(err => {
        this.spinner.hide();
      });

    } else {
      this.errorMessage = this.translate.transform("validation-messages.invalid-data");
      this.errorClass = 'errorMessage';
      this.alertsService.showError(this.errorMessage, this.translate.transform("message-title.wrong"));
      return this.buildingForm.markAllAsTouched();
    }
  }

  confirmSubmit() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.buildingsService
        .addWithResponse<Building>('AddWithCheck?uniques=BuildingNameAr&uniques=BuildingNameEn',
          this.buildingForm.value)
        .subscribe({
          next: (result: ResponseResult<Building>) => {
            resolve();
            if (result.success && !result.isFound) {
              this.showResponseMessage(
                result.success,
                AlertTypes.success,
                this.translate.transform("messages.add-success")
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
                this.translate.transform("messages.error")
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

  onUpdate() {

    if (this.buildingForm.value != null) {
      this.buildingForm.value.id = this.id;
      this.buildingForm.value.permitDate =
        this.dateService.getDateForInsertISO_Format(this.permitDate);
      this.buildingForm.value.propertyDeedDate =
        this.dateService.getDateForInsertISO_Format(this.propertyDeedDate);
      this.buildingForm.value.issueDate =
        this.dateService.getDateForInsertISO_Format(this.issueDate);
      this.setInputData()
      this.buildingForm.value.floorIds = this.floorIds;
      this.spinner.show();
      this.confirmUpdate().then(a => {
        this.spinner.hide();
      }).catch(err => {
        this.spinner.hide();
      });

    } else {
      this.errorMessage = this.translate.transform("validation-messages.invalid-data");
      this.errorClass = 'errorMessage';
      this.alertsService.showError(this.errorMessage, this.translate.transform("message-title.wrong"));
      return this.buildingForm.markAllAsTouched();
    }
  }

  confirmUpdate() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.buildingsService.updateWithUrl("UpdateWithCheck?uniques=BuildingNameAr&uniques=BuildingNameEn", this.buildingForm.value).subscribe({
        next: (result: ResponseResult<Building>) => {
          if (result.isFound) {
            this.showResponseMessage(
              result.success,
              AlertTypes.warning,
              this.translate.transform("messages.record-exsiting")
            );
          }
          else if (result.success) {
            this.showResponseMessage(
              result.success,
              AlertTypes.success,
              this.translate.transform("messages.update-success")
            );
            navigateUrl(this.listUrl, this.router);
          }
          else {
            this.showResponseMessage(
              result.success,
              AlertTypes.error,
              result.message
            );
          }
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
  setInputData() {

     
    this.floorIds = "";
    this.selectedFloors.forEach(c => {
      this.floorIds += c.id + ",";
    })

    this.floorIds = this.floorIds.substring(0, this.floorIds.length - 1);

  }
  getbuildingById(id: any) {

    return new Promise<void>((resolve, reject) => {
      let sub = this.buildingsService.getWithResponse<Building>("GetById?id=" + id).subscribe({
        next: (res: ResponseResult<Building>) => {

          if (res.success && res.data) {
            //const result: Building = res.data as Building;
            //this.buildingObj = { ...result };
            this.onChangeCountry(res.data.countryId);
            this.onChangeRegion(res.data.regionId);
            this.onChangeCity(res.data.cityId);

            this.buildingForm.setValue({
              id: res.data.id,
              buildingNameAr: res.data.buildingNameAr,
              buildingNameEn: res.data.buildingNameEn,
              ownerId: res.data.ownerId,
              cityId: res.data.cityId,
              areaSize: res.data.areaSize,
              realestateId: res.data.realestateId,
              subRealestateId: res.data.subRealestateId,
              officeId: res.data.officeId,
              unitNumber: res.data.unitNumber,
              galleriesNumber: res.data.galleriesNumber,
              parkingSlotsNumber: res.data.parkingSlotsNumber,
              subParkingNumber: res.data.subParkingNumber,
              elevatorNumber: res.data.elevatorNumber,
              propertyType: res.data.propertyType,
              roleNumber: res.data.roleNumber,
              deedNumber: res.data.deedNumber,
              propertyDeedDate: res.data.propertyDeedDate,
              permitNumber: res.data.permitNumber,
              permitDate: res.data.permitDate,
              buildingAddress: res.data.buildingAddress,
              countryId: res.data.countryId,
              regionId: res.data.regionId,
              costCenterId: res.data.costCenterId,
              deferredRevenueAccountId: res.data.deferredRevenueAccountId,
              accuredRevenueAccountId: res.data.accuredRevenueAccountId,
              taxAccountId: res.data.taxAccountId,
              insuranceAccountId: res.data.insuranceAccountId,
              serviceAccountId: res.data.serviceAccountId,
              buildingLicenseNumber: res.data.buildingLicenseNumber,
              propertyInstrument: res.data.propertyInstrument,
              propertyInstrumentDate: res.data.propertyInstrumentDate,
              issueDate: res.data.issueDate,
              buildingType: res.data.buildingType,
              issuePlace: res.data.issuePlace,
              issuer: res.data.issuer,
              districtId: res.data.districtId,
              floorIds: res.data.floorIds,
              lat: res.data.lat ?? 0,
              lng: res.data.lng ?? 0,
              locationDescription: res.data.locationDescription ?? ''
            });
            this.position = {
              lat: res.data.lat ?? 0,
              lng: res.data.lng ?? 0,
            }
            //this.floorIds = res.data.floorIds;
            // this.floorIds = JSON.parse("[" + result.floorIds + "]");
             
            this.floorIds = res.data.floorIds;
            //  this.selectedFloors = this.floorIds;
            if (this.floorIds != '' && this.floorIds != null) {
               
              var spiltedIds: string[] = [];
              this.selectedFloors = [];
              spiltedIds = this.floorIds.split(',');
              for (var i = 0; i <= spiltedIds.length - 1; i++) {
                let f = this.floors.find((x) => x?.id == parseInt(spiltedIds[i]))!
                if (f) {
                  this.selectedFloors.push(f);
                }

              }
            }
            this.floorIds = '';
            this.onChangeCountry(res.data.countryId);
            this.onChangeCity(res.data.cityId);
            this.onChangeRegion(res.data.regionId);

            this.permitDate = this.dateService.getDateForCalender(
              res.data.permitDate
            );
            this.propertyDeedDate = this.dateService.getDateForCalender(
              res.data.propertyDeedDate
            );
            this.issueDate = this.dateService.getDateForCalender(
              res.data.issueDate
            );
          }
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
  //#endregion
  //#region Helper functions

  getParamsFromUrl() {
    let params = getParmasFromActiveUrl(this.route);
    let id = params?.get('id');
    if (id != null) {
      this.toolbarPathData.componentAdd = 'Update Building';
      this.sharedServices.changeToolbarPath(this.toolbarPathData);
      this.getbuildingById(id);
      this.id = id;
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
  confirmMessage!: ConfirmMessage;
  showConfirmMessage(confirmMessage: ConfirmMessage) {
    const modalRef = this.modalService.open(MessageModalComponent);
    modalRef.componentInstance.message = confirmMessage.message;
    modalRef.componentInstance.title = confirmMessage.title;
    modalRef.componentInstance.isYesNo = confirmMessage.isYesNo;
    modalRef.componentInstance.btnConfirmTxt = confirmMessage.btnConfirmTxt;
    modalRef.componentInstance.btnClass = confirmMessage.btnClass;
    return modalRef.result;
  }
  //#endregion

  //#region Toolbar Service
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
            this.onSubmit();
          } else if (currentBtn.action == ToolbarActions.New) {
            this.toolbarPathData.componentAdd = "component-names.add-building";
            this.sharedServices.changeToolbarPath(this.toolbarPathData);
            //this.buildingForm.reset();
            this.router.navigate([this.addUrl]);
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

  //#region  Date Picker functions
  permitDate!: DateModel;
  getPermitDate(selectedDate: DateModel) {
    this.permitDate = selectedDate;
  }
  propertyDeedDate!: DateModel;
  getPropertyDeedDate(selectedDate: DateModel) {
    this.propertyDeedDate = selectedDate;
  }
  issueDate!: DateModel;
  getIssueDate(selectedDate: DateModel) {
    this.issueDate = selectedDate;
  }
  onChangeCountry(countryId: any) {

    this.regions = this.managerService.getRegions().filter(x => x.countryId == countryId);
  }

  onChangeRegion(regionId: any) {
    this.cities = this.managerService.getCities().filter(x => x.regionId == regionId);
  }

  onChangeCity(cityId: any) {
    this.districts = this.managerService.getDistricts().filter(x => x.cityId == cityId);
  }

  onPositionSelected(p: { lat: any, lng: any }) {

    this.buildingForm.controls['lng'].setValue(p.lng);
    this.buildingForm.controls['lat'].setValue(p.lat);
  }

}
