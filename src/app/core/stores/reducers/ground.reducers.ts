import { Area } from "src/app/core/models/area";
import { AreaActions } from "../actions/area.actions";
import { BaseReducer } from "./base.reducer";
import { Ground } from 'src/app/core/models/grounds';
import { GroundActions } from '../actions/ground.actions';

export class GroundReducers extends BaseReducer<Ground>{
    public static readonly reducers:GroundReducers = new GroundReducers();
    constructor(){
        super(GroundActions.actions);
    }
}