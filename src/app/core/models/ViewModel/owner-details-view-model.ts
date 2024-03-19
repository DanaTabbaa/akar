import { OwnerIntegrationSettings } from "../owner-integration-settings";
import { Owner } from "../owners";
import { ResponsiblePersons } from "../responsible-persons";

export interface OwnerDetailsViewModel {

  id: number;
  nameEn: string;
  nameAr: string;
  companyActivityId: number | null;
  commercialRegisterNumber: string;
  commercialRegisterDate: string | null;
  commercialRegisterExpireDate: string | null;
  commercialRegisterPlace: string;
  phone: string;
  mobile: string;
  fax: string;
  email: string;
  companyPostalBoxNumber: string;
  companyPhone: string;
  companyFax: string;
  companyMobile: string;
  companyEmail: string;
  productionDateIdentity: string | null;
  productionPlaceOfIdenity: string;
  expireDateOfNationalIdNumber: string | null;
  nationalityId: number | null;
  jobTitle: string;
  delegationType: number | null;
  addressCityId: number | null;
  addressApartmentNumber: number | null;
  addressBlockNumber: string;
  addressPostalCode: string;
  addressAdditionalCode: string;
  address: string;
  identityNo: string;
  parentId: number | null;
  responsiblePersonId: number | null;
  signPersonId: number | null;
  companyPostalCodeNumber: string;
  ariaId: number | null;
  responsibleNameEn: string;
  responsibleNameAr: string;
  respoMobile: string;
  respoIdentityNo: string;
  respoIdentityDate: string | null;
  respoIdentityPlace: string;
  respoIdentityExpire: string | null;
  respoJob: string;
  signNameEn: string;
  signNameAr: string;
  signMobile: string;
  signatureNationalId: string;
  signIdentityDate: string | null;
  signatureIdentityPlace: string;
  signatureIdentityEnd: string | null;
  ratingCount: number | null;
  countOfRatingUsers: number | null;
  defaultImage: string;
  taxNumber: string;
  companyNameAr: string;
  companyNameEn: string;
  clientAccountId: number | null;
  registrationTypeId: number | null;
  ownerNumber: string;
  senderEmail: string;
  senderUser: string;
  senderPassword: string;
  isGenerateEntryByDue: boolean | null;
  isInsurranceIncludedInDivision: boolean | null;
  isTaxIncludedInDivision: boolean | null;
  isDivisionByUnit: boolean | null;
  isCalacAmountOnDuePeriod: boolean | null;
  isEntryWithServiceDetails: boolean | null;
  isCalcServiceDependOnMonthlyRent: boolean | null;
  isDivideServiceTax: boolean | null;
  isGenerateEntryWithAccrudDefferAcc: boolean | null;
  isDivideAnnualSrvsDependOnContractTerms: boolean | null;
  contractMarketingType: boolean | null;
  userType: number | null;
  parentUserId: number | null;
  isConnectWithWaterAndElectric: boolean | null;
  numberWaterAcc: string;
  numberElectricAcc: string;
  addressCountryId: number | null;
  addressRegionId: number | null;
  addressDistrictId: number | null;
  ownerAccountId: number | null;
  insuranceAccountId: number | null;
  taxAccountId: number | null;
  serviceAccountId: number | null;
  deferredRevenueAccountId: number | null;
  accuredRevenueAccountId: number | null;
  isAddResponsiblePerson: number | null;
  isAddPersonAuthorized: number | null;
  responsiblePersons: ResponsiblePersons[];
  ownerIntegrationSettings:OwnerIntegrationSettings;

}