import { BaseAction } from "./base.action";
import { PartnerUser } from "src/app/core/models/partners-users";
export class PartnerUserActions extends BaseAction<PartnerUser>{

    public static readonly actions:PartnerUserActions = new PartnerUserActions();
    constructor(){
        super("[PartnerUserActions]");
    }
}