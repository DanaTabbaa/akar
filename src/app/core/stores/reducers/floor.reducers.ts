
import { BaseReducer } from "./base.reducer";
import { Floor } from "src/app/core/models/floors";
import { FloorActions } from '../actions/floor.actions';

export class FloorReducers extends BaseReducer<Floor>{
    public static readonly reducers:FloorReducers = new FloorReducers();
    constructor(){
        super( FloorActions.actions);
    }
}