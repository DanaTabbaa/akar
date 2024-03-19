import { Area } from "src/app/core/models/area";
import { OfficeUser } from "src/app/core/models/offices-users";
import { BaseAction } from "./base.action";

export class OfficeUserActions extends BaseAction<OfficeUser>{

    public static readonly actions:OfficeUserActions = new OfficeUserActions();
    constructor(){
        super("[OfficeUserActions]");
    }
}