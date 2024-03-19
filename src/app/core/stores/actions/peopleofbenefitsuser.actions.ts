import { PeopleOfBenefitsUsers } from "../../models/people-of-benefits-users";
import { BaseAction } from "./base.action";

export class PeopleOfBenefitsUsersActions extends BaseAction<PeopleOfBenefitsUsers>{

    public static readonly actions:PeopleOfBenefitsUsersActions = new PeopleOfBenefitsUsersActions();
    constructor(){
        super("[PeopleOfBenefitsUsersActions]");
    }
}