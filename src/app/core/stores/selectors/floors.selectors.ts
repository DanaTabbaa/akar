
import { FloorsModel, SelectedFloorModel } from "../store.model.ts/floors.store.model";
import { BaseSelector } from "./base.selector";

export class FloorSelectors extends BaseSelector<FloorsModel, SelectedFloorModel>{
    public static readonly selectors:FloorSelectors = new FloorSelectors();

    constructor(){
        super("floors", "selectedFloor", "selectedFloorList");
    }
}