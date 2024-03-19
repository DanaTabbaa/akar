import { Currencies } from "../../models/currencies";
import { BaseAction } from "./base.action";

export class CurrenciesActions extends BaseAction<Currencies>{

    public static readonly actions:CurrenciesActions = new CurrenciesActions();
    constructor(){
        super("[CurrenciesActions]");
    }
}
