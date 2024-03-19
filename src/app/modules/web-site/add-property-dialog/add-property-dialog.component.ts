import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Marker } from 'leaflet';
import { MapLayer, MapTileLayerTypes } from 'src/app/core/models/map-layers';
import * as L from 'leaflet'
import { HttpEventType } from '@angular/common/http';

import { ICustomEnum } from 'src/app/core/interfaces/ICustom-enum';
import { AlertTypes, AttributeDataTypeEnum, convertEnumToArray, pursposeTypeArEnum, pursposeTypeEnum } from 'src/app/core/constants/enumrators/enums';
import { NgxSpinnerService } from 'ngx-spinner';
import { Countries } from 'src/app/core/models/countries';
import { Cities } from 'src/app/core/models/cities';
import { Region } from 'src/app/core/models/regions';
import { District } from 'src/app/core/models/district';
import { ManagerService } from 'src/app/core/services/backend-services/manager.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NAME_REQUIRED_VALIDATORS } from 'src/app/core/constants/input-validators';
import { DateConverterService } from 'src/app/core/services/local-services/date-services/date-converter.service';
import { OpportunityType } from 'src/app/core/models/opportunity-type';
import { Attributes } from 'src/app/core/models/attributes';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { TranslatePipe } from '@ngx-translate/core';
import { AttributeValues } from 'src/app/core/models/attribute-value';
import { OpportunityImages } from 'src/app/core/models/opportunity-images';
import { Opportunity } from 'src/app/core/models/opportunity';
import { OpportunityService } from 'src/app/core/services/backend-services/opportunity.setvice';
import { ResponseResult } from 'src/app/core/models/ResponseResult';
import { Subscription } from 'rxjs';
import { UploadFilesApiService } from 'src/app/shared/services/upload-files-api.service';
import { MapService } from 'src/app/core/services/local-services/map.service';
import { WebsiteService } from 'src/app/core/services/backend-services/website.service';

const icon = L.icon({
  iconUrl: '../../../../../assets/images/map/marker-icon-website.svg',
  popupAnchor: [0, 0],
  iconAnchor: [55, 55],
});
@Component({
  selector: 'app-add-property-dialog',
  templateUrl: './add-property-dialog.component.html',
  styleUrls: ['./add-property-dialog.component.scss']
})
export class AddPropertyDialogComponent implements OnInit {
  @ViewChild("fileDropRef", { static: false })
  fileDropEl!: ElementRef;
  files: any[] = [];
  lang: string = "ar";

  onPositionSelected = { lat: 0, lng: 0 };
  defaultMapLayer: MapLayer = new MapLayer();
  mapLayerTypes: MapTileLayerTypes = new MapTileLayerTypes();
  marker!: Marker;
  map: any;
  locationDescription: string = '';
  stepper: number = 0;

  purposeTypes: ICustomEnum[] = [];
  countries: Countries[] = [];
  cities: Cities[] = [];
  regions: Region[] = [];
  districts: District[] = [];
  opportunityForm!: FormGroup;
  opportunitiesTypes: OpportunityType[] = [];
  attributes: Attributes[] = [];
  attributeValues: AttributeValues[] = [];
  tags: string[] = [];
  opportunityImages: OpportunityImages[] = [];
  subsList: Subscription[] = [];

  constructor(
    public dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private managerService: ManagerService,
    private formBuilder: FormBuilder,
    private dateService: DateConverterService,
    private alertsService: NotificationsAlertsService,
    private translate: TranslatePipe,
    private opportunityService: OpportunityService,
    private uploadFileService: UploadFilesApiService,
    private mapService:MapService
    

  ) {
    this.createForm();
  }

  getLocationData(){
    let sub1 = this.mapService.getCurrentLocation().subscribe({
      next: (p) => {
        if (p) {
         this.setLocationData(p.coords.latitude, p.coords.longitude);
        }

      }, error: (err) => {

      },
      complete: () => {

      }
    });
    this.subsList.push(sub1);
  }

