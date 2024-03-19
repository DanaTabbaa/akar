import { Partners } from "src/app/core/models/partners"
import { PartnerActions } from "../actions/partner.actions"
export interface PartnerModel{
    list:PartnerActions[]
}

export interface SelectedPartnerModel{
    selected?:Partners
}