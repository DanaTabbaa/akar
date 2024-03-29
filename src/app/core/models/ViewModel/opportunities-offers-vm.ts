export class OpportunitiesOffersVM{
    id!: number
    nameAr!: string
    nameEn!: string;
    price!: number
    expireDate: any
    periodPerDay!: number
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
    imageObjects:Array<object> = [];
    purpose!:number;
    offerStatus!:boolean;
    offerExpireDate!:any;
    offerId!:number;
}