  setLocationData(lat:any, lon:any){
    let sub = this.mapService.getLocationDetails(lat,lon).subscribe({
      next: (response) => {
        console.log("---------------------------------------", response);
        let selectedCountry = this.countries.find(x => (x.countryIsoCode + "").toLowerCase() == (response.address.country_code + "").toLowerCase());
        let selectedRegion:Region|undefined;
        let selectedCity:Cities|undefined;
        //let selectedDistrict:District|undefined;

        if (selectedCountry) {
          this.opportunityForm.get('countryId')?.setValue(selectedCountry.id);
          this.regions = this.managerService.getRegions().filter(x => x.countryId == selectedCountry?.id);
           selectedRegion = this.regions.find(x => (x.regionNameEn + "").toLowerCase() == (response.address.state + "").toLowerCase());
        }

        if (selectedRegion) {
          this.opportunityForm.get('regionId')?.setValue(selectedRegion.id);
          this.cities = this.managerService.getCities().filter(x => x.regionId == selectedRegion?.id);
          selectedCity = this.cities.find(x => (x.cityNameEn + "").toLowerCase() == (response.address.city + "").toLowerCase());

        }

        if (selectedCity) {
          this.opportunityForm.get('cityId')?.setValue(selectedCity.id);
          this.districts = this.managerService.getDistricts().filter(x => x.cityId == selectedCity?.id);
        }


      },
      error: (err) => {

      },
      complete: () => {

      }
    });
    this.subsList.push(sub);
  }

  ngOnInit(): void {
    this.lang = localStorage.getItem('language') ?? "ar";
   
    this.loadMap();
    this.loadData();
  }

