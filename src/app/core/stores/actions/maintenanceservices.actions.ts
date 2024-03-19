import { MaintenanceServices } from "../../models/maintenance-services";
import { BaseAction } from "./base.action";

export class MaintenanceServicesActions extends BaseAction<MaintenanceServices>{

    public static readonly actions:MaintenanceServicesActions = new MaintenanceServicesActions();
    constructor(){
        super("[MaintenanceServicesActions]");
    }
}