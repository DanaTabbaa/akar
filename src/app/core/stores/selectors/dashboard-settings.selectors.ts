import { DashboardSettingsModel, SelectedDashboardSettingsModel } from "../store.model.ts/dashboard-settings.store.model";
import { BaseSelector } from "./base.selector";

export class DashboardSettingsSelectors extends BaseSelector<DashboardSettingsModel, SelectedDashboardSettingsModel>{
    public static readonly selectors:DashboardSettingsSelectors = new DashboardSettingsSelectors();

    constructor(){
        super("dashboardSettings", "selectedDashboardSettings", "selectedDashboardSettingsList");
    }
}