import { MaintenanceContracts } from "../../models/maintenance-contracts";
import { MaintenanceContractsActions } from "../actions/maintenancecontracts.actions";
import { BaseReducer } from "./base.reducer";

export class MaintenanceContractsReducers extends BaseReducer<MaintenanceContracts>{
    public static readonly reducers:MaintenanceContractsReducers = new MaintenanceContractsReducers();
    constructor(){
        super(MaintenanceContractsActions.actions);
    }
}