import { RegionsUser } from "src/app/core/models/regions-users";
import { BaseAction } from "./base.action";

export class RegionsUserActions extends BaseAction<RegionsUser>{

    public static readonly actions:RegionsUserActions = new RegionsUserActions();
    constructor(){
        super("[RegionsUserActions]");
    }
}