import { User } from "src/app/core/models/users";
import { UserActions } from "../actions/user.actions";
import { BaseReducer } from "./base.reducer";

export class UserReducers extends BaseReducer<User>{
    public static readonly reducers:UserReducers = new UserReducers();
    constructor(){
        super(UserActions.actions);
    }
}