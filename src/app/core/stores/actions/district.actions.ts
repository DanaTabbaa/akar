import { District  } from "src/app/core/models/district";
import { BaseAction } from "./base.action";

export class DistrictActions extends BaseAction<District>{

    public static readonly actions:DistrictActions = new DistrictActions();
    constructor(){
        super("[DistrictActions]");
    }
}