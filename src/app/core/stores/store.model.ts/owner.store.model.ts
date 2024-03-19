
import { Owner } from "src/app/core/models/owners";

export interface OwnersModel{
    list:Owner[]
}

export interface SelectedOwnersModel{
    selected?:Owner
}