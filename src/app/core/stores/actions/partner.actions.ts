import { BaseAction } from "./base.action";
import { Partners } from "src/app/core/models/partners"; 
export class PartnerActions extends BaseAction<Partners>{

    public static readonly actions:PartnerActions = new PartnerActions();
    constructor(){
        super("[PartnerActions]");
    }
}