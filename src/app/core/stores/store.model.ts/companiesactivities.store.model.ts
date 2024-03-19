import { CompaniesActivities } from "src/app/core/models/companies-activities";

export interface CompaniesActivitiesModel{
    list:CompaniesActivities[]
}

export interface SelectedCompaniesActivitiesModel{
    selected?:CompaniesActivities
}