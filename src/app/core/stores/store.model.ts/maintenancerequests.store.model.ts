import { MaintenanceRequests } from "../../models/maintenance-requests";
import { MaintenanceRequestsVM } from "../../models/ViewModel/maintenance-requests-vm";

export interface MaintenanceRequestsModel{
    list:MaintenanceRequests[]
}

export interface SelectedMaintenanceRequestsModel{
    selected?:MaintenanceRequests
}