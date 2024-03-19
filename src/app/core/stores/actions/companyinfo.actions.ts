import { CompanyInfo } from "src/app/core/models/company-info";
import { BaseAction } from "./base.action";

export class CompanyInfoActions extends BaseAction<CompanyInfo>{

    public static readonly actions:CompanyInfoActions = new CompanyInfoActions();
    constructor(){
        super("[CompanyInfoActions]");
    }
}