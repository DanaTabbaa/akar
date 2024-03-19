import { SelectedBuildingFloorUserModel, BuildingsFloorsUsersModel } from "../store.model.ts/buildingsfloorsusers.store.model";
import { BaseSelector } from "./base.selector";

export class BuildingFloorUserSelectors extends BaseSelector<BuildingsFloorsUsersModel, SelectedBuildingFloorUserModel>{
    public static readonly selectors:BuildingFloorUserSelectors = new BuildingFloorUserSelectors();

    constructor(){
        super("buildingsFloorsUsers", "selectedBuildingFloorUser", "selectedBuildingFloorUserList");
    }
}