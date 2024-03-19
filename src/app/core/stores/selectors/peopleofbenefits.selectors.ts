import { SelectedPeopleOfBenefitsModel, PeopleOfBenefitsModel } from "../store.model.ts/peopleofbenefits.store.model";
import { BaseSelector } from "./base.selector";

export class PeopleOfBenefitsSelectors extends BaseSelector<PeopleOfBenefitsModel, SelectedPeopleOfBenefitsModel>{
    public static readonly selectors:PeopleOfBenefitsSelectors = new PeopleOfBenefitsSelectors();

    constructor(){
        super("peopleofbenefits", "selectedPeopleOfBenefits", "selectedPeopleOfBenefitsList");
    }
}