import { OfficeUser } from '../../core/models/offices-users';

export interface OfficeUserModel{
    list:OfficeUser[]
}

export interface SelectedOfficeUserModel{
    selected?:OfficeUser
}