import { MaintenanceBills } from "../../models/maintenance-bills";
import { MaintenanceBillsActions } from "../actions/maintenance-bills.actions";
import { BaseReducer } from "./base.reducer";

export class MaintenanceBillsReducers extends BaseReducer<MaintenanceBills>{
    public static readonly reducers:MaintenanceBillsReducers = new MaintenanceBillsReducers();
    constructor(){
        super(MaintenanceBillsActions.actions);
    }
}