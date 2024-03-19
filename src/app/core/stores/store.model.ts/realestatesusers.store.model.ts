import { RealestatesUsers } from "src/app/core/models/realestates-users";

export interface RealestatesUsersModel{
    list:RealestatesUsers[]
}

export interface SelectedRealestateUserModel{
    selected?:RealestatesUsers
}