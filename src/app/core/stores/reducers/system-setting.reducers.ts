
import { SystemSettings } from "../../models/system-settings";
import { SystemSettingActions } from "../actions/system-setting.actions";
import { BaseReducer } from "./base.reducer";

export class SystemSettingReducers extends BaseReducer<SystemSettings>{
    public static readonly reducers:SystemSettingReducers = new SystemSettingReducers();
    constructor(){
        super(SystemSettingActions.actions);
    }
}