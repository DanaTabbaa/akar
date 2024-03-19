import { MaintenanceContracts } from "../../models/maintenance-contracts";
import { BaseAction } from "./base.action";

export class MaintenanceContractsActions extends BaseAction<MaintenanceContracts>{

    public static readonly actions:MaintenanceContractsActions = new MaintenanceContractsActions();
    constructor(){
        super("[MaintenanceContractsActions]");
    }
}