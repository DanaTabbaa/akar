

import { Owner } from "../../models/owners";
import { BaseAction } from "./base.action";

export class OwnerActions extends BaseAction<Owner>{

    public static readonly actions:OwnerActions = new OwnerActions();
    constructor(){
        super("[OwnerActions]");
    }
}