import { ContractsSettings } from "src/app/core/models/contracts-settings";
import { ContractSettingsActions } from "../actions/contract-setting.actions";
import { BaseReducer } from "./base.reducer";

export class ContractSettingReducers extends BaseReducer<ContractsSettings>{
    public static readonly reducers:ContractSettingReducers = new ContractSettingReducers();
    constructor(){
        super(ContractSettingsActions.actions);
    }
}