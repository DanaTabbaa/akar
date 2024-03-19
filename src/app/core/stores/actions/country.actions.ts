import { Countries } from "src/app/core/models/countries";
import { BaseAction } from "./base.action";

export class CountryActions extends BaseAction<Countries>{

    public static readonly actions:CountryActions = new CountryActions();
    constructor(){
        super("[CountryActions]");
    }
}