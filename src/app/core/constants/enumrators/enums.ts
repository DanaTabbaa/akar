import { ICustomEnum } from '../../interfaces/ICustom-enum';

export function convertEnumToArray(enumarator: any) {
  let map: ICustomEnum[] = [];

  for (var n in enumarator) {
    if (typeof enumarator[n] === 'number') {
      map.push({ id: <any>enumarator[n], name: n });
    }
  }

  return map;
}

export enum UserTypeEnum {
  Owner = 1,
  Tenant = 2,
  Purchaser = 3,
  'Opportunities Holders' = 4,
  // Vendor = 5,
  Office = 6,
  //Technician = 7,
  //'Maintenance Manager' = 8
}
export enum UserTypeArEnum {
  مالك = 1,
  مستأجر = 2,
  مشتري = 3,
  'أصحاب الفرص' = 4,
  // مندوب = 5,
  مكتب = 6,
  // فنى = 7,
  // 'مدير الصيانة' = 8
}

export enum RegisterationTypeEnum {
  Person = 1,
  Organization = 2,
}
export enum RegisterationTypeArEnum {
  فرد = 1,
  منشأة = 2,
}

export enum propertyTypeEnum {
  Residential = 1,
  Commercial = 2,
  'Residential Commercial' = 3,
}
export enum propertyTypeArEnum {
  سكنى = 1,
  تجارى = 2,
  'سكنى تجارى' = 3,
}
export enum buildingTypeEnum {
  Building = 1,
  Villa = 2,
}
export enum buildingTypeArEnum {
  مبنى = 1,
  فيلا = 2,
}

export enum accountType {
  'Deferred Revenue' = 1,
  'Accured Revenue' = 2,
  Tax = 3,
  Insurance = 4,
  Service = 5,
  // Revenue = 6,
  Tenant = 7,
  Purchases = 8,
  Supplier = 9,
  Expenses = 10,
  Sales = 11,
  Owner = 12,
  Office = 13

}
export enum accountTypeAr {
  'الايردادات المؤجلة' = 1,
  'الايردادات المستحقة' = 2,
  ضريبة = 3,
  تأمين = 4,
  خدمات = 5,
  مستأجر = 7,
  مشترى = 8,
  مورد = 9,
  مصروفات = 10,
  مبيعات = 11,
  مالك = 12,
  مكتب = 13

}
export enum delegationTypeEnum {
  'Authorized Delegation' = 1,
  'Legitimate Agent' = 2,
}
export enum delegationTypeArEnum {
  'التفويض المعتمد' = 1,
  'الوكيل الشرعي' = 2,
}

export enum pursposeTypeEnum {
  'For Rent' = 1,
  'For Sell' = 2,
  'For Want to Rent' = 3,
  'For Buy' = 4
}
export enum pursposeTypeArEnum {
  'للايجار' = 1,
  'للبيع' = 2,
  'للإستئجار' = 3,
  'للشراء' = 4
}
export enum realEstateTypesEnum {
  'Main Realestate Group' = 1,
  'Sub Realestate Group' = 2,
}
export enum realEstateTypesArEnum {
  'المجموعة العقارية الرئيسية' = 1,
  'المجموعة العقارية الفرعية' = 2,
}
export enum commissionTypesEnum {
  value = 1,
  ratio = 2,
}
export enum commissionTypesArEnum {
  قيمة = 1,
  نسبة = 2,
}

export enum AccountStateEnum {
  Main = 1,
  Sub = 2,
}
export enum AccountStateArEnum {
  رئيسى = 1,
  فرعي = 2
}
export enum AccountNatureEnum {
  Debit = 1,
  Credit = 2,
  Without = 3,
  Both = 4,
}
export enum AccountNatureArEnum {
  مدين = 1,
  دائن = 2,
  بدون = 3,
  كلاهما = 4,
}

