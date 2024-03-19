import { MaintenanceBillsUsers } from "../../models/maintenance-bills-users";
import { BaseAction } from "./base.action";

export class MaintenanceBillsUsersActions extends BaseAction<MaintenanceBillsUsers>{

    public static readonly actions:MaintenanceBillsUsersActions = new MaintenanceBillsUsersActions();
    constructor(){
        super("[MaintenanceBillsUsersActions]");
    }
}