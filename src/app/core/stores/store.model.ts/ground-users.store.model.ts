import { GroundUsers } from '../../core/models/ground-users';


export interface GroundUsersModel{
    list:GroundUsers[]
}

export interface SelectedGroundUsersModel{
    selected?:GroundUsers
}