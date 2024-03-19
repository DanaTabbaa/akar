import { SelectedAreaModel, AreasModel } from "../store.model.ts/areas.store.model";
import { BaseSelector } from "./base.selector";

export class AreaSelectors extends BaseSelector<AreasModel, SelectedAreaModel>{
    public static readonly selectors:AreaSelectors = new AreaSelectors();

    constructor(){
        super("floorsUsers", "selectedFloorsUsers", "selectedFloorsUsersList");
    }
}