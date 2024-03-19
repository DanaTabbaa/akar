import { District } from "src/app/core/models/district";

export interface DistrictModel{
    list:District[]
}

export interface SelectedDistrictModel{
    selected?:District
}