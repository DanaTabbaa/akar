import { MaintenanceRequests } from "../../models/maintenance-requests";
import { MaintenanceRequestsActions } from "../actions/maintenancerequests.actions";
import { BaseReducer } from "./base.reducer";

export class MaintenanceRequestsReducers extends BaseReducer<MaintenanceRequests>{
    public static readonly reducers:MaintenanceRequestsReducers = new MaintenanceRequestsReducers();
    constructor(){
        super(MaintenanceRequestsActions.actions);
    }
}