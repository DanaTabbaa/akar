
import { DashboardSettings } from "../../models/dashboard-settings";
import { DashboardSettingsActions } from "../actions/dashboard-settings.actions";
import { BaseReducer } from "./base.reducer";

export class DashboardSettingsReducers extends BaseReducer<DashboardSettings>{
    public static readonly reducers:DashboardSettingsReducers = new DashboardSettingsReducers();
    constructor(){
        super(DashboardSettingsActions.actions);
    }
}