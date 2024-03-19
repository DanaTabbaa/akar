import { SelectedSalesContractsUsersModel, SalesContractsUsersModel } from "../store.model.ts/salescontractsusers.store.model";
import { BaseSelector } from "./base.selector";

export class SaleContractUserSelectors extends BaseSelector<SalesContractsUsersModel, SelectedSalesContractsUsersModel>{
    public static readonly selectors:SaleContractUserSelectors = new SaleContractUserSelectors();

    constructor(){
        super("salescontractsusers", "selectedSalesContractUser", "selectedSalesContractUserList");
    }
}