import { Realestate } from "src/app/core/models/realestates";
import { BaseAction } from "./base.action";

export class RealestateActions extends BaseAction<Realestate>{

    public static readonly actions:RealestateActions = new RealestateActions();
    constructor(){
        super("[RealestateActions]");
    }
}