import { SelectedAreaModel, AreasModel } from "../store.model.ts/areas.store.model";
import { BaseSelector } from "./base.selector";
import { GroundUsersModel, SelectedGroundUsersModel } from '../store.model.ts/ground-users.store.model';

export class GroundUsersSelectors extends BaseSelector<GroundUsersModel, SelectedGroundUsersModel>{
    public static readonly selectors:GroundUsersSelectors = new GroundUsersSelectors();

    constructor(){
        super("groundsUsers", "selectedGroundsUsers", "selectedGroundsUsersList");
    }
}