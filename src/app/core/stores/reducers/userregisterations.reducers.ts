import { UserRegisterations } from "../../models/user-registerations";
import { UserRegisterationActions } from "../actions/userregisterations.actions";
import { BaseReducer } from "./base.reducer";

export class UserRegisterationReducers extends BaseReducer<UserRegisterations>{
    public static readonly reducers:UserRegisterationReducers = new UserRegisterationReducers();
    constructor(){
        super(UserRegisterationActions.actions);
    }
}