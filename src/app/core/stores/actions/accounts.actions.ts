import { Accounts } from "../../models/accounts";
import { BaseAction } from "./base.action";

export class AccountsActions extends BaseAction<Accounts>{

    public static readonly actions:AccountsActions = new AccountsActions();
    constructor(){
        super("[AccountsActions]");
    }
}