import { Component, Input, OnInit } from '@angular/core';
import { AttributeDataTypeEnum, convertEnumToArray, OpportunitStatusArEnum, OpportunitStatusEnum } from 'src/app/core/constants/enumrators/enums';
import { ICustomEnum } from 'src/app/core/interfaces/ICustom-enum';
import { Attributes } from 'src/app/core/models/attributes';
import { Opportunity } from 'src/app/core/models/opportunity';
import { AppConfigService } from 'src/app/core/services/local-services/app-config.service';

@Component({
  selector: 'app-opportuity-map-popup',
  templateUrl: './opportuity-map-popup.component.html',
  styleUrls: ['./opportuity-map-popup.component.scss']
})
export class OpportuityMapPopupComponent implements OnInit {

  @Input() opportunity?:Opportunity;
  lang:string = "";
  opportunityStatusTypes:ICustomEnum[]=[];
  attributes:Attributes[]=[];
  

  constructor() { }

  ngOnInit(): void {
    this.lang = localStorage.getItem('language')??"ar";
    this.getOpportunitStatusTypes();
  }

  getImage() {    
    
    return AppConfigService.appCongif.resourcesUrl + "/" + this.opportunity?.imagePath;
  }


  getStatusName() {
    let op = this.opportunityStatusTypes.find(x => x.id == this.opportunity?.status);
    if (op) {
      return op.name;
    }
    else {
      return this.opportunityStatusTypes[0].name;
    }



  }


  getOpportunitStatusTypes() {
    if (this.lang == 'en') {
      this.opportunityStatusTypes = convertEnumToArray(OpportunitStatusEnum);
    }
    else {
      this.opportunityStatusTypes = convertEnumToArray(OpportunitStatusArEnum);

    }
  }


  getAttributes() {
    let attributes:Attributes[]=[];
    this.opportunity?.attributesValues.forEach(a=>{
      let attr = this.attributes.find(x=>x.id == a.attributeId);
      if(attr){
     let val ;
      if(attr.dataType == AttributeDataTypeEnum.number){
        val = a.valueNum;
      }
      if(attr.dataType == AttributeDataTypeEnum.string){
        val = a.valueString;
      }
      if(attr.dataType == AttributeDataTypeEnum.date)
      {
        val = a.valueDate;
      }
      if(attr.dataType == AttributeDataTypeEnum['Select List'])
      {
        val = (a.listValuesAr+"").split(",");
       
      }

        attributes.push({
          id:attr.id,
          dataType:attr.dataType,
          nameAr:attr.nameAr,
          nameEn:attr.nameEn,
          selectListValuesAr:attr.selectListValuesAr,
          selectListValuesEn:attr.selectListValuesEn,
          value:val,
          valueEn:'',
          valueTo:'',
          attributeIcon:attr.attributeIcon,
          iconType:attr.iconType
        });
      }
    });

    console.log(attributes);
    return attributes;

  }

}
