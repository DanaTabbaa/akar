import { SelectedElectricMetersModel, ElectricMetersModel } from "../store.model.ts/electricmeters.store.model";
import { BaseSelector } from "./base.selector";

export class ElectricMeterSelectors extends BaseSelector<ElectricMetersModel, SelectedElectricMetersModel>{
    public static readonly selectors:ElectricMeterSelectors = new ElectricMeterSelectors();

    constructor(){
        super("electricmeters", "selectedElectricMeter", "selectedElectricMeterList");
    }
}