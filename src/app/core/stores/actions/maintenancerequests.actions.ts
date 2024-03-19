import { MaintenanceRequests } from "../../models/maintenance-requests";
import { BaseAction } from "./base.action";


export class MaintenanceRequestsActions extends BaseAction<MaintenanceRequests>{

    public static readonly actions:MaintenanceRequestsActions = new MaintenanceRequestsActions();
    constructor(){
        super("[MaintenanceRequestsActions]");
    }
}