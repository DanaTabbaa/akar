import { SelectedUnitModel, UnitsModel } from "../store.model.ts/units.store.model";
import { BaseSelector } from "./base.selector";

export class UnitSelectors extends BaseSelector<UnitsModel, SelectedUnitModel>{
    public static readonly selectors:UnitSelectors = new UnitSelectors();

    constructor(){
        super("units", "selectedUnit", "selectedUnitList");
    }
}