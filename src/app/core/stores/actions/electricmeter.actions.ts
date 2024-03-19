import { ElectricityMeters } from "src/app/core/models/electricity-meters";
import { BaseAction } from "./base.action";

export class ElectricMeterActions extends BaseAction<ElectricityMeters>{

    public static readonly actions:ElectricMeterActions = new ElectricMeterActions();
    constructor(){
        super("[ElectricMeterActions]");
    }
}