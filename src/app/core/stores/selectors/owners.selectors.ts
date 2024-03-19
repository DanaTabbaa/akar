
import { BaseSelector } from "./base.selector";
import { OwnersModel, SelectedOwnersModel } from '../store.model.ts/owner.store.model';

export class OwnerSelectors extends BaseSelector<OwnersModel, SelectedOwnersModel>{
    public static readonly selectors:OwnerSelectors = new OwnerSelectors();

    constructor(){
        super("owner", "selectedOwner", "selectedOwnerList");
    }
}
