import { SellBuyContractsSettingsDetails } from "./contracts-settings-details";

export class ContractsSettings {
    id: any;
    contractArName!: string;
    contractEnName!: string;
    contractTypeId: any;
    isGenerateEntryByDue!: boolean
    isTaxIncludedInDivision!: boolean
    isDivisionByUnit!: boolean
    isCalacAmountOnDuePeriod!: boolean
    isCalcServiceDependOnMonthlyRent!: boolean
    isDivideServiceTax!: boolean
    isGenerateEntryWithAccrudDefferAcc!: boolean
    isDivideAnnualSrvsDependOnContractTerms!: boolean
    isCalculateToOpDate!: boolean
    isGenerateEntryOnRemain!: boolean
    showMaintenance!: boolean;
    isGenerateEntryWithCreateContract!:boolean;
    //contractsSettingsDetails:SellBuyContractsSettingsDetails[] =[]
}