import { BuildingFloorUser } from "src/app/core/models/buildings-floors-users";
import { BuildingFloorUserActions } from "../actions/buildingflooruser.actions";
import { BaseReducer } from "./base.reducer";

export class BuildingFloorUserReducers extends BaseReducer<BuildingFloorUser>{
    public static readonly reducers:BuildingFloorUserReducers = new BuildingFloorUserReducers();
    constructor(){
        super(BuildingFloorUserActions.actions);
    }
}