import { VwMaintenancecontractsDetails } from "../../models/ViewModel/vw-maintenance-contracts-details"

export interface MaintenanceContractsDetailsModel{
    list:VwMaintenancecontractsDetails[]
}

export interface SelectedMaintenanceContractsDetailsModel{
    selected?:VwMaintenancecontractsDetails
}