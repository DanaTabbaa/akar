import { ElectricityMetersUsers } from "src/app/core/models/electricity-meters-users";
import { BaseAction } from "./base.action";

export class ElectricMeterUserActions extends BaseAction<ElectricityMetersUsers>{

    public static readonly actions:ElectricMeterUserActions = new ElectricMeterUserActions();
    constructor(){
        super("[ElectricMeterUserActions]");
    }
}