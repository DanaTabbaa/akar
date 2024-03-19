import { BuildingUser } from "src/app/core/models/buildings-users";
import { BaseAction } from "./base.action";

export class BuildingUserActions extends BaseAction<BuildingUser>{

    public static readonly actions:BuildingUserActions = new BuildingUserActions();
    constructor(){
        super("[BuildingUserActions]");
    }
}