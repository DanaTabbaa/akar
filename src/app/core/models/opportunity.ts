import { AttributeValues } from "./attribute-value";
import { OpportunityImages } from "./opportunity-images";

export class Opportunity {
    id!: number
    nameAr!: string
    nameEn!: string;
    areaSize!:number;
    price!: number;
    expireDate: any;
    periodPerDay!: number;
    description!: string;
    opportunityUserId!: number
    cityId!: number
    countryId!: number
    districtId!: number
    regionId!: number
    latitude!: number
    longitude!: number
    imagePath!:string;
    addressDesc!: string;
    attributes:any;
    status!: number;
    createDate: any;
    attributesValues:AttributeValues[]=[];
    opportunitiesImages:OpportunityImages[]=[]
    imageObjects:Array<object> = [];
    purpose!:number;
    opportunityTypeId!:number;
    keywords!:string;
}