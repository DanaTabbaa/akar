import { CitiesUsers } from "src/app/core/models/cities-users";
import { BaseAction } from "./base.action";

export class CityUserActions extends BaseAction<CitiesUsers>{

    public static readonly actions:CityUserActions = new CityUserActions();
    constructor(){
        super("[CityUserActions]");
    }
}