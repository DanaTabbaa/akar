import { DashboardSettings } from "../../models/dashboard-settings";
import { BaseAction } from "./base.action";

export class DashboardSettingsActions extends BaseAction<DashboardSettings>{

    public static readonly actions:DashboardSettingsActions = new DashboardSettingsActions();
    constructor(){
        super("[DashboardSettingsActions]");
    }
}