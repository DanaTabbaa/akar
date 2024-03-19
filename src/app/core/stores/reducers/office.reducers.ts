
import { BaseReducer } from "./base.reducer";
import { OfficeActions } from '../actions/office.actions';
import { Office } from "src/app/core/models/offices";

export class OfficeReducers extends BaseReducer<Office>{
    public static readonly reducers:OfficeReducers = new OfficeReducers();
    constructor(){
        super(OfficeActions.actions);
    }
}