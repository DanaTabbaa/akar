import { User } from "src/app/core/models/users";
import { BaseAction } from "./base.action";

export class UserActions extends BaseAction<User>{

    public static readonly actions:UserActions = new UserActions();
    constructor(){
        super("[UserActions]");
    }
}