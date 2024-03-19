import { MaintenanceBillsUsers } from "../../models/maintenance-bills-users";
import { MaintenanceBillsUsersActions } from "../actions/maintenance-bills-users.actions";
import { BaseReducer } from "./base.reducer";

export class MaintenanceBillsUsersReducers extends BaseReducer<MaintenanceBillsUsers>{
    public static readonly reducers:MaintenanceBillsUsersReducers = new MaintenanceBillsUsersReducers();
    constructor(){
        super(MaintenanceBillsUsersActions.actions);
    }
}