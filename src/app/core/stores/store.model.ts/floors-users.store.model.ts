import { FloorsUsers } from '../../core/models/floors-users';

export interface FloorsUsersModel{
    list:FloorsUsers[]
}

export interface SelectedFloorsUsersModel{
    selected?:FloorsUsers
}