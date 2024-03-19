import { AccountModel, SelectedAccountModel } from "../store.model.ts/accounts.store.model";
import { MaintenanceContractsSettingsDetailsModel, SelectedMaintenanceContractsSettingsDetailsModel } from "../store.model.ts/maintenancecontractssettingsdetails.store.model";
import { BaseSelector } from "./base.selector";

export class MaintenanceContractSettingsDetailsSelectors extends BaseSelector<MaintenanceContractsSettingsDetailsModel, SelectedMaintenanceContractsSettingsDetailsModel>{
    public static readonly selectors:MaintenanceContractSettingsDetailsSelectors = new MaintenanceContractSettingsDetailsSelectors();

    constructor(){
        super("maintenanceConractsSettingsDetails", "selecteMmaintenanceConractsSettingsDetails", "selectedMaintenanceConractsSettingsDetailsList");
    }
}