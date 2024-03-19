import { Cities } from "src/app/core/models/cities";
import { BaseAction } from "./base.action";

export class CityActions extends BaseAction<Cities>{

    public static readonly actions:CityActions = new CityActions();
    constructor(){
        super("[CityActions]");
    }
}