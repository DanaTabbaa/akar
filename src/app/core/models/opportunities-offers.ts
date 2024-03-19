import { Opportunity } from "./opportunity";

export class OpportunitiesOffers {
    id!: number;
    opportunityId!: number;
    status!: boolean;
    expireDate:any;
    opportunity!:Opportunity;
}