import { SelectedBuildingFloorModel, BuildingsFloorsModel } from "../store.model.ts/buildingsfloors.store.model";
import { BaseSelector } from "./base.selector";

export class BuildingFloorSelectors extends BaseSelector<BuildingsFloorsModel, SelectedBuildingFloorModel>{
    public static readonly selectors:BuildingFloorSelectors = new BuildingFloorSelectors();

    constructor(){
        super("buildingsFloors", "selectedBuildingFloor", "selectedBuildingFloorList");
    }
}