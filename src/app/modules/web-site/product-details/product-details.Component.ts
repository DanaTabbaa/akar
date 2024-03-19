import { Component,ViewChild, OnDestroy, OnInit } from '@angular/core';
import { OpportunityService } from 'src/app/core/services/backend-services/opportunity.setvice';
import { Subscription } from 'rxjs';
import { Opportunity } from 'src/app/core/models/opportunity';
import { ActivatedRoute } from '@angular/router';
import { OpportunityImages } from 'src/app/core/models/opportunity-images';
import { AppConfigService } from 'src/app/core/services/local-services/app-config.service';
import { WebsiteService } from 'src/app/core/services/backend-services/website.service';
import { Attributes } from 'src/app/core/models/attributes';
import { DomSanitizer,SafeHtml } from '@angular/platform-browser';
import { AttributeIcons } from 'src/app/core/constants/attribute-icons';
import { AttributeValues } from 'src/app/core/models/attribute-value';
import { AttributeDataTypeEnum} from 'src/app/core/constants/enumrators/enums';
import { DateConverterService } from 'src/app/core/services/local-services/date-services/date-converter.service';


@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit, OnDestroy {

  activeIndex: number = 0;
  subsList: Subscription[] = [];
  attributes: Attributes[] = [];
  attributeIcons: any = new AttributeIcons();
  attributeValues ;
  opportunities?: Opportunity;
  opportunityId:any;
  opportunity?: Opportunity;
  lang:string="ar";
  @ViewChild('mapRef') someElement;

  constructor(private opportuntiyService: OpportunityService,
    private activatedRoute: ActivatedRoute,
    private websiteService: WebsiteService,
    private sanitizer: DomSanitizer
    ) { }

  ngOnInit(): void {    
    this.lang = localStorage.getItem("language")??"ar";
    this.getRouteData();
    
    this.websiteService.loadOpportunities().then(a => {
        
      if(this.opportunityId)
      {
        this.opportunities = this.websiteService.getOpportunites().filter(x=>x.id == this.opportunityId)[0];
      }
    });

    Promise.all([this.websiteService.loadOpportunities(),
      this.websiteService.loadAttributes(),
      ]).then(a => {
        this.attributes = this.websiteService.getAttributes();
  
      })

  }
  
  prepareAttributeValues() {
    this.attributeValues = [];

    this.attributes.forEach(a => {
     this.opportunities?.attributesValues.forEach(b =>{

      if(a.id == b.attributeId){
        
        this.attributeValues.push({
        attributeId: a.id,
        opportunitId: b.opportunitId,
        nameEn: a.nameEn,
        nameAr:a.nameAr,
        dataType:a.dataType,
        valueDate: b.valueDate,
        valueNum: b.valueNum,
        valueString: b.valueString,
        listValuesAr: b.listValuesAr,
        listValuesEn: b.listValuesEn
      });
      }   
     })
    });

  }
  
  
  
  getIconAttr(iconId:Number):any{
    
    return this.sanitizer.bypassSecurityTrustHtml(this.attributeIcons.icons.find(obj => (this.attributes
      .find(attrObj => attrObj.iconType === obj.id))?.id == iconId
    )?.svgDetails??'');
  }
  getPurposeName(purpose :number){
    // console.log('this.attributes',this.attributes);
   this.prepareAttributeValues();
    let type =''
    if(purpose ==1){
      type= 'For Rent'
    }else if(purpose ==2){
      type= 'For Sell'
    }else if(purpose ==3){
      type= 'For Sell & Rent'
      
    }else if(purpose ==4){
      type= 'For Want to Rent'
    }
    
    return type
  }

  getRouteData() {
    let sub = this.activatedRoute.params.subscribe({
      next: (res) => {
        if (res) {
          if (res['id']) {
            // this.getOpportuniyById(res['id']);
            this.opportunityId =res['id']
          }
        }

      },
      error: (err) => { },
      complete: () => { }
    });
    this.subsList.push(sub);
  }


  // getOpportuniyById(id: any) {
  //   return new Promise<void>((resolve, reject) => {
  //     let sub = this.opportuntiyService.getWithResponseForWebsite<Opportunity>("GetByIdForWebsite?id=" + id).subscribe({
  //       next: (res) => {
  //         console.log("Opportunity Details is ==============================", res);
  //         if (res.data) {
  //           this.opportunity = res.data;
  //           this.someElement.openMark(this.opportunity?.id);
  //         }
  //       },
  //       error: (err) => { },
  //       complete: () => { }
  //     });
  //     this.subsList.push(sub);
  //   });
  // }
  


  ngOnDestroy(): void {
    this.subsList.forEach(s => {
      if (s) {
        s.unsubscribe();
      }
    });
  }

  getIsActive(i: number) {
    if (i == this.activeIndex) {
      return 'active';
    }
    return '';
  }

  setActiveIndex(i: number) {
    this.activeIndex = i;
  }

  getImage(img: OpportunityImages) {    
    if (img.imagePath) {
      return AppConfigService.appCongif.resourcesUrl + "/" + img.imagePath;
    }
    return "";
  }

  getBannerImgSrc(i:number){

    if(this.opportunities?.opportunitiesImages?.length)
    {
      if(this.opportunities.opportunitiesImages[i].imagePath)
      {
        return AppConfigService.appCongif.resourcesUrl+"/"+this.opportunities.opportunitiesImages[i].imagePath;
      }
    }

    return "";
  }
  
}
