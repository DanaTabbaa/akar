import { Area } from "src/app/core/models/area";
import { BaseAction } from "./base.action";
import { GroundUsers } from '../../models/ground-users';

export class GroundUsersActions extends BaseAction<GroundUsers>{

    public static readonly actions:GroundUsersActions = new GroundUsersActions();
    constructor(){
        super("[GroundUsersActions]");
    }
}