import { MaintenanceBillsUsers } from "../../models/maintenance-bills-users"

export interface MaintenanceBillsUsersModel{
    list:MaintenanceBillsUsers[]
}

export interface SelectedMaintenanceBillsUsersModel{
    selected?:MaintenanceBillsUsers
}