import { MaintenanceBillsModel, SelectedMaintenanceBillsModel } from "../store.model.ts/maintenancebills.store.model";
import { BaseSelector } from "./base.selector";

export class MaintenanceBillsSelectors extends BaseSelector<MaintenanceBillsModel, SelectedMaintenanceBillsModel>{
    public static readonly selectors:MaintenanceBillsSelectors = new MaintenanceBillsSelectors();

    constructor(){
        super("maintenancebills", "selectedMaintenanceBills", "selectedMaintenanceBillsList");
    }
}