import { SelectedCompaniesActivitiesUsersModel, CompaniesActivitiesUsersModel } from "../store.model.ts/companiesactivitiesusers.store.model";
import { BaseSelector } from "./base.selector";

export class CompanyActivityUserSelectors extends BaseSelector<CompaniesActivitiesUsersModel, SelectedCompaniesActivitiesUsersModel>{
    public static readonly selectors:CompanyActivityUserSelectors = new CompanyActivityUserSelectors();

    constructor(){
        super("CompaniesActivitiesUsers", "selectedCompanyActivityUser", "selectedCompanyActivityUserList");
    }
}