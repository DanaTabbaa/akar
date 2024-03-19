import { SelectedSystemSettingModel, SystemSettingModel } from "../store.model.ts/system-setting.store.model";
import { BaseSelector } from "./base.selector";

export class SystemSettingsSelectors extends BaseSelector<SystemSettingModel, SelectedSystemSettingModel>{
    public static readonly selectors:SystemSettingsSelectors = new SystemSettingsSelectors();

    constructor(){
        super("systemSettings", "selectedSystemSetting", "selectedSystemSettingList");
    }
}