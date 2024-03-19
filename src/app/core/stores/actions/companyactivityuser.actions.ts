import { CompaniesActivitiesUsers } from "src/app/core/models/companies-activities-users";
import { BaseAction } from "./base.action";

export class CompanyActivityUserActions extends BaseAction<CompaniesActivitiesUsers>{

    public static readonly actions:CompanyActivityUserActions = new CompanyActivityUserActions();
    constructor(){
        super("[CompanyActivityUserActions]");
    }
}