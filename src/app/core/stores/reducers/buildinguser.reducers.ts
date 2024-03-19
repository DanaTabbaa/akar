import { BuildingUser } from "src/app/core/models/buildings-users";
import { BuildingUserActions } from "../actions/buildinguser.actions";
import { BaseReducer } from "./base.reducer";

export class BuildingUserReducers extends BaseReducer<BuildingUser>{
    public static readonly reducers:BuildingUserReducers = new BuildingUserReducers();
    constructor(){
        super(BuildingUserActions.actions);
    }
}