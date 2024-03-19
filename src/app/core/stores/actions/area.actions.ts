import { Area } from "src/app/core/models/area";
import { BaseAction } from "./base.action";

export class AreaActions extends BaseAction<Area>{

    public static readonly actions:AreaActions = new AreaActions();
    constructor(){
        super("[AreaActions]");
    }
}