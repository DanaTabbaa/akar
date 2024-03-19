import { SelectedBuildingUserModel, BuildingsUsersModel } from "../store.model.ts/buildingsusers.store.model";
import { BaseSelector } from "./base.selector";

export class BuildingUserSelectors extends BaseSelector<BuildingsUsersModel, SelectedBuildingUserModel>{
    public static readonly selectors:BuildingUserSelectors = new BuildingUserSelectors();

    constructor(){
        super("buildingsusers", "selectedBuildingUser", "selectedBuildingUserList");
    }
}