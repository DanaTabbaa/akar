import { MaintenanceContractsDetails } from "../../models/maintenance-contracts-details";
import { MaintenanceContractsDetailsActions } from "../actions/maintenancecontractsdetails.actions";
import { BaseReducer } from "./base.reducer";

export class MaintenanceContractsDetailsReducers extends BaseReducer<MaintenanceContractsDetails>{
    public static readonly reducers:MaintenanceContractsDetailsReducers = new MaintenanceContractsDetailsReducers();
    constructor(){
        super(MaintenanceContractsDetailsActions.actions);
    }
}