import { BuildingFloor } from "src/app/core/models/buildings-floors";
import { BuildingFloorActions } from "../actions/buildingfloor.actions";
import { BaseReducer } from "./base.reducer";

export class BuildingFloorReducers extends BaseReducer<BuildingFloor>{
    public static readonly reducers:BuildingFloorReducers = new BuildingFloorReducers();
    constructor(){
        super(BuildingFloorActions.actions);
    }
}