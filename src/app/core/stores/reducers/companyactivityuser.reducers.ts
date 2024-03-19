import { CompaniesActivitiesUsers } from "src/app/core/models/companies-activities-users";
import { CompanyActivityUserActions } from "../actions/companyactivityuser.actions";
import { BaseReducer } from "./base.reducer";

export class CompanyActivityUserReducers extends BaseReducer<CompaniesActivitiesUsers>{
    public static readonly reducers:CompanyActivityUserReducers = new CompanyActivityUserReducers();
    constructor(){
        super(CompanyActivityUserActions.actions);
    }
}