import { MaintenanceBillsUsersModel, SelectedMaintenanceBillsUsersModel } from "../store.model.ts/maintenancebillsusers.store.model";
import { BaseSelector } from "./base.selector";

export class MaintenanceBillsUsersSelectors extends BaseSelector<MaintenanceBillsUsersModel, SelectedMaintenanceBillsUsersModel>{
    public static readonly selectors:MaintenanceBillsUsersSelectors = new MaintenanceBillsUsersSelectors();

    constructor(){
        super("maintenancebillsusers", "selectedMaintenanceBillsUsers", "selectedMaintenanceBillsUsersList");
    }
}