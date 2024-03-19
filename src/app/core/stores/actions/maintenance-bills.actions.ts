import { MaintenanceBills } from "../../models/maintenance-bills";
import { BaseAction } from "./base.action";

export class MaintenanceBillsActions extends BaseAction<MaintenanceBills>{

    public static readonly actions:MaintenanceBillsActions = new MaintenanceBillsActions();
    constructor(){
        super("[MaintenanceBillsActions]");
    }
}