  loadData() {

    //this.listenToLocationsDetails();
    // this.currnetUrl = this.router.url;
    // this.lang = localStorage.getItem('language')!;
    this.spinner.show();
    Promise.all([
      // this.getLanguage(),
      //this.managerService.loadPagePermissions(PAGEID),
      this.managerService.loadCountries(),
      this.managerService.loadRegions(),
      this.managerService.loadCities(),
      this.managerService.loadDistricts(),
      this.managerService.loadAttributes(),
      this.managerService.loadOpportunitiesTypes(),
      

    ]).then(a => {
      this.spinner.hide();
      this.getPurposeTypes();
      this.countries = this.managerService.getCountries();
      this.attributes = this.managerService.getAttributes();
      this.opportunitiesTypes = this.managerService.getOpportunitiesTypes();
      this.getPosition().then(pos => {
        if (this.marker) {
          this.map.removeLayer(this.marker);
        }
        this.marker = L.marker([pos.lat, pos.lng], { icon });
        this.marker.addTo(this.map);
        this.onPositionSelected.lat = pos.lat;
        this.onPositionSelected.lng = pos.lng;
        this.map.setView(L.latLng(pos.lat, pos.lng), 3);
      });

      //this.getRouteData();
      //this.changePath();
      //this.listenToClickedButton();
    }).catch((err) => {
      this.spinner.hide();
    });
  }
  ngOnDestroy() {
    this.managerService.destroy();
  }
  createForm() {
    this.opportunityForm = this.formBuilder.group({
      id: 0,
      nameAr: NAME_REQUIRED_VALIDATORS,
      nameEn: NAME_REQUIRED_VALIDATORS,
      opportunityUserId: '',
      cityId: '',
      areaSize: '',
      expireDate: '',
      createDate: this.dateService.getDateForInsertISO_Format(this.dateService.getCurrentDate()),
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

  }

  // openDialog() {
  //   const dialogRef = this.dialog.open(AddPropertyDialogComponent);

  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log(`Dialog result: ${result}`);
  //   });
  // }

  onFileDropped($event) {
    this.prepareFilesList($event);
  }

  fileBrowseHandler(event) {
    const inputElement = event.target;
    const files = inputElement.files;
    this.prepareFilesList(files);
  }


  deleteFile(index: number) {
    if (this.files[index].progress < 100) {
      console.log("Upload in progress.");
      return;
    }
    this.files.splice(index, 1);
  }

  uploadFilesSimulator(index: number) {
    // setTimeout(() => {
    //   if (index === this.files.length) {
    //     return;
    //   } else {
    //     const progressInterval = setInterval(() => {
    //       if (this.files[index].progress === 100) {
    //         clearInterval(progressInterval);
    //         this.uploadFilesSimulator(index + 1);
    //       } else {
    //         this.files[index].progress += 5;
    //       }
    //     }, 200);
    //   }
    // }, 1000);

    if (index === this.files.length) {
      return;
    }
    this.uploadFiles(index).then(a => {
      index += 1;
      this.uploadFilesSimulator(index);
    })
  }


  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.files.push(item);
    }
    this.fileDropEl.nativeElement.value = "";
    this.uploadFilesSimulator(0);

  }


  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) {
      return "0 Bytes";
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  private loadMap(): void {
    this.defaultMapLayer = this.mapLayerTypes.types[2];
    let defaultLayer = L.tileLayer(this.defaultMapLayer.tileLayerUrl, this.defaultMapLayer.options);

    this.map = L.map("leaflet-map", {
      layers: [defaultLayer],
      zoom: 5,
      center: L.latLng({ lat: 26.402439, lng: 50.050850 }),
      zoomControl: true
    });
    this.map.invalidateSize();





    L.control.layers(this.getMapTileLayers(this.mapLayerTypes, defaultLayer), undefined, {
      position: 'bottomright'
    }).addTo(this.map);
    // setTimeout(() => {
    //   this.map.invalidateSize();
    // }, 1000);

    this.map.on('click', (e) => {


      if (this.marker) {
        this.map.removeLayer(this.marker);
      }


      this.marker = L.marker([e.latlng.lat, e.latlng.lng], { icon });
      this.marker.addTo(this.map);
      this.onPositionSelected.lat = e.latlng.lat;
      this.onPositionSelected.lng = e.latlng.lng;
      this.opportunityForm.controls['longitude'].setValue(e.latlng.lng);
      this.opportunityForm.controls['latitude'].setValue(e.latlng.lat);
      this.setLocationData(this.onPositionSelected.lat, this.onPositionSelected.lng);
    })
  }
  getMapTileLayers(mapLayerTypes: MapTileLayerTypes, defaultLayer: any) {
    let baseMaps: any = {};
    baseMaps["Osm"] = defaultLayer;
    mapLayerTypes.types.forEach(s => {
      if (s.name != "OSM") {
        baseMaps[s.name] = L.tileLayer(s.tileLayerUrl, s.options);
      }


    });
    return baseMaps;
  }
  getPosition(): Promise<any> {
    return new Promise((resolve, reject) => {

      navigator.geolocation.getCurrentPosition(resp => {
        this.setLocationData( resp.coords.latitude,resp.coords.longitude )

        resolve({ lng: resp.coords.longitude, lat: resp.coords.latitude });
      },
        err => {
          reject(err);
        });
    });

  }
  backStepper(): void {
    this.stepper--;
  }
  nextStepper(): void {
    this.stepper++;
  }
  getPurposeTypes() {
    if (this.lang == 'en') {
      this.purposeTypes = convertEnumToArray(pursposeTypeEnum);
    }
    else {
      this.purposeTypes = convertEnumToArray(pursposeTypeArEnum);

    }
  }
  onChangeCountry(countryId: any) {
    console.log("alaa", this.opportunityForm)
    this.regions = this.managerService.getRegions().filter(x => x.countryId == countryId);
  }

  onChangeRegion(regionId: any) {
    this.cities = this.managerService.getCities().filter(x => x.regionId == regionId);
  }

  onChangeCity(cityId: any) {
    this.districts = this.managerService.getDistricts().filter(x => x.cityId == cityId);
  }
  onExpireDateChange(date: any) {
    const dateValue = new Date(date);
    const year = dateValue.getFullYear();
    const month = dateValue.getMonth() + 1; // Months are zero-based, so add 1
    const day = dateValue.getDate();

    const convertedDate = {
      year: year,
      month: month,
      day: day
    };
    const createDate = new Date();

    const diffInMilliseconds = dateValue.getTime() - createDate.getTime();
    const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

    this.opportunityForm.controls['expireDate'].setValue(this.dateService.getDateForInsertISO_Format(convertedDate));
    this.opportunityForm.controls['periodPerDay'].setValue(diffInDays);

  }
  getAttributeName(attr: Attributes) {
    return this.lang == "ar" ? attr.nameAr : attr.nameEn;
  }

  setDate() {

    // this.opportunityForm.controls["expireDate"].setValue(this.dateService.getDateForInsertISO_Format(this.expireDate));
    // this.opportunityForm.controls["createDate"].setValue(this.dateService.getDateForInsertISO_Format(this.createDate));

  }


  getKeywords() {
    let keywords = ""

    if (this.tags.length) {
      keywords = this.tags.reduce((p, c, index) => {
        if (index == this.tags.length - 1) {
          return p + c;
        }
        return p + c + ','
      }, '')
    }
    return keywords;
  }

  prepareImages() {
    let i = 1;
    this.opportunityImages = [];
    console.log(this.files);
    this.files.forEach(f => {
      this.opportunityImages.push({
        descriptions: '',
        id: 0,
        imagePath: f.imagePath,
        isActive: true,
        nameAr: 'صورة' + i,
        nameEn: 'image' + i
      });
      i++;
    })
  }

  onSubmit() {

    if (!this.opportunityForm.value.purpose) {
      this.alertsService.showError(this.translate.transform("validation-messages.purpose-required"), this.translate.transform("message-title.wrong"));
      return;
    }



    if (this.opportunityForm.valid) {
      this.opportunityForm.value.id = 0;
      this.setDate();
      this.prepareAttributeValues();
      this.prepareImages();
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
      this.alertsService.showError(this.translate.transform("validation-messages.invalid-data"), this.translate.transform("message-title.wrong"));
      return this.opportunityForm.markAllAsTouched();
    }
  }

  prepareAttributeValues() {
    this.attributeValues = [];
    //console.log(this.attributes);

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
        //dateValue = this.dateService.getDateForInsertISO_Format(a.value);
        dateValue = a.value;
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

  confirmSubmit() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.opportunityService
        .addWithResponse<Opportunity>('AddWithCheck',
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
              this.dialog.closeAll();

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

  //imgPath: string = "";
  //progress: number = 0;
  uploadFiles(index) {
    return new Promise<void>((acc, rej) => {
      //e.preventDefault();
      if (this.files.length === 0) {
        return;
      }

      let fileToUpload = <File>this.files[index];
      const formData: FormData = new FormData();
      formData.append('file', fileToUpload, fileToUpload.name);
      let sub = this.uploadFileService.uploadFileMethod(formData).subscribe(
        {
          next: (events: any) => {
            acc();
            if (events.type == HttpEventType.UploadProgress) {
              this.files[index].progress = Math.round(100 * events.loaded / events.total);
              //console.log(this.progress);
            }
            else if (events.type == HttpEventType.Response) {
              //this.message = "Upload Success";

              this.files[index].imagePath = events.body['dbPath'];
              //console.log(this.imgPath);
              this.showResponseMessage(true, AlertTypes.success, "");

              //this.onUploadFinshed.emit(events.body);
            }

          }, error: (err) => {
            acc();
          }
        });
      this.subsList.push(sub);
    });



  }
}
