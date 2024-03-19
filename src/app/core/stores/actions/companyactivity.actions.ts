import { CompaniesActivities } from "src/app/core/models/companies-activities";
import { BaseAction } from "./base.action";

export class CompanyActivityActions extends BaseAction<CompaniesActivities>{

    public static readonly actions:CompanyActivityActions = new CompanyActivityActions();
    constructor(){
        super("[CompanyActivityActions]");
    }
}