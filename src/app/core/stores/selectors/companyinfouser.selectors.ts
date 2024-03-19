import { SelectedCompanyInfoUsersModel, CompanyInfoUsersModel } from "../store.model.ts/companyinfouser.store.model";
import { BaseSelector } from "./base.selector";

export class CompanyInfoUsersSelectors extends BaseSelector<CompanyInfoUsersModel, SelectedCompanyInfoUsersModel>{
    public static readonly selectors:CompanyInfoUsersSelectors = new CompanyInfoUsersSelectors();

    constructor(){
        super("companyinfousers", "selectedCompanyInfoUser", "selectedCompanyInfoUserList");
    }
}