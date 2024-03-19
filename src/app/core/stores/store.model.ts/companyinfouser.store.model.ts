import { CompanyInfoUsers } from "src/app/core/models/company-info-users";

export interface CompanyInfoUsersModel{
    list:CompanyInfoUsers[]
}

export interface SelectedCompanyInfoUsersModel{
    selected?:CompanyInfoUsers
}