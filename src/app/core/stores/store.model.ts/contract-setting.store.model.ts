import { ContractsSettings } from "src/app/core/models/contracts-settings";

export interface ContractSettingModel{
    list:ContractsSettings[]
}

export interface SelectedContractsSettingModel{
    selected?:ContractsSettings
}