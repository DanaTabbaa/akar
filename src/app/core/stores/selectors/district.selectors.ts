import { SelectedDistrictModel, DistrictModel } from "../store.model.ts/district.store.model";
import { BaseSelector } from "./base.selector";

export class DistrictSelectors extends BaseSelector<DistrictModel, SelectedDistrictModel>{
    public static readonly selectors:DistrictSelectors = new DistrictSelectors();

    constructor(){
        super("districts", "selectedDistrict", "selectedDistrictList");
    }
}