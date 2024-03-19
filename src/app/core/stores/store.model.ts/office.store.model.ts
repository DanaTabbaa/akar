
import { Office } from "src/app/core/models/offices";

export interface OfficeModel{
    list:Office[]
}

export interface SelectedOfficeModel{
    selected?:Office
}