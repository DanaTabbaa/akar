import { OwnerIntegrationSettings } from "./owner-integration-settings";
import { ResponsiblePersons } from "./responsible-persons";

export class Owner
{
    id:any;
    nameEn!:string;
    nameAr!:string;
    companyActivityId!:bigint;
    commercialRegisterNumber!:string;
    commercialRegisterDate!:Date;
    commercialRegisterExpireDate!:Date;
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
    //productionDateIdentity!:Date;
    //productionPlaceOfIdenity!:string;
    //expireDateOfNationalIdNumber!:Date;
    nationalityId!:bigint;
    //jobTitle!:string;
    //delegationType!:number;
    addressCityId!:bigint;
    addressDistrictId!:bigint;
    addressCountryId!:bigint;
    addressRegionId!:bigint;
    addressApartmentNumber!:bigint;
    addressBlockNumber!:string;
    addressPostalCode!:string;
    addressAdditionalCODE!:string;
    address!:string;
    //identityNo!:string;
    parentId!:bigint;
    //responsiblePersonId!:bigint;
    //signpersonid!:bigint;
    companyPostalCodeNumber!:string;
    
    defaultImage!:string;
    taxNumber!:string;
    
    
    clientAccountId!:bigint;
    registrationTypeId!:number;
    
    ownerAccountId:any;
    insuranceAccountId:any;
    taxAccountId:any;
    serviceAccountId:any;
    deferredRevenueAccountId:any;
    //accuredRevenueAccountId:any;
    responsiblePersons:ResponsiblePersons[]=[];
    ownerIntegrationSettings!:OwnerIntegrationSettings;
    code!:string;
}
