import { EntryType } from "src/app/core/models/entry-type";
import { EntryTypeActions } from "../actions/entry-type.actions";
import { BaseReducer } from "./base.reducer";

export class EntryTypeReducers extends BaseReducer<EntryType>{
    public static readonly reducers:EntryTypeReducers = new EntryTypeReducers();
    constructor(){
        super(EntryTypeActions.actions);
    }
}