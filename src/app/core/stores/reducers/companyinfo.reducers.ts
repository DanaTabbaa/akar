import { CompanyInfo } from "src/app/core/models/company-info";
import { CompanyInfoActions } from "../actions/companyinfo.actions";
import { BaseReducer } from "./base.reducer";

export class CompanyInfoReducers extends BaseReducer<CompanyInfo>{
    public static readonly reducers:CompanyInfoReducers = new CompanyInfoReducers();
    constructor(){
        super(CompanyInfoActions.actions);
    }
}