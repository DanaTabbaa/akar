import { MaintenanceContractsSettingsDetails } from "../../models/maintenance-contract-settings-details";
import { BaseAction } from "./base.action";

export class MaintenanceContractsSettingsDetailsActions extends BaseAction<MaintenanceContractsSettingsDetails>{

    public static readonly actions:MaintenanceContractsSettingsDetailsActions = new MaintenanceContractsSettingsDetailsActions();
    constructor(){
        super("[MaintenanceContractsSettingsDetailsActions]");
    }
}