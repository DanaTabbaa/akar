import { MaintenanceContractDuesModel, SelectedMaintenanceContractDuesModel } from "../store.model.ts/maintenancecontractdues.store.model";
import { BaseSelector } from "./base.selector";

export class MaintenanceContractDuesSelectors extends BaseSelector<MaintenanceContractDuesModel, SelectedMaintenanceContractDuesModel>{
    public static readonly selectors:MaintenanceContractDuesSelectors = new MaintenanceContractDuesSelectors();

    constructor(){
        super("maintenanceContractDues", "selectedMaintenanceContractDues", "selectedMaintenanceContractDuesList");
    }
}