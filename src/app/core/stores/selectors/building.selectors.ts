import { SelectedBuildingModel, BuildingsModel } from "../store.model.ts/buildings.store.model";
import { BaseSelector } from "./base.selector";

export class BuildingSelectors extends BaseSelector<BuildingsModel, SelectedBuildingModel>{
    public static readonly selectors:BuildingSelectors = new BuildingSelectors();

    constructor(){
        super("buildings", "selectedBuilding", "selectedBuildingList");
    }
}