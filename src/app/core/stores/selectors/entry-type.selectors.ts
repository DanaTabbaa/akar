import { SelectedEntryTypeModel, EntryTypeModel } from "../store.model.ts/entry-types.store.model";
import { BaseSelector } from "./base.selector";

export class EntryTypeSelectors extends BaseSelector<EntryTypeModel, SelectedEntryTypeModel>{
    public static readonly selectors:EntryTypeSelectors = new EntryTypeSelectors();

    constructor(){
        super("entryTypes", "selectedEntryType", "selectedEntryTypeList");
    }
}