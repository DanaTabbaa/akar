import { ResponsiblePersons } from "./responsible-persons";

export class Purchasers
{
    id:any;
    nameEn!:string;
    nameAr!:string;
    companyActivityId!:bigint;
    commercialRegisterNumber!:string;
    CommercialRegisterDate!:Date;
    CommercialRegisterExpireDate!:Date;
    commercialRegisterPlace!:string;
    phone!:string;
    mobile!:string;
    fax!:string;
    email!:string;
    companyPostalBoxNumber!:string;
    companyPhone!:string;
    companyFax!:string;
    companyMobile!:string;
    companyEmail!:string;
    productionDateIdentity!:Date;
    productionPlaceOfIdenity!:string;
    expireDateOfNationalIdNumber!:Date;
    nationalityId!:bigint;
    jobTitle!:string;
    delegationType!:number;
    addressCityId!:bigint;
    addressApartmentNumber!:bigint;
    addressBlockNumber!:string;
    addressPostalCode!:string;
    addressAdditionalCODE!:string;
    address!:string;
    identityNo!:string;
    parentId!:bigint;
    responsiblePersonId!:bigint;
    signpersonid!:bigint;
    companyPostalCodeNumber!:string;
    ariaId!:bigint;
    responsibleNameEn!:string;
    responsibleNameAr!:string;
    respoMobile!:string;
    respoIdentityNo!:string;
    respoIdentityDate!:Date;
    respoIdentityPlace!:string;
    respoIdentityExpire!:Date;
    respoJob!:string;
    signNameEn!:string;
    signNameAr!:string;
    signMobile!:string;
    signatureNationalId!:string;
    signIdentityDate!:Date;
    signatureIdentityPlace!:string;
    signatureIdentityend!:Date;
    ratingCount!:number;
    countOfRatingUsers!:number;
    defaultImage!:string;
    taxNumber!:string;
    companyNameAr!:string;
    companyNameEn!:string;
    clientAccountId!:bigint;
    registrationTypeId!:number;
    purchaserNumber!:string;
    senderEmail!:string;
    senderUser!:string;
    senderPassword!:string;
    isGenerateEntryByDue!:boolean;
    isInsurranceIncludedInDivision!:boolean;
    isTaxIncludedInDivision!:boolean;
    isDivisionByUnit!:boolean;
    isCalacAmountOnDuePeriod!:boolean;
    isEntryWithServiceDetails!:boolean;
    isCalcServiceDependOnMonthlyRent!:boolean;
    isDivideServiceTax!:boolean;
    isGenerateEntryWithAccrudDefferAcc!:boolean;
    isDivideAnnualSrvsDependOnContractTerms!:boolean;
    contractMarketingType!:boolean;
    userType!:number;
    parentUserId!:bigint;
    isConnectWithWaterAndElectric!:boolean;
    numberWaterAcc!:string;
    numberElectricAcc!:string;
    ownerId:any;
    purchaserAccountId:any; 
    commercialRegisterDate:any;
    commercialRegisterExpireDate:any;
    respoIdentityExpireDate:any;
    addressCountryId!:bigint;
    addressRegionId!:bigint;
    addressDistrictId!:bigint;
    addressAdditionalCode!:string;
    signatureIdentityEnd:any;
    responsiblePersons:ResponsiblePersons[]=[];

}