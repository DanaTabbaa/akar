import { CitiesUsers } from "src/app/core/models/cities-users";

export interface CitiesUsersModel{
    list:CitiesUsers[]
}

export interface SelectedCityUserModel{
    selected?:CitiesUsers
}