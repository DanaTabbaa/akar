import { BaseAction } from "./base.action";
import { Office } from '../../models/offices';

export class OfficeActions extends BaseAction<Office>{

    public static readonly actions:OfficeActions = new OfficeActions();
    constructor(){
        super("[OfficeActions]");
    }
}