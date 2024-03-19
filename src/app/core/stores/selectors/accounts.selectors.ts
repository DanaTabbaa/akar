import { AccountsModel, SelectedAccountsModel } from "../store.model.ts/accounts.store.model";
import { BaseSelector } from "./base.selector";

export class AccountsSelectors extends BaseSelector<AccountsModel, SelectedAccountsModel>{
    public static readonly selectors:AccountsSelectors = new AccountsSelectors();

    constructor(){
        super("accounts", "selectedAccounts", "selectedAccountsList");
    }
}