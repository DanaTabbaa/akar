import { VwMaintenancecontracts } from "../../models/ViewModel/vw_maintenance-contracts"

export interface MaintenanceContractsModel{
    list:VwMaintenancecontracts[]
}

export interface SelectedMaintenanceContractsModel{
    selected?:VwMaintenancecontracts
}