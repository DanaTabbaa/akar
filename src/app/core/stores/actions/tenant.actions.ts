import { Tenants } from "../../models/tenants";
import { BaseAction } from "./base.action";

export class TenantActions extends BaseAction<Tenants>{

    public static readonly actions:TenantActions = new TenantActions();
    constructor(){
        super("[TenantActions]");
    }
}