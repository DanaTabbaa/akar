import { SelectedUserRegisterationModel, UserRegisterationsModel } from "../store.model.ts/userregisterations.store.model";
import { BaseSelector } from "./base.selector";

export class UserRegisterationSelectors extends BaseSelector<UserRegisterationsModel, SelectedUserRegisterationModel>{
    public static readonly selectors:UserRegisterationSelectors = new UserRegisterationSelectors();

    constructor(){
        super("usersregisterations", "selectedUserRegisteration", "selectedUserRegisterationList");
    }
}