export enum CalendarTypesEnum {
  Gregorian = 1,
  Hijri = 2,
}
export enum CalendarTypesArEnum {
  ميلادى = 1,
  هجرى = 2,
}
export enum PaymentMethodsEnum {
  Monthly = 1,
  Yearly = 2,
  Installments = 3,
  Daily = 4,
}
export enum PaymentMethodsArEnum {
  شهرى = 1,
  سنوى = 2,
  دفعات = 3,
  يومى = 4,
}
export enum RentPeriodTypeEnum {
  Month = 1,
  Year = 2,
  Day = 3,
}
export enum RentPeriodTypeArEnum {
  شهر = 1,
  سنة = 2,
  يوم = 3,
}
export enum ContractMarketingTypeEnum {
  Marketed = 1,
  owner = 2,
}
export enum ContractMarketingTypeArEnum {
  مسوق = 1,
  مالك = 2,
}
export enum RentContractTypeEnum {
  'Contracts And Collections Management' = 1,
  Leasing = 2,
}
export enum RentContractTypeArEnum {
  'إدارة العقود والتحصيلات' = 1,
  تأجير = 2,
}
export enum PaymentDateEnum {
  'Start contract date' = 1,
  'End contract date' = 2,
}
export enum PaymentDateArEnum {
  'تاريخ بداية العقد' = 1,
  'تاريخ انتهاء العقد' = 2,
}
export enum OfficAmountTypeEnum {
  Ratio = 1,
  Amount = 2,
}
export enum OfficAmountTypeArEnum {
  نسبة = 1,
  مبلغ = 2,
}
export enum AnnualIncreaseInRentEnum {
  'on the basis' = 1,
  cumulative = 2,
}
export enum AnnualIncreaseInRentArEnum {
  'على الاساسى' = 1,
  تراكمى = 2,
}
export enum TenantRepresentativeEnum {
  'The Tenant Is Represented By Himself' = 1,
  'The Tenant Is An Agent Under A Legitimate Agency' = 2,
}
export enum TenantRepresentativeArEnum {
  'يتم تمثيل المستأجر بنفسه' = 1,
  'المستأجر وكيل بموجب وكالة شرعية' = 2,
}
export enum SubLeasingEnum {
  Allowed = 1,
  'Not Allowed' = 0,
}
export enum SubLeasingArEnum {
  مسموح = 1,
  'غير مسموح' = 0,
}
export enum PaymentTimeTypesEnum {
  Month = 1,
  Year = 2,
}
export enum PaymentTimeTypesArEnum {
  شهر = 1,
  سنة = 2,
}
export enum PaymentsMethodsInRentContractEnum {
  'Amounts Pay In Month' = 1,
  'Quarterly' = 2,
  'Mid Term' = 3,
  'Amounts Pay In Year' = 4,
  'Amounts Pay For Once Time' = 5,
  'Free Services' = 6,
  'Deferred Services' = 7,
}
export enum PaymentsMethodsInRentContractArEnum {
  'مبلغ تدفع شهريا' = 1,
  'ربع سنوي' = 2,
  'نصف سنوى' = 3,
  'مبالغ تدفع بالسنة' = 4,
  'مبالغ تدفع مرة واحدة' = 5,
  'خدمات مجانية' = 6,
  'خدمات مؤجلة' = 7,
}
export enum CalculateMethodsInRentContractEnum {
  Ratio = 1,
  Amount = 2,
  Number = 3,
}
export enum CalculateMethodsInRentContractArEnum {
  نسبة = 1,
  مبلغ = 2,
  عدد = 3,
}
export enum ContractUnitsServicesAccountsEnum {
  'Tenant Account' = 1,
  'Owner Services Account' = 2,
  'Office Account' = 3,
}
export enum ContractUnitsServicesAccountsArEnum {
  'حساب مستأجر' = 1,
  'حساب خدمات المالك' = 2,
  'حساب المكتب' = 3,
}
// status==0  ======> لم يتم تعميد العقد
// status==1  ======> تم التعميد العقد
// status==2  ======> اخلاء العقد
// status==3  ======> تم تسوية العقد
// status==4  ======> تم تعميد التسوية العقد
// status==5  ======> تم تجديد العقد
// status==6  ======> تم تعميد تجديد العقد
// status==7 ======> العقود المؤرشفة
// status==8 ======> العقود المنتهية
export enum RentContractStatusEnum {
  NotIssued = 0,
  Issued = 1,
  Evacuation = 2,
  Settlement = 3,
  IssueSettlement = 4,
  Renew = 5,
  IssueRenew = 6,
  Archieved = 7,
  Expired = 8,
}
export enum MaintenanceContractStatusEnum {
  NotIssued = 0,
  Issued = 1
}
export enum SalesBuyContractStatusEnum {
  NotIssued = 0,
  Issued = 1
}
export enum UnitStatusEnum {
  //  status==1  ======> الوحدة متاحة======================>   avialable
  //  status==2  ======> الوحدة محجوزة   ==================>   booked
  //  status==3  ======> الوحدة تحت التعاقد  ==============>   underContract
  //  status==4  ======> الوحدة مؤجرة======================>   rented
  //  status==5  ======> الوحدة تحت الإخلاء =================>   evacuation
  //  status==6  ======> الوحدة عليها عرض =================>   offer

