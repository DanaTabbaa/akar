import { WaterMetersUsers } from "src/app/core/models/water-meters-users";
import { BaseAction } from "./base.action";

export class WaterMetersUserActions extends BaseAction<WaterMetersUsers>{

    public static readonly actions:WaterMetersUserActions = new WaterMetersUserActions();
    constructor(){
        super("[WaterMetersUserActions]");
    }
}