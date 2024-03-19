import { RealestatesUsers } from "src/app/core/models/realestates-users";
import { BaseAction } from "./base.action";

export class RealestateUsersActions extends BaseAction<RealestatesUsers>{

    public static readonly actions:RealestateUsersActions = new RealestateUsersActions();
    constructor(){
        super("[RealestateUsersActions]");
    }
}