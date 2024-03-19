import { RealestatesUsers } from "src/app/core/models/realestates-users";
import { RealestateUsersActions } from "../actions/realestateuser.actions";
import { BaseReducer } from "./base.reducer";

export class RealestateUserReducers extends BaseReducer<RealestatesUsers>{
    public static readonly reducers:RealestateUserReducers = new RealestateUserReducers();
    constructor(){
        super(RealestateUsersActions.actions);
    }
}