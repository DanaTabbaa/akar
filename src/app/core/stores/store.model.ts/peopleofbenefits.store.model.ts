import { PeopleOfBenefit } from "src/app/core/models/people-of-benefits"
export interface PeopleOfBenefitsModel{
    list:PeopleOfBenefit[]
}

export interface SelectedPeopleOfBenefitsModel{
    selected?:PeopleOfBenefit
}