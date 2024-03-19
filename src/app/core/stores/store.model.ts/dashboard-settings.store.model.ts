import { DashboardSettings } from "../../models/dashboard-settings"

export interface DashboardSettingsModel{
    list:DashboardSettings[]
}

export interface SelectedDashboardSettingsModel{
    selected?:DashboardSettings
}