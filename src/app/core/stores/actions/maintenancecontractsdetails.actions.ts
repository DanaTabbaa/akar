import { MaintenanceContractsDetails } from "../../models/maintenance-contracts-details";
import { BaseAction } from "./base.action";

export class MaintenanceContractsDetailsActions extends BaseAction<MaintenanceContractsDetails>{

    public static readonly actions:MaintenanceContractsDetailsActions = new MaintenanceContractsDetailsActions();
    constructor(){
        super("[MaintenanceContractsDetailsActions]");
    }
}