import { SelectedCompanyInfosModel, CompanyInfosModel } from "../store.model.ts/companyinfo.store.model";
import { BaseSelector } from "./base.selector";

export class CompanyInfoSelectors extends BaseSelector<CompanyInfosModel, SelectedCompanyInfosModel>{
    public static readonly selectors:CompanyInfoSelectors = new CompanyInfoSelectors();

    constructor(){
        super("companyinfos", "selectedCompanyInfo", "selectedCompanyInfoList");
    }
}