import { BuildingFloor } from "src/app/core/models/buildings-floors";
import { BaseAction } from "./base.action";

export class BuildingFloorActions extends BaseAction<BuildingFloor>{

    public static readonly actions:BuildingFloorActions = new BuildingFloorActions();
    constructor(){
        super("[BuildingFloorActions]");
    }
}