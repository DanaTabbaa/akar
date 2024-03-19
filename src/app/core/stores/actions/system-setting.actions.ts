import { SystemSettings } from "../../models/system-settings";
import { BaseAction } from "./base.action";

export class SystemSettingActions extends BaseAction<SystemSettings>{

    public static readonly actions:SystemSettingActions = new SystemSettingActions();
    constructor(){
        super("[SystemSettingActions]");
    }
}