import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { ICustomEnum } from 'src/app/core/interfaces/ICustom-enum';
import { AlertTypes, AttributeDataTypeEnum, convertEnumToArray, pursposeTypeArEnum, pursposeTypeEnum, ToolbarActions, } from 'src/app/core/constants/enumrators/enums';
import { Countries } from 'src/app/core/models/countries';
import { Cities } from 'src/app/core/models/cities';
import { Region } from 'src/app/core/models/regions';
import { Building } from 'src/app/core/models/buildings';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { getParmasFromActiveUrl, navigateUrl, } from 'src/app/core/helpers/helper';
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
import { ManagerService } from 'src/app/core/services/backend-services/manager.service';
import { OpportunityService } from 'src/app/core/services/backend-services/opportunity.setvice';
import { Opportunity } from 'src/app/core/models/opportunity';
import { Attributes } from 'src/app/core/models/attributes';
import { AttributeValues } from 'src/app/core/models/attribute-value';
import { QuickModalService } from 'src/app/shared/services/quick-modal.service';
import { OpportunityImages } from 'src/app/core/models/opportunity-images';
import { OpportunityImagesComponent } from '../opporunity-images/opporunity-images.component';
import { OpportunityType } from 'src/app/core/models/opportunity-type';

const PAGEID = 1011; // from pages table in database seeding table
@Component({
  selector: 'app-opportunity',
  templateUrl: './opportunity.component.html',
  styleUrls: ['./opportunity.component.scss'],
})
export class OpportunityComponent implements OnInit, OnDestroy, AfterViewInit {
  /*
  TagInput Configuration
   */

  limit: number = 25;

  id: any;
  opportunityImages: OpportunityImages[] = [];
  purposeTypes: ICustomEnum[] = [];
  opportunitiesTypes: OpportunityType[] = [];
  tags:string[]=[];
  constructor(
    private opportunityService: OpportunityService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private alertsService: NotificationsAlertsService,
    private sharedServices: SharedService,
    private modalService: NgbModal,
    private translate: TranslatePipe,
    private dateService: DateConverterService,
    private spinner: NgxSpinnerService,
    private managerService: ManagerService,
    private cd:ChangeDetectorRef,
    private quickModalServices: QuickModalService,
  ) {
    this.createForm();
  }
  position: { lat: number, lng: number } = { lat: 0, lng: 0 };
  opportunityForm!: FormGroup;
  attributeValues: AttributeValues[] = [];
  lang: any = '';
  countries: Countries[] = [];
  cities: Cities[] = [];
  regions: Region[] = [];
  districts: District[] = [];
  attributes: Attributes[] = [];
  addUrl: string = '/control-panel/definitions/add-opportunity';
  listUrl: string = '/control-panel/definitions/opportunities-list';
  updateUrl: string = '/control-panel/definitions/update-opportunity/';
  toolbarPathData: ToolbarPath = {
    pageId: PAGEID,
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList: "component-names.list-opportunities",
    componentAdd: "component-names.add-opportunity",
  };
  //#endregion

  //#region ngOnInit
  ngOnInit(): void {


    localStorage.setItem("PageId", PAGEID.toString());
    this.loadData();
    this.listenToOpportunitiesImages();
  }

  public ngAfterViewInit(): void {
    //this.loadMap();
  }

  displayTags(data:any){
    console.log(data);
    this.tags = [...data];
    this.cd.detectChanges();
  }
  //#endregion
  //#region Form Group
  createForm() {
    this.opportunityForm = this.fb.group({
      id: 0,
      nameAr: NAME_REQUIRED_VALIDATORS,
      nameEn: NAME_REQUIRED_VALIDATORS,
      opportunityUserId: '',
      cityId: '',
      areaSize: '',
      expireDate: '',
      createDate: '',
      countryId: '',
      regionId: '',
      districtId: '',
      longitude: 0,
      latitude: 0,
      addressDesc: '',
      price: 0,
      periodPerDay: 0,
      attributesValues: [],
      attributes: '',
      //imagePath:'',
      description: '',
      opportunitiesImages: [],
      purpose: ['', Validators.required],
      opportunityTypeId: ['', Validators.required],
      keywords: ''
    });
    this.setInitialDates();

  }

