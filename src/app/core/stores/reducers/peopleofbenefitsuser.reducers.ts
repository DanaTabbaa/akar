import { PeopleOfBenefitsUsers } from "src/app/core/models/people-of-benefits-users";
import { PeopleOfBenefitsUsersActions } from "../actions/peopleofbenefitsuser.actions";
import { BaseReducer } from "./base.reducer";

export class PeopleOfBenefitsUsersReducers extends BaseReducer<PeopleOfBenefitsUsers>{
    public static readonly reducers:PeopleOfBenefitsUsersReducers = new PeopleOfBenefitsUsersReducers();
    constructor(){
        super(PeopleOfBenefitsUsersActions.actions);
    }
}