
import { OfficeModel, SelectedOfficeModel } from '../store.model.ts/office.store.model';
import { BaseSelector } from "./base.selector";

export class OfficeSelectors extends BaseSelector<OfficeModel, SelectedOfficeModel>{
    public static readonly selectors:OfficeSelectors = new OfficeSelectors();

    constructor(){
        super("office", "selectedOffice", "selectedOfficeList");
    }
}