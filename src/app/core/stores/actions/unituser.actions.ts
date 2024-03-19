import { UnitsUsers } from "src/app/core/models/units-users";
import { BaseAction } from "./base.action";

export class UnitUserActions extends BaseAction<UnitsUsers>{

    public static readonly actions:UnitUserActions = new UnitUserActions();
    constructor(){
        super("[UnitUserActions]");
    }
}