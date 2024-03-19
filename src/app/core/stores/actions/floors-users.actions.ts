import { BaseAction } from "./base.action";
import { FloorsUsers } from '../../models/floors-users';

export class FloorsUsersActions extends BaseAction<FloorsUsers>{

    public static readonly actions:FloorsUsersActions = new FloorsUsersActions();
    constructor(){
        super("[FloorsUsersActions]");
    }
}