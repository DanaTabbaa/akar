import { SelectedRealestateModel, RealestatesModel } from "../store.model.ts/realestates.store.model";
import { BaseSelector } from "./base.selector";

export class RealestateSelectors extends BaseSelector<RealestatesModel, SelectedRealestateModel>{
    public static readonly selectors:RealestateSelectors = new RealestateSelectors();

    constructor(){
        super("realestates", "selectedRealestate", "selectedRealestateList");
    }
}