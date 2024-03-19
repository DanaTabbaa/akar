import { SelectedContractsSettingModel, ContractSettingModel } from "../store.model.ts/contract-setting.store.model";
import { BaseSelector } from "./base.selector";

export class ContractSettingSelectors extends BaseSelector<ContractSettingModel, SelectedContractsSettingModel>{
    public static readonly selectors:ContractSettingSelectors = new ContractSettingSelectors();

    constructor(){
        super("contractSettings", "selectedContractSetting", "selectedContractSettingList");
    }
}