import { MaintenanceServices } from "../../models/maintenance-services"

export interface MaintenanceServicesModel{
    list:MaintenanceServices[]
}

export interface SelectedMaintenanceServicesModel{
    selected?:MaintenanceServices
}