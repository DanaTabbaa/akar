import { VendorsUser } from "src/app/core/models/vendors-users";
import { BaseAction } from "./base.action";

export class VendorsUserActions extends BaseAction<VendorsUser>{

    public static readonly actions:VendorsUserActions = new VendorsUserActions();
    constructor(){
        super("[VendorsUserActions]");
    }
}