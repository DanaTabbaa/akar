import { SelectedUnitModel, UnitsModel } from "../store.model.ts/units.store.model";
import { BaseSelector } from "./base.selector";
import { OfficeUserModel, SelectedOfficeUserModel } from '../store.model.ts/officie-user.store.model';

export class OfficeUserSelectors extends BaseSelector<OfficeUserModel, SelectedOfficeUserModel>{
    public static readonly selectors:OfficeUserSelectors = new OfficeUserSelectors();

    constructor(){
        super("officeUser", "selectedOfficeUser", "selectedOfficeUserList");
    }
}