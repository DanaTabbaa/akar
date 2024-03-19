import { Unit } from "src/app/core/models/units";
import { BaseAction } from "./base.action";

export class UnitActions extends BaseAction<Unit>{

    public static readonly actions:UnitActions = new UnitActions();
    constructor(){
        super("[UnitActions]");
    }
}