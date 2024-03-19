import { MaintenanceContractsModel, SelectedMaintenanceContractsModel } from "../store.model.ts/maintenancecontracts.store.model";
import { BaseSelector } from "./base.selector";

export class MaintenanceContractsSelectors extends BaseSelector<MaintenanceContractsModel, SelectedMaintenanceContractsModel>{
    public static readonly selectors:MaintenanceContractsSelectors = new MaintenanceContractsSelectors();

    constructor(){
        super("maintenanceContracts", "selectedMaintenanceContracts", "selectedMaintenanceContractsList");
    }
}