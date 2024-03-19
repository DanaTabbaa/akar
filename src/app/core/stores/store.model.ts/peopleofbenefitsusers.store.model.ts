import { PeopleOfBenefitsUsers } from "src/app/core/models/people-of-benefits-users"
export interface PeopleOfBenefitsUsersModel{
    list:PeopleOfBenefitsUsers[]
}

export interface SelectedPeopleOfBenefitsUsersModel{
    selected?:PeopleOfBenefitsUsers
}