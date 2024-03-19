import { MaintenanceContractsSettingsDetails } from "../../models/maintenance-contract-settings-details";
import { MaintenanceContractsSettingsDetailsActions } from "../actions/maintenancecontractssettingsdetails.actions";
import { BaseReducer } from "./base.reducer";

export class MaintenanceContractsSettingsDetailsReducers extends BaseReducer<MaintenanceContractsSettingsDetails>{
    public static readonly reducers:MaintenanceContractsSettingsDetailsReducers = new MaintenanceContractsSettingsDetailsReducers();
    constructor(){
        super(MaintenanceContractsSettingsDetailsActions.actions);
    }
}