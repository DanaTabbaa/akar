import { VMMaintenanceContractDues } from "../../models/ViewModel/vm-maintenance-contract-dues";
import { BaseAction } from "./base.action";

export class MaintenanceContractDuesActions extends BaseAction<VMMaintenanceContractDues>{

    public static readonly actions:MaintenanceContractDuesActions = new MaintenanceContractDuesActions();
    constructor(){
        super("[MaintenanceContractDuesActions]");
    }
}