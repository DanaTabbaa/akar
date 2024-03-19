import { SelectedWaterMeterUserModel, WaterMetersUsersModel } from "../store.model.ts/watermetersusers.store.model";
import { BaseSelector } from "./base.selector";

export class WaterMeterUserSelectors extends BaseSelector<WaterMetersUsersModel, SelectedWaterMeterUserModel>{
    public static readonly selectors:WaterMeterUserSelectors = new WaterMeterUserSelectors();

    constructor(){
        super("watermetersusers", "selectedWaterMeterUser", "selectedWaterMeterUserList");
    }
}