  setInitialDates() {
    this.createDate = this.dateService.getCurrentDate();
    this.expireDate = this.dateService.getCurrentDate();
  }
  get f(): { [key: string]: AbstractControl } {
    return this.opportunityForm.controls;
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
    this.spinner.show();
    Promise.all([
      this.getLanguage(),
      this.managerService.loadPagePermissions(PAGEID),
      this.managerService.loadCountries(),
      this.managerService.loadRegions(),
      this.managerService.loadCities(),
      this.managerService.loadDistricts(),
      this.managerService.loadAttributes(),
      this.managerService.loadOpportunitiesTypes()

    ]).then(a => {
      this.getPurposeTypes();
      this.countries = this.managerService.getCountries();
      this.attributes = this.managerService.getAttributes();
      this.opportunitiesTypes = this.managerService.getOpportunitiesTypes();

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
          this.getOpportunityById(params["id"]).then(a => {
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
  // getPropertyTypes() {
  //   if (this.lang == 'en') {
  //     this.propertyType = convertEnumToArray(propertyTypeEnum);
  //   }
  //   else {
  //     this.propertyType = convertEnumToArray(propertyTypeArEnum);

  //   }
  // }
  // getBuildingTypes() {
  //   if (this.lang == 'en') {
  //     this.buildingTypes = convertEnumToArray(buildingTypeEnum);
  //   }
  //   else {
  //     this.buildingTypes = convertEnumToArray(buildingTypeArEnum);

  //   }
  // }


  //#endregion
  //#region Crud Opertions

  submited: boolean = false;
  errorMessage = '';
  errorClass = '';
  setDate() {

    this.opportunityForm.controls["expireDate"].setValue(this.dateService.getDateForInsertISO_Format(this.expireDate));
    this.opportunityForm.controls["createDate"].setValue(this.dateService.getDateForInsertISO_Format(this.createDate));

  }

  
  getKeywords(){
    let keywords = ""
     
    if(this.tags.length)
    {
      keywords = this.tags.reduce((p,c,index)=>{
        if(index == this.tags.length-1){
         return p+c;  
        }
        return p+c+','
      }, '')
    }
    return keywords;
  }


  onSubmit() {
    this.submited = true;
    if (!this.opportunityForm.value.purpose) {
      this.alertsService.showError(this.translate.transform("validation-messages.purpose-required"), this.translate.transform("message-title.wrong"));
      return;
    }



    if (this.opportunityForm.valid) {
      this.opportunityForm.value.id = 0;
      this.setDate();
      this.prepareAttributeValues();
      this.opportunityForm.controls['keywords'].setValue(this.getKeywords());
      console.log(this.getKeywords());

      this.opportunityForm.controls["opportunitiesImages"].setValue(this.opportunityImages);
      //this.opportunityForm.controls["imagePath"].setValue(this.imgPath);
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
      return this.opportunityForm.markAllAsTouched();
    }
  }

  confirmSubmit() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.opportunityService
        .addWithResponse<Opportunity>('AddWithCheck?uniques=NameAr&uniques=NameEn',
          this.opportunityForm.value)
        .subscribe({
          next: (result: ResponseResult<Opportunity>) => {
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


  openQuickModal() {

    let sub = this.quickModalServices
      .showDialog(OpportunityImagesComponent)
      .subscribe((d) => {
      });
    this.subsList.push(sub);
  }

  onUpdate() {
    if (!this.opportunityForm.value.purpose) {
      this.alertsService.showError(this.translate.transform("validation-messages.purpose-required"), this.translate.transform("message-title.wrong"));
      return;
    }

    if (this.opportunityForm.value != null) {
      this.opportunityForm.value.id = this.id;
      this.setDate();
      this.prepareAttributeValuesForUpdate();
      this.opportunityForm.controls["opportunitiesImages"].setValue(this.opportunityImages);
      //this.opportunityForm.controls["imagePath"].setValue(this.imgPath);

      this.opportunityForm.controls['keywords'].setValue(this.getKeywords());
      console.log(this.getKeywords());


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
      return this.opportunityForm.markAllAsTouched();
    }
  }

  confirmUpdate() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.opportunityService.updateWithUrl("UpdateWithCheck?uniques=NameAr&uniques=NameEn", this.opportunityForm.value)
        .subscribe({
          next: (result: ResponseResult<Opportunity>) => {
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

  getOpportunityById(id: any) {

    return new Promise<void>((resolve, reject) => {
      let sub = this.opportunityService.getWithResponse<Opportunity>("GetById?id=" + id + "&includes=AttributesValues,OpportunitiesImages").subscribe({
        next: (res: ResponseResult<Opportunity>) => {

          if (res.success && res.data) {
            //const result: Building = res.data as Building;
            //this.buildingObj = { ...result };
            this.onChangeCountry(res.data.countryId);
            this.onChangeRegion(res.data.regionId);
            this.onChangeCity(res.data.cityId);
            this.sharedServices.setOpportunityImagesListData(res.data.opportunitiesImages)


            this.opportunityForm.patchValue({
              ...res.data
            });

            this.expireDate = this.dateService.getDateForCalender(res.data.expireDate);
            this.createDate = this.dateService.getDateForCalender(res.data.createDate);
            this.attributeValues = res.data.attributesValues;
            this.setAttributeValues(res.data.attributesValues);
            this.position = {
              lat: res.data.latitude ?? 0,
              lng: res.data.longitude ?? 0,
            };

            if(res.data.keywords){
               
              this.tags = res.data.keywords.split(',').filter(x=>true);
            }

            // this.imgPath = res.data.imagePath;
            // console.log(AppConfigService.appCongif.resourcesUrl+"/"+ this.imgPath);
            // this.setImageSrc(AppConfigService.appCongif.resourcesUrl+"/"+ this.imgPath);



            // this.onChangeCountry(res.data.countryId);
            // this.onChangeCity(res.data.cityId);
            // this.onChangeRegion(res.data.regionId);

            // this.expireDate = this.dateService.getDateForCalender(
            //   res.data.expireDate
            // );

            // this.createDate = this.dateService.getDateForCalender(
            //   res.data.createDate
            // );
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
      this.toolbarPathData.componentAdd = 'Update Opprtunity';
      this.sharedServices.changeToolbarPath(this.toolbarPathData);
      this.getOpportunityById(id);
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
            this.toolbarPathData.componentAdd = "component-names.add-opportunity";
            this.sharedServices.changeToolbarPath(this.toolbarPathData);
            //this.opportunityForm.reset();
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

  expireDate!: DateModel;
  getExpireDate(selectedDate: DateModel) {
    this.expireDate = selectedDate;
  }
  createDate!: DateModel;
  getCreateDate(selectedDate: DateModel) {
    this.createDate = selectedDate;
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
    this.opportunityForm.controls['longitude'].setValue(p.lng);
    this.opportunityForm.controls['latitude'].setValue(p.lat);
  }

  onDateChanged(e: DateModel, id: any) {
    let attr = this.attributes.find(x => x.id == id);
    if (attr) {
      attr.value = e;
    }
  }

  prepareAttributeValues() {
    this.attributeValues = [];
    console.log(this.attributes);

    this.attributes.forEach(a => {
      let numValue = 0;
      let stringValue: string = "";
      let listValuesAr: string = "";
      let listValuesEn: string = "";
      let dateValue: any;
      if (a.dataType == AttributeDataTypeEnum.number) {
        numValue = a.value;
      }
      if (a.dataType == AttributeDataTypeEnum.string) {
        stringValue = a.value;
      }
      if (a.dataType == AttributeDataTypeEnum.date) {
        dateValue = this.dateService.getDateForInsertISO_Format(a.value);
      }
      if (a.dataType == AttributeDataTypeEnum['Select List']) {
        if (a.value) {
          listValuesAr = (a.value as any[]).join(",");
        }
        else {
          listValuesAr = "";
        }
        if (a.valueEn) {
          listValuesEn = (a.valueEn as any[]).join(",");
        }
        else {
          listValuesEn = "";
        }


      }

      this.attributeValues.push({
        attributeId: a.id,
        opportunitId: 0,
        id: 0,
        valueDate: dateValue,
        valueNum: numValue,
        valueString: stringValue,
        listValuesAr: listValuesAr,
        listValuesEn: listValuesEn
      });


    });

    console.log(this.attributeValues);
    this.opportunityForm.controls["attributesValues"].setValue(this.attributeValues);
  }

  prepareAttributeValuesForUpdate() {


    this.attributes.forEach(a => {
      let numValue = 0;
      let stringValue: string = "";
      let listValuesAr: string = "";
      let listValuesEn: string = "";
      let dateValue: any;
      if (a.dataType == AttributeDataTypeEnum.number) {
        numValue = a.value;
      }
      if (a.dataType == AttributeDataTypeEnum.string) {
        stringValue = a.value;
      }
      if (a.dataType == AttributeDataTypeEnum.date) {
        dateValue = this.dateService.getDateForInsertISO_Format(a.value);
      }
      if (a.dataType == AttributeDataTypeEnum['Select List']) {
        if (a.value) {
          listValuesAr = (a.value as any[]).join(",");
          listValuesEn = (a.valueEn as any[]).join(",");
        }

      }

      let att = this.attributeValues.find(x => x.attributeId == a.id);

      if (att) {
        att.valueNum = numValue;
        att.listValuesAr = listValuesAr;
        att.listValuesEn = listValuesEn;
        att.valueDate = dateValue;
        att.valueString = stringValue;
      } else {
        this.attributeValues.push({
          attributeId: a.id,
          opportunitId: 0,
          id: 0,
          valueDate: dateValue,
          valueNum: numValue,
          valueString: stringValue,
          listValuesAr: listValuesAr,
          listValuesEn: listValuesEn
        });
      }




    });

    console.log(this.attributeValues);
    this.opportunityForm.controls["attributesValues"].setValue(this.attributeValues);
  }




  setAttributeValues(attributesValues: AttributeValues[]) {
    attributesValues.forEach(a => {
       
      let att = this.attributes.find(x => x.id == a.attributeId);
      if (att) {
        if (att.dataType == 1) {
          att.value = a.valueString;
        }
        else if (att.dataType == 2) {
          att.value = a.valueNum;
        }

        else if (att.dataType == 3) {
          att.value = this.dateService.getDateForCalender(a.valueDate)
        }
        else if (att.dataType == 4) {
          att.value = (a.listValuesAr + "").split(",")
          att.valueEn = (a.listValuesEn + "").split(",")

        }
      }
    });

    this.attributeValues = [...attributesValues];

  }



  listenToOpportunitiesImages() {
    let sub = this.sharedServices.getOpportunityImagesListData().subscribe({
      next: (images: OpportunityImages[]) => {
        this.opportunityImages = [];
        if (images.length > 0) {
          this.opportunityImages.push(...images)
        }
      },
    });
    this.subsList.push(sub);
  }


  getPurposeTypes() {
    if (this.lang == 'en') {
      this.purposeTypes = convertEnumToArray(pursposeTypeEnum);
    }
    else {
      this.purposeTypes = convertEnumToArray(pursposeTypeArEnum);

    }
  }










}
