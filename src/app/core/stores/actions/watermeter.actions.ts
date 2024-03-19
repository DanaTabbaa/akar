import { WaterMeters } from "src/app/core/models/water-meters";
import { BaseAction } from "./base.action";

export class WaterMeterActions extends BaseAction<WaterMeters>{

    public static readonly actions:WaterMeterActions = new WaterMeterActions();
    constructor(){
        super("[WaterMeterActions]");
    }
}