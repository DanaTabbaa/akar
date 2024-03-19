import { UnitsUsers } from "src/app/core/models/units-users";

export interface UnitsUsersModel{
    list:UnitsUsers[]
}

export interface SelectedUnitUserModel{
    selected?:UnitsUsers
}