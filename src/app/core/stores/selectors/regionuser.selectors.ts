import { SelectedRegionUserModel, RegionsUsersModel } from "../store.model.ts/regionsusers.store.model";
import { BaseSelector } from "./base.selector";

export class RegionUserSelectors extends BaseSelector<RegionsUsersModel, SelectedRegionUserModel>{
    public static readonly selectors:RegionUserSelectors = new RegionUserSelectors();

    constructor(){
        super("regionsusers", "selectedRegionUser", "selectedRegionUserList");
    }
}