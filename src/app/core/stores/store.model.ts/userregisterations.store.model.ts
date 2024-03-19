import { UserRegisterations } from "src/app/core/models/user-registerations";

export interface UserRegisterationsModel{
    list:UserRegisterations[]
}

export interface SelectedUserRegisterationModel{
    selected?:UserRegisterations
}
