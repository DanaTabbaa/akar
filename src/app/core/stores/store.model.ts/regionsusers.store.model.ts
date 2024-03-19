import { RegionsUser } from "src/app/core/models/regions-users";

export interface RegionsUsersModel{
    list:RegionsUser[]
}

export interface SelectedRegionUserModel{
    selected?:RegionsUser
}