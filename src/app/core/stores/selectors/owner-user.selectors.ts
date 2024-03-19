
import { BaseSelector } from "./base.selector";
import { OwnerUserModel, SelectedOwnerUserModel } from '../store.model.ts/owner-user.store.model';

export class OwnerUserSelectors extends BaseSelector<OwnerUserModel, SelectedOwnerUserModel>{
    public static readonly selectors:OwnerUserSelectors = new OwnerUserSelectors();

    constructor(){
        super("ownerUser", "selectedOwnerUser", "selectedOwnerUserList");
    }
}