  avialable = 1,
  booked = 2,
  underContract = 3,
  rented = 4,
  evacuation = 5,
  hasOffer = 6,
}
export enum RentContractDuesEnum {
  Rent = 1,
  Inssurance = 2,
  Tax = 3,
  Service = 4,
  ServiceTax = 5

}
export enum contractTypesEnum {
  Rent = 1,
  Sell = 2,
  Purchase = 3,
  Maintenance = 4
}
export enum contractTypesArEnum {
  ايجار = 1,
  بيع = 2,
  شراء = 3,
  صيانة = 4
}
//#region Product Type
export enum productTypeEnum {
  Warehouse = 1,
  Service = 2
}
export enum productTypeArEnum {
  مخزن = 1,
  خدمة = 2
}
//#endregion
//#region Maintenance Request Type
export enum maintenanceRequestTypeEnum {
  Normal = 1,
  Urgent = 2
}
export enum maintenanceRequestTypeArEnum {
  عادى = 1,
  عاجل = 2
}

//#endregion

//#region Notificatons Manager
export enum NotificationsEvents {
  'Send Now' = 1,
  'Before Dues Date' = 2,
  'Before End Contracts' = 3,
}
export enum NotificationsEventsAr {
  'الارسال الان' = 1,
  'قبل تاريخ الاستحقاقات' = 2,
  'قبل نهاية العقود' = 3,
}
//#endregion
//#region Notificatons Manager
export enum ToolbarActions {
  List = "List",
  Save = "Save",
  New = "New",
  Update = "Update",
  Delete = "Delete",
  Copy = "Copy",
  Print = "Print",
  Expory = "Expory",
  Reset = "Reset",
  Cancel = "Cancel",
  Issue = "Issue",
  Renew = "Renew",
  View = "View",
  ChangePassword = "ChangePassword",
  CancelDefaultReport = "CancelDefaultReport"
}
//#endregion
//#region WhatsApp Providers
export enum WhatsAppProviders {
  Twilio = 1,
  Ultramsg = 2,

}
export enum WhatsAppProvidersAr {
  تويليو = 1,
  أولترامسغ = 2,

}
//#endregion


//#endregion
//#region WhatsApp Providers
export enum EntryTypes {
  reciveVoucher = 1,
  payVoucher = 2,
  debitNote = 3,
  creditNote = 4

}
//#endregion

//#region WhatsApp Providers
export enum AlertTypes {
  success = "success",
  info = "info",
  error = "error",
  warning = "warning",
  add = "add",
  update = "update",
  delete = "delete",
  issue = "issue"

}
//#endregion
//#region Technician Type Enum
export enum TechnicianTypeEnum {
  Internal = 1,
  External = 2
}
export enum TechnicianTypeArEnum {
  داخلى = 1,
  خارجى = 2
}

//#endregion

