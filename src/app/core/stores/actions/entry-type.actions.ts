import { EntryType } from "src/app/core/models/entry-type";
import { BaseAction } from "./base.action";

export class EntryTypeActions extends BaseAction<EntryType>{

    public static readonly actions:EntryTypeActions = new EntryTypeActions();
    constructor(){
        super("[EntryTypesActions]");
    }
}