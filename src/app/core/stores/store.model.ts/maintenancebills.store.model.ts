import { MaintenanceBills } from "../../models/maintenance-bills"

export interface MaintenanceBillsModel{
    list:MaintenanceBills[]
}

export interface SelectedMaintenanceBillsModel{
    selected?:MaintenanceBills
}