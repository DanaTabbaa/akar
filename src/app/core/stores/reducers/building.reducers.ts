import { Building } from "src/app/core/models/buildings";
import { BuildingActions } from "../actions/building.actions";
import { BaseReducer } from "./base.reducer";

export class BuildingReducers extends BaseReducer<Building>{
    public static readonly reducers:BuildingReducers = new BuildingReducers();
    constructor(){
        super(BuildingActions.actions);
    }
}