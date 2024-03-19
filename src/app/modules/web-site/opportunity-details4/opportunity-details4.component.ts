import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbCarousel, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Opportunity } from 'src/app/core/models/opportunity';
import { OpportunityImages } from 'src/app/core/models/opportunity-images';
import { AppConfigService } from 'src/app/core/services/local-services/app-config.service';

@Component({
  selector: 'app-opportunity-details4',
  templateUrl: './opportunity-details4.component.html',
  styleUrls: ['./opportunity-details4.component.scss']
})
export class OpportunityDetails4Component implements OnInit {
  @Input() opportunity:Opportunity = new Opportunity();

  constructor() { }



  ngOnInit(): void {
  }

  getImagePath(img:OpportunityImages)
  {
    if(img.imagePath)
    {
      console.log(AppConfigService.appCongif.resourcesUrl+"/"+img.imagePath);
      return AppConfigService.appCongif.resourcesUrl+"/"+img.imagePath;
    }
    return "";
  }

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
    nav: true
  }

}
