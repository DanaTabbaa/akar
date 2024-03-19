import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Opportunity } from 'src/app/core/models/opportunity';
import { OpportunityImages } from 'src/app/core/models/opportunity-images';
import { AppConfigService } from 'src/app/core/services/local-services/app-config.service';
import { AttributeIcons } from 'src/app/core/constants/attribute-icons';
import { Attributes } from 'src/app/core/models/attributes';
import { WebsiteService } from 'src/app/core/services/backend-services/website.service';
import { DomSanitizer } from '@angular/platform-browser';
import Swiper from 'swiper';

@Component({
  selector: 'app-opportunity-details3',
  templateUrl: './opportunity-details3.component.html',
  styleUrls: ['./opportunity-details3.component.scss']
})
export class OpportunityDetails3Component implements OnInit {
  @Input() classStylePush = '';
  @Input() idEl:string = '';
  @Input() opportunities:Opportunity[] = [];
  @Input() options:any = {
          'col':2,
          'slider':false,
          'size':'mid',
          'pagination':true,
          'number_card_pagination':6
        };
        
  lang:string = "ar";
  groupIndexStart:number = 0;
  attributeIcons: any = new AttributeIcons();
  attributes: Attributes[] = [];
  previousPoint:number = -1;
  constructor(private router:Router,private websiteService: WebsiteService,private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    
    this.lang = localStorage.getItem("language")??"ar";
    Promise.all([this.websiteService.loadAttributes()]).then(a => {
        this.attributes = this.websiteService.getAttributes();
      });
  }
  ngAfterViewInit(): void {
    
    if(this.options.slider){
      this.initTrandingSlider();
    }
  }

  private initTrandingSlider(): void {

    new Swiper(`.tranding-slider`, {
      effect: 'coverflow',
      grabCursor: true,
      centeredSlides: true,
      centeredSlidesBounds: true,
      loop: true,
      slidesPerView: 'auto',
      coverflowEffect: {
        rotate: 0,
        stretch: 0,
        depth: 100,
        modifier: 2.5,
      },
      pagination: {
        el: '#swiper-pagination33',
        clickable: false,
        renderBullet: function (index, className) {
          return '<span class="' + className + '">' + (index + 1) + '</span>';
        },
      },
      // on: {
      //   transitionEnd: (swiper) => {
      //     const previousPointEl = document.querySelector(`#${swiper.el.id}-point-${swiper.previousIndex}`) as HTMLElement;
      //     const activePointEl = document.querySelector(`#${swiper.el.id}-point-${swiper.activeIndex}`) as HTMLElement;
          
      //     activePointEl.style.background = '#3A9DAB';
      //     activePointEl.style.transform = 'scale(1.2)';
        
      //     if (previousPointEl) {
      //       previousPointEl.style.background = ''; // Set the previous background color to its original value
      //       previousPointEl.style.transform = ''; // Set the previous transform to its original value
      //     }
      //   }
      // }
    });    
  
}
  getImage(opportunitiesImages:OpportunityImages[]){
    if(opportunitiesImages.length)
    {
      let img = opportunitiesImages[0];
      return   AppConfigService.appCongif.resourcesUrl+"/"+img.imagePath;
    }
    return "../assets/images/imag-view-home2.png";
  }
  getRangePage(opportunity: Opportunity[]): number[] {
    if(this.options.slider){
      return Array(opportunity.length).fill(0).map((_, index) => index + 1);
    }else{
      var num = Math.ceil(opportunity.length /this.options.number_card_pagination);
      return Array(num).fill(0).map((_, index) => index + 1);
    }
  }
  scrollToSlide(slideIndex: number): void {
    if(this.previousPoint != -1){
      const previousPointEl1 = document.querySelector(`#${this.idEl}-point-${this.previousPoint}`) as HTMLElement;
      previousPointEl1.classList.remove("point-active")
      if(this.previousPoint != 0){
        const previousPointEl2 = document.querySelector(`#${this.idEl}-point-${this.previousPoint-1}`) as HTMLElement;
        previousPointEl2.classList.remove("point-active")
      }
      if(this.previousPoint != this.opportunities.length -1){
        const previousPointEl3 = document.querySelector(`#${this.idEl}-point-${this.previousPoint+1}`) as HTMLElement;
        previousPointEl3.classList.remove("point-active")
      }
    }
    const PointEl1 = document.querySelector(`#${this.idEl}-point-${slideIndex}`) as HTMLElement;
    PointEl1.classList.add("point-active");
    if(slideIndex != 0){
      const PointEl2 = document.querySelector(`#${this.idEl}-point-${slideIndex-1}`) as HTMLElement;
      PointEl2.classList.add("point-active")
    }
    if(slideIndex != this.opportunities.length -1){
      const PointEl3 = document.querySelector(`#${this.idEl}-point-${slideIndex+1}`) as HTMLElement;
      PointEl3.classList.add("point-active")
    }
    
    this.previousPoint = slideIndex;

    if(this.options.slider){
      const sliderElement = document.querySelector(`#${this.idEl}`) as any;
      const swiper = sliderElement.swiper;
      const previousPointEl = document.querySelector(`#${swiper.el.id}-point-${swiper.previousIndex}`) as HTMLElement;
      swiper.slideTo(slideIndex);
    }else{
      this.groupIndexStart = this.options.number_card_pagination * slideIndex;
    }
   
  }
  gotoDetails(id){
    this.router.navigate(["details/"+id]);
  }
  getShowingOpportunities(opportunities: Opportunity[]):Opportunity[]{
    
    return opportunities.slice(this.groupIndexStart, !this.options.slider?opportunities.length > this.groupIndexStart+this.options.number_card_pagination?this.groupIndexStart+this.options.number_card_pagination:opportunities.length:this.opportunities.length);
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
