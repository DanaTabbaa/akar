import { CompanyInfoUsers } from "src/app/core/models/company-info-users";
import { CompanyInfoUserActions } from "../actions/companyinfouser.actions";
import { BaseReducer } from "./base.reducer";

export class CompanyInfoUserReducers extends BaseReducer<CompanyInfoUsers>{
    public static readonly reducers:CompanyInfoUserReducers = new CompanyInfoUserReducers();
    constructor(){
        super(CompanyInfoUserActions.actions);
    }
}