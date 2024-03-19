import { SelectedWaterMeterModel, WaterMetersModel } from "../store.model.ts/watersmeters.store.model";
import { BaseSelector } from "./base.selector";

export class WaterMeterSelectors extends BaseSelector<WaterMetersModel, SelectedWaterMeterModel>{
    public static readonly selectors:WaterMeterSelectors = new WaterMeterSelectors();

    constructor(){
        super("watersmeters", "selectedWaterMeter", "selectedWaterMeterList");
    }
}