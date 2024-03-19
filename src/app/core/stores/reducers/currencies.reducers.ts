import { BaseReducer } from "./base.reducer";
import { Currencies } from "../../models/currencies";
import { CurrenciesActions } from "../actions/currencies.actions";

export class CurrencyReducers extends BaseReducer<Currencies>{
    public static readonly reducers:CurrencyReducers = new CurrencyReducers();
    constructor(){
        super(CurrenciesActions.actions);
    }
}
