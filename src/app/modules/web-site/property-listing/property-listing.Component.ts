import { Component, OnDestroy, OnInit, ElementRef, HostListener, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { AttributeDataTypeEnum, convertEnumToArray, OpportunitStatusArEnum, OpportunitStatusEnum, SortByArEnum, SortByEnum } from 'src/app/core/constants/enumrators/enums';
import { ICustomEnum } from 'src/app/core/interfaces/ICustom-enum';
import { Attributes } from 'src/app/core/models/attributes';
import { Cities } from 'src/app/core/models/cities';
import { Countries } from 'src/app/core/models/countries';
import { District } from 'src/app/core/models/district';
import { Opportunity } from 'src/app/core/models/opportunity';
import { Region } from 'src/app/core/models/regions';
import { Unit } from 'src/app/core/models/units';
import { ManagerService } from 'src/app/core/services/backend-services/manager.service';
import { WebsiteService } from 'src/app/core/services/backend-services/website.service';
import { AppConfigService } from 'src/app/core/services/local-services/app-config.service';
import { DateCalculation } from 'src/app/core/services/local-services/date-services/date-calc.service';
import { MapService } from 'src/app/core/services/local-services/map.service';
import { DateModel } from 'src/app/core/view-models/date-model';
import { SearchAttributesVM } from 'src/app/core/view-models/search-attibute-vm';

@Component({
  selector: 'app-property-listing',
  templateUrl: './property-listing.component.html',
  styleUrls: ['./property-listing.component.scss']
})
export class PropertyListingComponent implements OnInit, OnDestroy {

  units: Unit[] = [];
  opportunities: Opportunity[] = [];
  attributes: Attributes[] = [];
  lang: string = "";
  opportunityStatusTypes: ICustomEnum[] = [];
  sortByTypes: ICustomEnum[] = [];
  fromPrice: number = 0;
  toPrice: number = 0;
  cities: Cities[] = [];
  countries: Countries[] = [];
  regions: Region[] = [];
  districts: District[] = [];
  subsList: Subscription[] = [];
  selectedCity?: Cities;
  selectedCountry?: Countries;
  selectedRegion?: Region;
  selectedDistrict?: District;

  keywords!: string;
  type: any;
  purpose: any;
  showFirstDiv: boolean = false;
  openSearch: boolean = false;
  windowWidth!: number;
  size: string = 'mid';
  col: number = 6;
  number_card_pagination: number = 6;



  pagination_number: number = 1;
  pagination_content_start: number = 0;
  pagination_content_page: number = 0;

  getColumn(column) {
    if (column == '1') {
      this.size = 'large'
      this.col = 12
      this.number_card_pagination = 3;
    }
    if (column == '2') {
      this.size = 'mid'
      this.col = 6;
      this.number_card_pagination = 6;
    }
    if (column == '3') {
      this.size = 'small'
      this.col = 4;
      this.number_card_pagination = 9;
    }
  }
  constructor(private websiteService: WebsiteService,
    private spinner: NgxSpinnerService,
    private dateService: DateCalculation,
    private activatedRoute: ActivatedRoute,
    private managerService: ManagerService,
    private mapService: MapService) { }

  @ViewChild('componentContainer', { static: false }) componentContainer!: ElementRef;
  @HostListener('window:resize', ['$event'])
  onWindowResize(event: any): void {
    this.windowWidth = event.target.innerWidth;
    if (this.windowWidth < 480) {
      this.size = 'mid';
      this.col = 12;
      this.number_card_pagination = 4;
    }
  }


  ngOnInit(): void {
    this.windowWidth = window.innerWidth;
    if (this.windowWidth < 480) {
      this.size = 'mid';
      this.col = 12;
      this.number_card_pagination = 4;
    }
    this.lang = localStorage.getItem('language')!;
    this.getOpportunitStatusTypes();
    this.getSortByTypes();
    this.spinner.show();
    Promise.all([this.websiteService.loadOpportunities(),
    this.websiteService.loadAttributes(),
    this.websiteService.loadCountries(),
    this.managerService.loadRegions(),
    this.websiteService.loadCities(),
    this.managerService.loadDistricts()
    ]).then(a => {
      this.spinner.hide();
      this.attributes = this.websiteService.getAttributes();
      this.opportunities = this.websiteService.getOpportunites();
      this.cities = this.websiteService.getCities();
      this.countries = this.websiteService.getCountries();
      this.regions = this.managerService.getRegions();
      this.districts = this.managerService.getDistricts();
      this.getLocationData();

      console.log("alaa", this.attributes)
      this.prepapareImageObjects(this.opportunities);
      this.getRouteData();
    }).catch(e => {
      this.spinner.hide();
    });

  }

  getLocationData() {
    let sub1 = this.mapService.getCurrentLocation().subscribe({
      next: (p) => {
        if (p) {
          let sub = this.mapService.getLocationDetails(p.coords.latitude, p.coords.longitude).subscribe({
            next: (response) => {
              // debugger
              console.log("---------------------------------------", response);
              // debugger
              this.selectedCountry = this.countries.find(x => (x.countryIsoCode + "").toLowerCase() == (response.address.country_code + "").toLowerCase());
              if (this.selectedCountry) {
                this.regions = this.managerService.getRegions().filter(x => x.countryId == this.selectedCountry?.id);
                this.selectedRegion = this.regions.find(x => (x.regionNameEn + "").toLowerCase() == (response.address.state + "").toLowerCase());
              }

              if (this.selectedRegion) {
                this.cities = this.websiteService.getCities().filter(x => x.regionId == this.selectedRegion?.id);
                this.selectedCity = this.cities.find(x => (x.cityNameEn + "").toLowerCase() == (response.address.city + "").toLowerCase());

              }

              if (this.selectedCity) {
                this.districts = this.managerService.getDistricts().filter(x => x.cityId == this.selectedCity?.id);
              }


            },
            error: (err) => {

            },
            complete: () => {

            }
          });
          this.subsList.push(sub);
        }

      }, error: (err) => {

      },
      complete: () => {

      }
    });
    this.subsList.push(sub1);
  }

  getRouteData() {
    let sub = this.activatedRoute.queryParams.subscribe({
      next: (res) => {

        if (res['keywords']) {
          this.keywords = res['keywords'];
        }

        if (res['cityId']) {
          this.selectedCity = this.cities.find(x => x.id == res['cityId']);
        }
        if (res['type']) {
          this.type = res['type'];
        }

        if (res['purpose']) {
          this.purpose = res['purpose'];
        }


        this.search();
      },
      error: (err) => { },
      complete: () => { }
    });
    this.subsList.push(sub);
  }

  prepapareImageObjects(opportunities: Opportunity[]) {


    opportunities.forEach(opportunity => {
      let imageObjects: Array<object> = [];
      let order = 0;
      opportunity.opportunitiesImages.filter(x => x.isActive).forEach(img => {
        imageObjects.push(
          {
            image: AppConfigService.appCongif.resourcesUrl + "/" + img.imagePath,
            thumbImage: AppConfigService.appCongif.resourcesUrl + "/" + img.imagePath,
            alt: img.nameAr,
            title: img.nameAr,
            order: order
          });
        order++;
      });
      opportunity.imageObjects = [...imageObjects];
      console.log(imageObjects);


    });


  }

  getImage(opportunity: Opportunity) {
    //console.log(AppConfigService.appCongif.resourcesUrl + opportunity.imagePath);
    return AppConfigService.appCongif.resourcesUrl + "/" + opportunity.imagePath;
  }

  openSearchCard() {
    this.openSearch = !this.openSearch;
  }

  imageObject: Array<object> = [{
    image: 'https://localhost:44330/Resources/Images/landscape new zealand S-shape.jpg',
    thumbImage: 'https://localhost:44330/Resources/Images/landscape new zealand S-shape.jpg',
    alt: 'alt of image',
    title: 'title of image',
    order: 1
  },
  {
    image: 'https://localhost:44330/Resources/Images/landscape new zealand S-shape.jpg',
    thumbImage: 'https://localhost:44330/Resources/Images/landscape new zealand S-shape.jpg',
    alt: 'alt of image',
    title: 'title of image',
    order: 2
  },
  {
    image: 'https://localhost:44330/Resources/Images/landscape new zealand S-shape.jpg',
    thumbImage: 'https://localhost:44330/Resources/Images/landscape new zealand S-shape.jpg',
    alt: 'alt of image',
    title: 'title of image',
    order: 3
  },
  ];


  getOpportunitStatusTypes() {
    if (this.lang == 'en') {
      this.opportunityStatusTypes = convertEnumToArray(OpportunitStatusEnum);
    }
    else {
      this.opportunityStatusTypes = convertEnumToArray(OpportunitStatusArEnum);

    }
  }


  getSortByTypes() {
    if (this.lang == 'en') {
      this.sortByTypes = convertEnumToArray(SortByEnum);
    }
    else {
      this.sortByTypes = convertEnumToArray(SortByArEnum);

    }
  }




  getAttributeName(attr: Attributes) {
    return this.lang == "ar" ? attr.nameAr : attr.nameEn;
  }

  onDateChanged(e: DateModel, id: any) {
    let attr = this.attributes.find(x => x.id == id);
    if (attr) {
      attr.value = e;
    }
  }
  onDateChangedTo(e: DateModel, id: any) {
    let attr = this.attributes.find(x => x.id == id);
    if (attr) {
      attr.valueTo = e;
    }
  }


  search() {


    let attributeSearchParameters: SearchAttributesVM[] = [];
    this.attributes.forEach(a => {
      if (a.value || a.valueEn) {
        if (a.dataType == AttributeDataTypeEnum.date) {

          attributeSearchParameters.push({
            id: a.id,
            dataType: a.dataType,
            searchValueFrom: this.dateService.getDateForInsert(a.value),
            searchValueTo: this.dateService.getDateForInsert(a.valueTo),
          });
        }
        else if (a.dataType == AttributeDataTypeEnum['Select List']) {

          let v: string = (a.valueEn as any[]).reduce((p, c, i) => {
            return p + c + ",";
          }, '');
          if (v) {
            console.log(v.substring(0, v.length - 1));
            attributeSearchParameters.push({
              id: a.id,
              dataType: a.dataType,
              searchValueFrom: v.substring(0, v.length - 1),
              searchValueTo: '',
            });
          }
        }
        else {
          attributeSearchParameters.push({
            id: a.id,
            dataType: a.dataType,
            searchValueFrom: a.value,
            searchValueTo: a.valueTo,
          });
        }
      }
    });

    let cityId = 0;
    if (this.selectedCity) {
      cityId = this.selectedCity.id;
    }
    let type = 0;
    if (this.type) {
      type = this.type;
    }

    let purpose = 0;
    if (this.purpose) {
      purpose = this.purpose;
    }


    this.spinner.show();
    this.websiteService.searchOpportunitises(
      this.fromPrice,
      this.toPrice,
      cityId, type, purpose, this.keywords ?? "", attributeSearchParameters).then(a => {
        this.spinner.hide();
        this.opportunities = this.websiteService.getSearchOpportunites();
        this.prepapareImageObjects(this.opportunities);
      }).catch(e=>{
        this.spinner.hide();
      });

  }
  switch() {
    this.showFirstDiv = !this.showFirstDiv;
  }
  ngOnDestroy(): void {
    this.subsList.forEach(s => {
      if (s) {
        s.unsubscribe();
      }
    });

    this.websiteService.destroy();
    this.managerService.destroy();
  }
  getShowingOpportunities(opportunities: Opportunity[]): Opportunity[] {
    return opportunities.slice(this.pagination_content_start, opportunities.length > this.pagination_content_start + this.number_card_pagination ? this.pagination_content_start + this.number_card_pagination : opportunities.length);
  }
  getRangePage(opportunity: Opportunity[]): number[] {
    var num = Math.ceil(opportunity.length / this.number_card_pagination);
    return Array(num).fill(0).map((_, index) => index + 1);
  }
  ceil(number: number): number {
    return Math.ceil(number);
  }
  changePagination(page: number): void {
    if (page >= 0 && page <= this.getRangePage(this.opportunities).length - 1) {
      this.pagination_content_page = page;
      this.pagination_content_start = page * this.number_card_pagination;
    }
  }

  onSelectCountry() {
    if (this.selectedCountry) {
      this.selectedRegion = undefined;
      this.selectedCity = undefined;
      this.selectedDistrict = undefined;
      this.cities = [];
      this.districts = [];
      this.regions = this.managerService.getRegions().filter(x => x.countryId == this.selectedCountry?.id);
    }
    else {
      this.regions = this.managerService.getRegions();
    }
  }

  onSelectRegion() {
    if (this.selectedRegion) {
      this.selectedCity = undefined;
      this.selectedDistrict = undefined;
      this.districts = [];
      this.cities = this.websiteService.getCities().filter(x => x.regionId == this.selectedRegion?.id);


    }
    else {
      this.cities = this.websiteService.getCities();
    }
  }

  onSelectCity() {
    if (this.selectedCity) {
      this.selectedDistrict = undefined;
      this.districts = this.managerService.getDistricts().filter(x => x.cityId == this.selectedCity?.id);
    }
    else {
      this.districts = this.managerService.getDistricts();
    }
  }
}
