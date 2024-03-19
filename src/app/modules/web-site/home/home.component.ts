import { Component, OnInit, ElementRef,HostListener, Renderer2  } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Cities } from 'src/app/core/models/cities';
import { Offers } from 'src/app/core/models/offers';
import { OpportunitiesOffers } from 'src/app/core/models/opportunities-offers';
import { OpportunitiesSpecials } from 'src/app/core/models/opportunities-specials';
import { Opportunity } from 'src/app/core/models/opportunity';
import { OpportunityImages } from 'src/app/core/models/opportunity-images';
import { OpportunityType } from 'src/app/core/models/opportunity-type';
import { UnitsTypes } from 'src/app/core/models/units-types';
import { WebsiteService } from 'src/app/core/services/backend-services/website.service';
import { AppConfigService } from 'src/app/core/services/local-services/app-config.service';
import { ActivatedRoute } from '@angular/router';
import { ManagerService } from 'src/app/core/services/backend-services/manager.service';
import { Region } from 'src/app/core/models/regions';
import { Countries } from 'src/app/core/models/countries';


declare var $: any; // Declare $ to use jQuery
declare var jQuery: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  /**
   * 
   * 'للايجار' = 1,
  'للبيع' = 2,
  'للبيع والإيجار' = 3,
  'للإستئجار' = 4,
  'للشراء' = 5
   */
  opportunitiesTypes:OpportunityType[]=[];
  lang:string = 'ar';
  countries: Countries[] = [];
  regions: Region[] = [];
  cities:Cities[]=[];
  selectedType:any;
  selectedCountry:any;
  selectedRegion:any;
  selectedCity:any;
  purpose:number = 1;
  price:number = 0;
  searchKeywords:string="";
  offers:OpportunitiesOffers[]=[];
  specials:OpportunitiesSpecials[]=[];
  specialsOpportunities:Opportunity[]=[];
  offersOpportunities:Opportunity[]=[];
  windowWidth!: number;
  recentOpportunities:Opportunity[]=[];


  constructor(
    private websiteService:WebsiteService,
    private spinner:NgxSpinnerService,
    private router:Router,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private activatedRoute: ActivatedRoute,
    private managerService: ManagerService,
    ) {

     }

  @HostListener('window:resize', ['$event'])
  onWindowResize(event: any): void {
    this.windowWidth = event.target.innerWidth;
  }
  ngOnInit(): void {
    this.windowWidth = window.innerWidth;
    this.lang = localStorage.getItem("language")??"ar";

    
    this.spinner.show();
    Promise.all([
      this.websiteService.loadOpportunitiesTypes(),
      this.websiteService.loadOpportunitiesOffersForWebsite(),
      this.websiteService.loadOpportunitiesSpecialsForWebsite(),
      this.websiteService.loadCountries(),
      this.managerService.loadRegions(),
      this.websiteService.loadCities(),
      this.websiteService.loadRecentOpportunities()
    ]).then(a=>{
      this.spinner.hide();
      this.recentOpportunities = this.websiteService.getRecentOpportunities().slice(0,20);
      this.opportunitiesTypes = this.websiteService.getOpportunitesTypes().slice(0,20);
      this.cities = this.websiteService.getCities();
      this.countries = this.websiteService.getCountries();
      this.regions = this.managerService.getRegions();
      this.offers = this.websiteService.getOpportunitiesOffersForWebsite();
      this.specials = this.websiteService.getOpportunitiesSpecialsForWebsite();
      this.specialsOpportunities = [];
      this.offersOpportunities = [];
      this.specials.slice(0,20).forEach(s=>{
        this.specialsOpportunities.push(s.opportunity);
      });

      this.offers.forEach(o=>{
        this.offersOpportunities.push(o.opportunity);
      });
      this.makeSlider();
      console.log("this.recentOpportunities",this.recentOpportunities)
    }).catch(e=>{
      this.spinner.hide();
    });
    if (window.location.hash === '#target-section') {
      this.scrollToSection('#target-section');
    }else if(window.location.hash === '#target-section'){
      this.scrollToSection('#target-section');
    }
  }
  makeSlider():void{
    $( document ).ready(function() {
      (function () {
        "use strict";
      
        var carousels = function () {
          $(".owl-carousel1").owlCarousel({
            loop: true,
            center: true,
            margin: 0,
            responsiveClass: true,
            nav: false,
            responsive: {
              0: {
                items: 2,
                nav: false
              },
              680: {
                items: 2,
                nav: false,
                loop: false
              },
              1000: {
                items: 4,
                nav: false,
                loop: false
              }
            },
            startPosition:1
          });
        };
      
        (function ($) {
          carousels();
        })(jQuery);
      })();
      }
    )
  }
  scrollToSection(target) {
    const targetSection = this.elementRef.nativeElement.querySelector(target);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  onSelectCountry() {
    
    if (this.selectedCountry) {
      this.selectedRegion = undefined;
      this.selectedCity = undefined;
      this.cities = [];
      this.regions = this.managerService.getRegions().filter(x => x.countryId == this.selectedCountry?.id);
    }
    else {
      this.regions = this.managerService.getRegions();
    }
  }

  onSelectRegion() {
    if (this.selectedRegion) {
      this.selectedCity = undefined;
      this.cities = this.websiteService.getCities().filter(x => x.regionId == this.selectedRegion?.id);

    }
    else {
      this.cities = this.websiteService.getCities();
    }
  }
  
  gotoProperty(){
   let queryParams:any = {};
   
    queryParams.purpose = this.purpose;
    
    if(this.selectedType){
      queryParams.type = this.selectedType.id;
     }
     
    if(this.selectedCity){
      queryParams.cityId = this.selectedCity.id;
     }
  
     if(this.searchKeywords){
      queryParams.keywords = this.searchKeywords;
     }
     console.log('queryParams',queryParams);
     
    
     
     this.router.navigate(['/property'],{
      queryParams:queryParams
    });
 
  }


  setPerpose(t:number){
    this.purpose = t;
  }

  getImageSrc(img:OpportunityImages)
  {
    if(img.imagePath){
      return AppConfigService.appCongif.resourcesUrl+"/"+img.imagePath;
    }
    return "";
  }


  gotoDetails(id){
    this.router.navigate(["details/"+id]);
  }

  getImage(opportunitiesImages:OpportunityImages[]){
    if(opportunitiesImages.length)
    {
      let img = opportunitiesImages[0];
      return   AppConfigService.appCongif.resourcesUrl+"/"+img.imagePath;
    }
    return "";
  }

}
 