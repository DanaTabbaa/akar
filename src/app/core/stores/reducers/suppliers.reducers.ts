import { Suppliers } from "../../models/suppliers";
import { SuppliersActions } from "../actions/suppliers.actions";
import { BaseReducer } from "./base.reducer";

export class SuppliersReducers extends BaseReducer<Suppliers>{
    public static readonly reducers:SuppliersReducers = new SuppliersReducers();
    constructor(){
        super(SuppliersActions.actions);
    }
}