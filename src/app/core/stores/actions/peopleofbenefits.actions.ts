import { BaseAction } from "./base.action";

import { PeopleOfBenefit } from "../../models/people-of-benefits";

export class PeopleOfBenefitsActions extends BaseAction<PeopleOfBenefit>{

    public static readonly actions:PeopleOfBenefitsActions = new PeopleOfBenefitsActions();
    constructor(){
        super("[PeopleOfBenefitsActions]");
    }
}