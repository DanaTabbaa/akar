import { SystemSettings } from "src/app/core/models/system-settings";

export interface SystemSettingModel{
    list:SystemSettings[]
}

export interface SelectedSystemSettingModel{
    selected?:SystemSettings
}