import { CompanyInfo } from "src/app/core/models/company-info";

export interface CompanyInfosModel{
    list:CompanyInfo[]
}

export interface SelectedCompanyInfosModel{
    selected?:CompanyInfo
}