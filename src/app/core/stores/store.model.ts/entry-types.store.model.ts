import { EntryType } from "src/app/core/models/entry-type";

export interface EntryTypeModel{
    list:EntryType[]
}

export interface SelectedEntryTypeModel{
    selected?:EntryType
}