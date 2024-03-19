import { SelectedCompaniesActivitiesModel, CompaniesActivitiesModel } from "../store.model.ts/companiesactivities.store.model";
import { BaseSelector } from "./base.selector";

export class CompanyActivitySelectors extends BaseSelector<CompaniesActivitiesModel, SelectedCompaniesActivitiesModel>{
    public static readonly selectors:CompanyActivitySelectors = new CompanyActivitySelectors();

    constructor(){
        super("CompaniesActivities", "selectedCompanyActivity", "selectedCompanyActivityList");
    }
}