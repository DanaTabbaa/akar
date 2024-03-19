import { MaintenanceContractsSettingsDetails } from "../../models/maintenance-contract-settings-details"

export interface MaintenanceContractsSettingsDetailsModel{
    list:MaintenanceContractsSettingsDetails[]
}

export interface SelectedMaintenanceContractsSettingsDetailsModel{
    selected?:MaintenanceContractsSettingsDetails
}