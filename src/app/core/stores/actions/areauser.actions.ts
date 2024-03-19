import { AreaUsers } from "src/app/core/models/area-users";
import { BaseAction } from "./base.action";

export class AreaUserActions extends BaseAction<AreaUsers>{

    public static readonly actions:AreaUserActions = new AreaUserActions();
    constructor(){
        super("[AreaUserActions]");
    }
}