import { OwnerUser } from "../../models/owners-users"



export interface OwnerUserModel{
    list:OwnerUser[]
}

export interface SelectedOwnerUserModel{
    selected?:OwnerUser
}