import { CompaniesActivities } from "src/app/core/models/companies-activities";
import { CompanyActivityActions } from "../actions/companyactivity.actions";
import { BaseReducer } from "./base.reducer";

export class CompanyActivityReducers extends BaseReducer<CompaniesActivities>{
    public static readonly reducers:CompanyActivityReducers = new CompanyActivityReducers();
    constructor(){
        super(CompanyActivityActions.actions);
    }
}