import { SelectedUnitUserModel, UnitsUsersModel } from "../store.model.ts/unitsusers.store.model";
import { BaseSelector } from "./base.selector";

export class UnitUserSelectors extends BaseSelector<UnitsUsersModel, SelectedUnitUserModel>{
    public static readonly selectors:UnitUserSelectors = new UnitUserSelectors();

    constructor(){
        super("unitsusers", "selectedUnitUser", "selectedUnitUserList");
    }
}