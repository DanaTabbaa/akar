import { CountriesUsers } from "src/app/core/models/countries-users";

export interface CountriesUsersModel{
    list:CountriesUsers[]
}

export interface SelectedCountryUserModel{
    selected?:CountriesUsers
}