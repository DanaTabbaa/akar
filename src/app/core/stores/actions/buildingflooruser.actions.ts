import { BuildingFloorUser } from "src/app/core/models/buildings-floors-users";
import { BaseAction } from "./base.action";

export class BuildingFloorUserActions extends BaseAction<BuildingFloorUser>{

    public static readonly actions:BuildingFloorUserActions = new BuildingFloorUserActions();
    constructor(){
        super("[BuildingFloorUserActions]");
    }
}