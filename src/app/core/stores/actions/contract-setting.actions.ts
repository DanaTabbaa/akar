import { ContractsSettings } from "src/app/core/models/contracts-settings";
import { BaseAction } from "./base.action";

export class ContractSettingsActions extends BaseAction<ContractsSettings>{

    public static readonly actions:ContractSettingsActions = new ContractSettingsActions();
    constructor(){
        super("[ContractSettingsActions]");
    }
}