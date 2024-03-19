import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AttributeDataTypeEnum } from 'src/app/core/constants/enumrators/enums';
import { ICustomEnum } from 'src/app/core/interfaces/ICustom-enum';
import { Attributes } from 'src/app/core/models/attributes';
import { Opportunity } from 'src/app/core/models/opportunity';
import { AppConfigService } from 'src/app/core/services/local-services/app-config.service';

@Component({
  selector: 'app-opportunity-details1',
  templateUrl: './opportunity-details1.component.html',
  styleUrls: ['./opportunity-details1.component.scss']
})
export class OpportunityDetails1Component implements OnInit, OnChanges {

  @Input() opportunity!:Opportunity;
  @Input() opportunityStatusTypes:ICustomEnum[] = [];
  @Input() attributes:Attributes[]=[];
  constructor() { }

  ngOnInit(): void {
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

  getAttributes(opportunity: Opportunity) {
    let attributes: Attributes[] = [];
    opportunity.attributesValues.forEach(a => {
      let attr = this.attributes.find(x => x.id == a.attributeId);
      if (attr) {
        let val;
        if (attr.dataType == AttributeDataTypeEnum.number) {
          val = a.valueNum;
        }
        if (attr.dataType == AttributeDataTypeEnum.string) {
          val = a.valueString;
        }
        if (attr.dataType == AttributeDataTypeEnum.date) {
          val = a.valueDate;
        }
        if (attr.dataType == AttributeDataTypeEnum['Select List']) {
          val = (a.listValuesAr + "").split(",");

        }

        let icon;

        switch(attr.iconType){
          case 1:
            icon = "../assets/images/property/bed.png";
            break;
          case 2:
            icon = "../assets/images/property/bathroom.png";
            break;
          case 3:
            attr.attributeIcon = "../assets/images/property/parking.png";
            break;
          case 4:
             
            //console.log(attr.attributeIcon);
            icon = AppConfigService.appCongif.resourcesUrl+"/"+attr.attributeIcon
            
            break;
        }

        

        attributes.push({
          id: attr.id,
          dataType: attr.dataType,
          nameAr: attr.nameAr,
          nameEn: attr.nameEn,
          selectListValuesAr: attr.selectListValuesAr,
          selectListValuesEn: attr.selectListValuesEn,
          value: val,
          valueEn: '',
          valueTo: '',
          attributeIcon:icon,
          iconType:attr.iconType
        });
      }
    });

    //console.log(attributes);
    return attributes;

  }

  opportunityAttributes:Attributes[]=[];
  ngOnChanges(changes: SimpleChanges): void {
    if(this.opportunity){
      this.opportunityAttributes = this.getAttributes(this.opportunity);
    }
  }

}
