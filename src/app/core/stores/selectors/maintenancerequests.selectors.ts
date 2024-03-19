import { MaintenanceRequestsModel, SelectedMaintenanceRequestsModel } from "../store.model.ts/maintenancerequests.store.model";
import { BaseSelector } from "./base.selector";

export class MaintenanceRequestsSelectors extends BaseSelector<MaintenanceRequestsModel, SelectedMaintenanceRequestsModel>{
    public static readonly selectors:MaintenanceRequestsSelectors = new MaintenanceRequestsSelectors();

    constructor(){
        super("maintenanceRequests", "selectedMaintenanceRequests", "selectedMaintenanceRequestsList");
    }
}