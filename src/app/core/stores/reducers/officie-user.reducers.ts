import { Area } from "src/app/core/models/area";
import { AreaActions } from "../actions/area.actions";
import { BaseReducer } from "./base.reducer";
import { OfficeUserActions } from '../actions/officie-user.actions';
import { OfficeUser } from 'src/app/core/models/offices-users';

export class OfficeUserReducers extends BaseReducer<OfficeUser>{
    public static readonly reducers:OfficeUserReducers = new OfficeUserReducers();
    constructor(){
        super(OfficeUserActions.actions);
    }
}