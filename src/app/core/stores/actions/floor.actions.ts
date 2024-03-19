import { Floor } from "src/app/core/models/floors";
import { BaseAction } from "./base.action";

export class FloorActions extends BaseAction<Floor>{

    public static readonly actions:FloorActions = new FloorActions();
    constructor(){
        super("[FloorsActions]");
    }
}