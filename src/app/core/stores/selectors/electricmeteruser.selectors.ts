import { SelectedElectricMetersUsersModel, ElectricMetersUsersModel } from "../store.model.ts/electricmetersusers.store.model";
import { BaseSelector } from "./base.selector";

export class ElectricMeterUserSelectors extends BaseSelector<ElectricMetersUsersModel, SelectedElectricMetersUsersModel>{
    public static readonly selectors:ElectricMeterUserSelectors = new ElectricMeterUserSelectors();

    constructor(){
        super("electricmetersusers", "selectedElectricMeterUser", "selectedElectricMeterUserList");
    }
}