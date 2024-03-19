import { MaintenanceContractsDetailsModel, SelectedMaintenanceContractsDetailsModel } from "../store.model.ts/maintenancecontractdetails.store.model";
import { BaseSelector } from "./base.selector";

export class MaintenanceContractsDetailsSelectors extends BaseSelector<MaintenanceContractsDetailsModel, SelectedMaintenanceContractsDetailsModel>{
    public static readonly selectors:MaintenanceContractsDetailsSelectors = new MaintenanceContractsDetailsSelectors();

    constructor(){
        super("maintenanceContractsDetails", "selectedMaintenanceContractsDetails", "selectedMaintenanceContractsDetailsList");
    }
}