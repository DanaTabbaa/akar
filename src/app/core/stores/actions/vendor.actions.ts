
import { Vendors } from "../../models/vendors";
import { BaseAction } from "./base.action";

export class VendorActions extends BaseAction<Vendors>{

    public static readonly actions:VendorActions = new VendorActions();
    constructor(){
        super("[VendorActions]");
    }
}