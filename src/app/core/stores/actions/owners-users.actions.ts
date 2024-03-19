import { Area } from "src/app/core/models/area";
import { OwnerUser } from "src/app/core/models/owners-users";
import { BaseAction } from "./base.action";

export class OwnerUserActions extends BaseAction<OwnerUser>{

    public static readonly actions:OwnerUserActions = new OwnerUserActions();
    constructor(){
        super("[OwnerUserActions]");
    }
}