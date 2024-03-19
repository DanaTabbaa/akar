import { Suppliers } from "../../models/suppliers";
import { BaseAction } from "./base.action";

export class SuppliersActions extends BaseAction<Suppliers>{

    public static readonly actions:SuppliersActions = new SuppliersActions();
    constructor(){
        super("[SuppliersActions]");
    }
}