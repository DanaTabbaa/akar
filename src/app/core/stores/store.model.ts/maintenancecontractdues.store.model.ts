import { VMMaintenanceContractDues } from "../../models/ViewModel/vm-maintenance-contract-dues"

export interface MaintenanceContractDuesModel{
    list:VMMaintenanceContractDues[]
}

export interface SelectedMaintenanceContractDuesModel{
    selected?:VMMaintenanceContractDues
}