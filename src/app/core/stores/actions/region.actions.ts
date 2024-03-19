import { Region } from "src/app/core/models/regions";
import { BaseAction } from "./base.action";

export class RegionActions extends BaseAction<Region>{

    public static readonly actions:RegionActions = new RegionActions();
    constructor(){
        super("[RegionActions]");
    }
}