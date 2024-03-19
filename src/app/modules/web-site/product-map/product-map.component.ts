import { Component, ComponentFactoryResolver, EventEmitter, Injector, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import {
  OnDestroy,
  AfterViewInit
} from '@angular/core';

import { Observable, Subscriber, Subscription } from 'rxjs';
import { AppConfigService } from 'src/app/core/services/local-services/app-config.service';
import { OpportunityImages } from 'src/app/core/models/opportunity-images';

import { SharedService } from 'src/app/shared/services/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';

import { WebsiteService } from 'src/app/core/services/backend-services/website.service';
import { Opportunity } from 'src/app/core/models/opportunity';
import { ICustomEnum } from 'src/app/core/interfaces/ICustom-enum';
import { convertEnumToArray, OpportunitStatusArEnum, OpportunitStatusEnum } from 'src/app/core/constants/enumrators/enums';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Cities } from 'src/app/core/models/cities';
import { OpportunityType } from 'src/app/core/models/opportunity-type';
import { AttributeIcons } from 'src/app/core/constants/attribute-icons';
import { Attributes } from 'src/app/core/models/attributes';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-product-map',
  templateUrl: './product-map.component.html',
  styleUrls: ['./product-map.component.scss']
})


export class ProductMapComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {

  opportunities: Opportunity[] = [];
  opportunitiesTypes:OpportunityType[]=[];
  opportunityStatusTypes: ICustomEnum[] = [];
  lang: string = "ar";

  subsList: Subscription[] = [];
  opportunityId:any;
  purpose:any;
  selectedCity:any;
  selectedType:any;
  statusType:any;
  price:number = 0;
  searchKeywords:string="";
  cities:Cities[]=[];
  pagination_number:number = 1;
  pagination_content_number:number = 4;
  pagination_content_start:number = 0;
  pagination_content_page:number = 0;
  
  status = [
    {id: 1, nameEn: 'For Rent',nameAr: 'للايجار'},
    {id: 2, nameEn: 'For Sell',nameAr: 'للبيع'},
    {id: 3, nameEn: 'For Sell & Rent',nameAr: 'للبيع والإيجار'},
    {id: 4, nameEn: 'For Want to Rent',nameAr: 'للإستئجار"'},
    {id: 5, nameEn: 'For Buy',nameAr: 'للشراء"'},
  ];
  attributes: Attributes[] = [];
  attributeIcons: any = new AttributeIcons();

  constructor(private sharedService: SharedService,
    private websiteService: WebsiteService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector,
    private activatedRoute: ActivatedRoute,
    private router:Router,
    private spinner:NgxSpinnerService,
    private sanitizer: DomSanitizer) {

  }

  ngOnInit(): void {
    this.spinner.show();
    this.lang = localStorage.getItem('language') ?? "ar";
    this.getOpportunitStatusTypes();
    Promise.all([
      this.websiteService.loadOpportunitiesTypes(),
      this.websiteService.loadCities(),
      this.websiteService.loadAttributes(),
      this.websiteService.loadOpportunities()
      
    ]).then(a=>{
      this.spinner.hide();
      this.opportunitiesTypes = this.websiteService.getOpportunitesTypes();
      this.cities = this.websiteService.getCities();
      this.attributes = this.websiteService.getAttributes();
      this.opportunities = this.websiteService.getOpportunites();
    }).catch(e=>{
      this.spinner.hide();
    });


  }



  public ngAfterViewInit(): void {
  }
  ngOnChanges(changes: SimpleChanges): void {
  }

  getImage(opportunitiesImages:OpportunityImages[]){
    if(opportunitiesImages.length)
    {
      let img = opportunitiesImages[0];
      return   AppConfigService.appCongif.resourcesUrl+"/"+img.imagePath;
    }
    return "../assets/images/imag-view-home2.png";
  }


  ngOnDestroy(): void {
    this.websiteService.destroy();

    this.subsList.forEach(s=>{
      if(s){
        s.unsubscribe();
      }
    });
  }



  getOpportunitStatusTypes() {
    if (this.lang == 'en') {
      this.opportunityStatusTypes = convertEnumToArray(OpportunitStatusEnum);
    }
    else {
      this.opportunityStatusTypes = convertEnumToArray(OpportunitStatusArEnum);

    }
  }



  getStatusName(opportunity: Opportunity) {
    let op = this.opportunityStatusTypes.find(x => x.id == opportunity.status);
    if (op) {
      return op.name;
    }
    else {
      return this.opportunityStatusTypes[0].name;
    }



  }
  gotoProperty(){
    let queryParams:any = {};
    
    if(this.selectedCity){
     queryParams.cityId = this.selectedCity;
    }
 
    if(this.selectedType){
     queryParams.type = this.selectedType;
    }
    if(this.purpose){
      queryParams.purpose = this.purpose;
     }
    
 
    if(this.price){
     queryParams.price = this.price;
 
    }
 
    if(this.searchKeywords){
     queryParams.keywords = this.searchKeywords;
 
    }
     this.router.navigate(['/property'],{
       queryParams:queryParams
     });
   }
   
   getShowingOpportunities(opportunities: Opportunity[]):Opportunity[]{ 
    return opportunities.slice(this.pagination_content_start, opportunities.length > this.pagination_content_start+this.pagination_content_number?this.pagination_content_start+this.pagination_content_number:opportunities.length);
  }
  getRangePage(opportunity: Opportunity[]): number[] {
      var num = Math.ceil(opportunity.length /this.pagination_content_number);
      return Array(num).fill(0).map((_, index) => index + 1);
  }
  ceil(number:number):number{
    return Math.ceil(number);
  }
  changePagination(page:number):void{
    if(page>=0 && page <= this.getRangePage(this.opportunities).length -1 ){
      this.pagination_content_page = page;
      this.pagination_content_start = page * this.pagination_content_number;
    }
  }
  getIconAttr(iconId:Number):any{
    
    return this.sanitizer.bypassSecurityTrustHtml(this.attributeIcons.icons.find(obj => (this.attributes
      .find(attrObj => attrObj.iconType === obj.id))?.id == iconId
    )?.svg??'');
  }
  getFirst3AttrNumber(attr:any):any{
    return (attr
    .filter(obj => this.attributes
      .filter(attrObj => attrObj.id === obj.attributeId)
      .map(mappedObj => mappedObj!.dataType)
      .includes(2)
    )).filter(obj => this.attributeIcons.icons
      .filter(attrObj => attrObj.id === obj.id)
    )
    .slice(0, 3);
  }
}
