import { CompaniesActivitiesUsers } from "src/app/core/models/companies-activities-users";

export interface CompaniesActivitiesUsersModel{
    list:CompaniesActivitiesUsers[]
}

export interface SelectedCompaniesActivitiesUsersModel{
    selected?:CompaniesActivitiesUsers
}