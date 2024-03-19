import { SelectedAreaUserModel, AreasUsersModel } from "../store.model.ts/areasusers.store.model";
import { BaseSelector } from "./base.selector";

export class AreaUserSelectors extends BaseSelector<AreasUsersModel, SelectedAreaUserModel>{
    public static readonly selectors:AreaUserSelectors = new AreaUserSelectors();

    constructor(){
        super("areasusers", "selectedAreaUser", "selectedAreaUserList");
    }
}