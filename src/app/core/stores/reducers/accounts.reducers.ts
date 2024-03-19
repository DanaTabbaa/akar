import { Accounts } from "../../models/accounts";
import { AccountsActions } from "../actions/accounts.actions";
import { BaseReducer } from "./base.reducer";

export class AccountsReducers extends BaseReducer<Accounts>{
    public static readonly reducers:AccountsReducers = new AccountsReducers();
    constructor(){
        super(AccountsActions.actions);
    }
}