//#region ElectricityMeterTypeEnum
export enum ElectricityMeterTypeEnum {
  Services = 1,
  Offices = 2,
  AirConditions = 3
}
export enum ElectricityMeterTypeArEnum {
  خدمات = 1,
  مكاتب = 2,
  تكييفات = 3
}
//#endregion
//#region MaintenanceRequestStatusEnum
export enum MaintenanceRequestStatusEnum {
  WaitingForDetermineTheTechnician = 1,
  TechnicianSelected = 2,
  RequiredPiecesReportWritten = 3,
  WaitingForTenantApproval = 4,
  WaitingForExchange = 5,
  ExchangeIsDone = 6,
  AccomplishmentReportWritten = 7,
  Requestclosed = 8,
  rejectedrequest = 9

}

//#endregion
//#region MaintenanceCostOnEnum
export enum MaintenanceCostOnEnum {
  Tenant = 1,
  Owner = 2
}
export enum MaintenanceCostOnArEnum {
  مستأجر = 1,
  مالك = 2
}
//#endregion

//#endregion
//#region MaintenanceContractPeriodTypesEnum
export enum MaintenanceContractPeriodTypesEnum {
  Month = 1,
  Year = 2
}
export enum MaintenanceContractPeriodTypesArEnum {
  شهر = 1,
  سنة = 2
}
//#endregion
//#region maintenanceMethodTypesEnum
export enum MaintenanceMethodTypesEnum {
  Month = 1,
  Year = 2
}
export enum MaintenanceMethodTypesArEnum {
  شهر = 1,
  سنة = 2
}
//#endregion
//#region MaintenanceContractDuesEnum

export enum MaintenanceContractDuesEnum {
  Expense = 1,
  Tax = 2,

}
export enum CheckTableRelationsStatus {
  noRelations = 1,
  hasRelations = 2,
  exception = 3


}
export enum SalesBuyContractDuesEnum {
  firstPayment = 1,
  installment = 2,
  finalPayment = 3

}

export enum AttributeDataTypeEnum {
  'string' = 1,
  'number' = 2,
  'date' = 3,
  'Select List' = 4
}

export enum AttributeDataTypeArEnum {
  'نص' = 1,
  'رقم' = 2,
  'تاريخ' = 3,
  'قائمة منسدلة' = 4
}


export enum OpportunitStatusEnum {
  'Available' = 1,
  'Reserved' = 2,
  'Rented' = 3,
  'Selled' = 4

}

export enum OpportunitStatusArEnum {
  'متاحة' = 1,
  'محجوزة' = 2,
  'مؤجرة' = 3,
  'مباعة' = 4
}

export enum SortByEnum {
  'Price' = 1,
  'Create Date' = 2,
}

export enum SortByArEnum {
  'السعر' = 1,
  'تاريخ العرض' = 2,
}



export enum accountClass {
  'Fixed Assets' = 1,
  'Current Assets' = 2,
  'Fixed Liabilities' = 3,
  'Current Liabilities' = 4,
  Others = 5,
  Revenue = 6,
  Expenses = 7,
  Depreciation = 8,
  'Opening Stock' = 9,
  'Closed Stock' = 10,
  Trading = 11,
  'Profit and Loss' = 12

}
export enum accountClassAr {
  'أصول ثابته' = 1,
  'أصول متداولة' = 2,
  'خصوم ثابته' = 3,
  'خصوم متداولة' = 4,
  'حسابات اخرى' = 5,
  الايرادات = 6,
  المصاريف = 7,
  الاهلاكات = 8,
  'بضاعة أول المدة' = 9,
  'بضاعةاخر المدة' = 10,
  المتاجرة = 11,
  'الارباح والخسائر' = 12

}

export enum PermissionType {
  Pages = 0,
  Contract = 1,
  Voucher = 2,
  Bill = 3
}


export enum ConnectionTypeEnum {
  Window = 0,
  Sql = 1,
}


export enum AccIntegrationTypeEnum {
  None = 0,
  Resort = 1,
  Web = 2,
}

export enum AccIntegrationTypeArEnum {
  بدون = 0,
  'الربط مع الملاذ' = 1,
  'الربط مع الويب' = 2,
}






//#endregion
