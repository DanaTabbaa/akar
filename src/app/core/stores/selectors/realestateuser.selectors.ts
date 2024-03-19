import { SelectedRealestateUserModel, RealestatesUsersModel } from "../store.model.ts/realestatesusers.store.model";
import { BaseSelector } from "./base.selector";

export class RealestateUserSelectors extends BaseSelector<SelectedRealestateUserModel, RealestatesUsersModel>{
    public static readonly selectors:RealestateUserSelectors = new RealestateUserSelectors();

    constructor(){
        super("realestatesusers", "selectedRealestateUser", "selectedRealestateUserList");
    }
}