import { MaintenanceServices } from "../../models/maintenance-services";
import { MaintenanceServicesActions } from "../actions/maintenanceservices.actions";
import { BaseReducer } from "./base.reducer";

export class MaintenanceServicesReducers extends BaseReducer<MaintenanceServices>{
    public static readonly reducers:MaintenanceServicesReducers = new MaintenanceServicesReducers();
    constructor(){
        super(MaintenanceServicesActions.actions);
    }
}