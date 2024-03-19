import { MaintenanceServicesModel, SelectedMaintenanceServicesModel } from "../store.model.ts/maintenanceservices.store.model";
import { BaseSelector } from "./base.selector";

export class MaintenanceServicesSelectors extends BaseSelector<MaintenanceServicesModel, SelectedMaintenanceServicesModel>{
    public static readonly selectors:MaintenanceServicesSelectors = new MaintenanceServicesSelectors();

    constructor(){
        super("maintenanceServices", "selectedMaintenanceServices", "selectedMaintenanceServicesList");
    }
}