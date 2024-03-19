import { Ground} from "src/app/core/models/grounds";
import { BaseAction } from "./base.action";

export class GroundActions extends BaseAction<Ground>{

    public static readonly actions:GroundActions = new GroundActions();
    constructor(){
        super("[GroundActions]");
    }
}