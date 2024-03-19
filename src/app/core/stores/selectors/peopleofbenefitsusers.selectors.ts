import { SelectedPeopleOfBenefitsUsersModel, PeopleOfBenefitsUsersModel } from "../store.model.ts/peopleofbenefitsusers.store.model";
import { BaseSelector } from "./base.selector";

export class PeopleOfBenefitsUsersSelectors extends BaseSelector<PeopleOfBenefitsUsersModel, SelectedPeopleOfBenefitsUsersModel>{
    public static readonly selectors:PeopleOfBenefitsUsersSelectors = new PeopleOfBenefitsUsersSelectors();

    constructor(){
        super("peopleofbenefitsusers", "selectedPeopleOfBenefitsUsers", "selectedPeopleOfBenefitsUsersList");
    }
}