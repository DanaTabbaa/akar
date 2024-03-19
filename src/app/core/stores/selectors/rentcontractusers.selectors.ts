import { SelectedRentContractsUsersModel, RentContractsUsersModel } from "../store.model.ts/rentconractusers.store.model";
import { BaseSelector } from "./base.selector";

export class RentContractUsersSelectors extends BaseSelector<RentContractsUsersModel, SelectedRentContractsUsersModel>{
    public static readonly selectors:RentContractUsersSelectors = new RentContractUsersSelectors();

    constructor(){
        super("rentcontractusers", "selectedRentContractUser", "selectedRentContractUserList");
    }
}