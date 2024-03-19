import { VMMaintenanceContractDues } from "../../models/ViewModel/vm-maintenance-contract-dues";
import { MaintenanceContractDuesActions } from "../actions/maintenancecontractdues.actions";
import { BaseReducer } from "./base.reducer";

export class MaintenanceContractDuesReducers extends BaseReducer<VMMaintenanceContractDues>{
    public static readonly reducers:MaintenanceContractDuesReducers = new MaintenanceContractDuesReducers();
    constructor(){
        super(MaintenanceContractDuesActions.actions);
    }
}