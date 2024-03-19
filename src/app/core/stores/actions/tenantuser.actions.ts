import { TenantsUser } from "src/app/core/models/tenants-users";
import { BaseAction } from "./base.action";

export class TenantsUserActions extends BaseAction<TenantsUser>{

    public static readonly actions:TenantsUserActions = new TenantsUserActions();
    constructor(){
        super("[TenantsUserActions]");
    }
}