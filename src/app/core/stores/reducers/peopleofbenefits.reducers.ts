import { PeopleOfBenefit } from "../../models/people-of-benefits";
import { PeopleOfBenefitsActions } from "../actions/peopleofbenefits.actions";
import { BaseReducer } from "./base.reducer";

export class PeopleOfBenefitsReducers extends BaseReducer<PeopleOfBenefit>{
    public static readonly reducers:PeopleOfBenefitsReducers = new PeopleOfBenefitsReducers();
    constructor(){
        super(PeopleOfBenefitsActions.actions);
    }
}