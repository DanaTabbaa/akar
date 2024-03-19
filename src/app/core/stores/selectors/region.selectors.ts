import { SelectedRegionModel, RegionsModel } from "../store.model.ts/regions.store.model";
import { BaseSelector } from "./base.selector";

export class RegionSelectors extends BaseSelector<RegionsModel, SelectedRegionModel>{
    public static readonly selectors:RegionSelectors = new RegionSelectors();

    constructor(){
        super("regions", "selectedRegion", "selectedRegionList");
    }
}