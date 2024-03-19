
import { UserRegisterations } from "../../models/user-registerations";
import { BaseAction } from "./base.action";

export class UserRegisterationActions extends BaseAction<UserRegisterations>{

    public static readonly actions:UserRegisterationActions = new UserRegisterationActions();
    constructor(){
        super("[UserRegisterationActions]");
    }
}