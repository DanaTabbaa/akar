import { AreaUsers } from "src/app/core/models/area-users";

export interface AreasUsersModel{
    list:AreaUsers[]
}

export interface SelectedAreaUserModel{
    selected?:AreaUsers
}