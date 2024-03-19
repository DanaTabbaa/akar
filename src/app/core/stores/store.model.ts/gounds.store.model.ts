import { Ground } from 'src/app/core/models/grounds';

export interface GroundsModel{
    list:Ground[]
}

export interface SelectedGroundModel{
    selected?:Ground
}