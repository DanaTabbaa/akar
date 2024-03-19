import { PartnerUser } from "src/app/core/models/partners-users";

export interface PartnersUsersModel{
    list:PartnerUser[]
}

export interface SelectedPartnerUserModel{
    selected?:PartnerUser
}