import { Building } from "src/app/core/models/buildings";
import { BaseAction } from "./base.action";

export class BuildingActions extends BaseAction<Building>{

    public static readonly actions:BuildingActions = new BuildingActions();
    constructor(){
        super("[BuildingActions]");
    }
}