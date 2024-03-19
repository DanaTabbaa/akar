import { CompanyInfoUsers } from "src/app/core/models/company-info-users";
import { BaseAction } from "./base.action";

export class CompanyInfoUserActions extends BaseAction<CompanyInfoUsers>{

    public static readonly actions:CompanyInfoUserActions = new CompanyInfoUserActions();
    constructor(){
        super("[CompanyInfoUserActions]");
    }
}