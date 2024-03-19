import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { Attributes } from '../../models/attributes';
import { Cities } from '../../models/cities';
import { Countries } from '../../models/countries';
import { OpportunitiesOffers } from '../../models/opportunities-offers';
import { OpportunitiesSpecials } from '../../models/opportunities-specials';
import { Opportunity } from '../../models/opportunity';
import { OpportunityType } from '../../models/opportunity-type';
import { ResponseResult } from '../../models/ResponseResult';
import { Unit } from '../../models/units';
import { SearchAttributesVM } from '../../view-models/search-attibute-vm';
import { AttributeService } from './attribute.service';
import { CitiesService } from './cities.service';
import { CountriesService } from './countries.service';
import { OpportunitiesOffersService } from './opportunities-offers.service';
import { OpportunitiesSpecialsService } from './opportunities-spcials.service';
import { OpportunityTypeService } from './opportunity-type.service';
import { OpportunityService } from './opportunity.setvice';
import { UnitsService } from './units.service';
@Injectable({
    providedIn: 'any'
})
export class WebsiteService {

    private opportunities: Opportunity[] = [];
    private countries: Countries[] = [];
    private subsList: Subscription[] = [];
    private units: Unit[] = [];
    private attributes: Attributes[] = [];
    private opportunitiesTypes: OpportunityType[] = [];
    private cities: Cities[] = [];
    private offers: OpportunitiesOffers[] = [];
    private specials: OpportunitiesSpecials[] = [];
    private recentOpportunities: Opportunity[] = [];

    constructor(private unitService: UnitsService,
        private countriesService: CountriesService,
        private opportunityService: OpportunityService,
        private attributeService: AttributeService,
        private opportunityTypeService: OpportunityTypeService,
        private citiesService: CitiesService,
        private opportunityOfferService: OpportunitiesOffersService,
        private opportunitySpecialService: OpportunitiesSpecialsService) { }

    loadUnits() {
        return new Promise<void>((acc, rej) => {
            let sub = this.unitService.getWithResponseForWebsite<Unit[]>("GetAll")
                .subscribe(
                    {
                        next: (res: ResponseResult<Unit[]>) => {
                            acc();
                            if (res.success) {
                                this.units = [...res.data ?? []];
                            }

                        },
                        error: (err: any) => {
                            //((err);
                            acc();
                        },
                        complete: () => {

                        }
                    }
                );
            this.subsList.push(sub);
        });
    }

    loadOpportunities() {
        return new Promise<void>((acc, rej) => {
             
            let sub = this.opportunityService.getWithResponseForWebsite<Opportunity[]>("GetAll?includes=AttributesValues,OpportunityUser.RegRequest,OpportunitiesImages")
                .subscribe(
                    {
                        next: (res: ResponseResult<Opportunity[]>) => {
                            acc();
                            if (res.success) {
                                this.opportunities = [...res.data ?? []];
                            }

                        },
                        error: (err: any) => {
                            //((err);
                            acc();
                        },
                        complete: () => {

                        }
                    }
                );
            this.subsList.push(sub);
        });
    }


    loadOpportunitiesTypes() {
        return new Promise<void>((acc, rej) => {
            let sub = this.opportunityTypeService.getWithResponseForWebsite<OpportunityType[]>("GetAllForWebsite")
                .subscribe(
                    {
                        next: (res: ResponseResult<OpportunityType[]>) => {
                            acc();
                            if (res.success) {
                                this.opportunitiesTypes = [...res.data ?? []];
                            }

                        },
                        error: (err: any) => {
                            //((err);
                            acc();
                        },
                        complete: () => {

                        }
                    }
                );
            this.subsList.push(sub);
        });
    }


    loadCountries() {

        return new Promise<void>((resolve, reject) => {
            let sub = this.countriesService.getWithResponseForWebsite<Countries[]>("GetAllUnAuthorized").subscribe({
                next: (res: ResponseResult<Countries[]>) => {
                    if (res.success) {
                        this.countries = [...res.data ?? []];
                    }

                    resolve();
                    //(('res', res);
                    //((' this.countries', this.countries);
                },
                error: (err: any) => {
                    //reject(err);
                    resolve();
                },
                complete: () => {
                    //(('complete');
                },
            });
            this.subsList.push(sub);
        });

    }


    loadCities() {

        return new Promise<void>((resolve, reject) => {
            let sub = this.citiesService.getWithResponseForWebsite<Cities[]>("GetAllForWebsite").subscribe({
                next: (res: ResponseResult<Cities[]>) => {
                    if (res.success) {
                        this.cities = [...res.data ?? []];
                    }
                    resolve();
                    //(('res', res);
                    //((' this.countries', this.countries);
                },
                error: (err: any) => {
                    //reject(err);
                    resolve();
                },
                complete: () => {
                    //(('complete');
                },
            });
            this.subsList.push(sub);
        });

    }



    getCountries() {
        return [...this.countries];
    }

    getCities() {
        return [...this.cities];
    }

    getUnits() {
        return [...this.units];
    }

    destroy() {
        this.subsList.forEach(s => {
            if (s) {
                s.unsubscribe();
            }
        });

        this.opportunities = [];
        this.countries = [];
        this.attributes = [];
        this.recentOpportunities=[];
    }


    loadAttributes() {
        return new Promise<void>((resolve, reject) => {
            let sub = this.attributeService.getWithResponseForWebsite<Attributes[]>("GetAllForWebsite").subscribe({
                next: (res: ResponseResult<Attributes[]>) => {
                    resolve();
                    if (res.success) {
                        this.attributes = [...res.data ?? []];
                    }
                },
                error: (err: any) => {
                    //reject(err);
                    resolve();
                },
                complete: () => {

                },
            });
            this.subsList.push(sub);
        });
    }

    getAttributes() {
        return [...this.attributes];
    }

    private searchOpprtunities: Opportunity[] = [];

    searchOpportunitises(
        fromPrice: any, 
        toPrice: any, 
        cityId: any, 
        type: any, 
        purpose: any, 
        keywords: string, 
        searchAttributeValues: SearchAttributesVM[]
        ) {
        return new Promise<void>((acc, rej) => {
            let sub = this.opportunityService.postWithResponseForWebsite<Opportunity[]>(`Search?fromPrice=${fromPrice}&toPrice=${toPrice}&cityId=${cityId}&type=${type}&purpose=${purpose}&keywords=${keywords}`, searchAttributeValues)
                .subscribe(
                    {
                        next: (res: ResponseResult<Opportunity[]>) => {
                            acc();
                            if (res.success) {
                                 
                                this.searchOpprtunities = [...res.data ?? []];
                            }

                        },
                        error: (err: any) => {
                            //((err);
                            acc();
                        },
                        complete: () => {

                        }
                    }
                );
            this.subsList.push(sub);
        });
    }

    getOpportunites() {
        return [...this.opportunities];
    }

    getSearchOpportunites() {
        return [...this.searchOpprtunities];
    }

    getOpportunitesTypes() {
        return [...this.opportunitiesTypes];
    }




    loadOpportunitiesOffersForWebsite() {
        return new Promise<void>((acc, rej) => {
             
            let sub = this.opportunityOfferService.getWithResponseForWebsite<OpportunitiesOffers[]>("GetAllForWebsite")
                .subscribe(
                    {
                        next: (res: ResponseResult<OpportunitiesOffers[]>) => {
                            acc();
                            if (res.success) {
                                this.offers = [...res.data ?? []];
                            }

                        },
                        error: (err: any) => {
                            //((err);
                            acc();
                        },
                        complete: () => {

                        }
                    }
                );
            this.subsList.push(sub);
        });
    }
    loadRecentOpportunities() {
        return new Promise<void>((acc, rej) => {
             
            let sub = this.opportunityService.getWithResponseForWebsite<Opportunity[]>("GetRecent?includes=AttributesValues,OpportunitiesImages")
                .subscribe(
                    {
                        next: (res: ResponseResult<Opportunity[]>) => {
                            acc();
                            if (res.success) {
                                this.recentOpportunities = [...res.data ?? []];
                            }

                        },
                        error: (err: any) => {
                            //((err);
                            acc();
                        },
                        complete: () => {

                        }
                    }
                );
            this.subsList.push(sub);
        });
    }

    getOpportunitiesOffersForWebsite() {
        return [...this.offers];
    }


    loadOpportunitiesSpecialsForWebsite() {
        return new Promise<void>((acc, rej) => {
            
            let sub = this.opportunitySpecialService.getWithResponseForWebsite<OpportunitiesSpecials[]>("GetAllForWebsite?includes=Opportunity")
                .subscribe(
                    {
                        next: (res: ResponseResult<OpportunitiesSpecials[]>) => {
                            acc();
                            if (res.success) {
                                this.specials = [...res.data ?? []];
                               
                            }

                        },
                        error: (err: any) => {
                            //((err);
                            acc();
                        },
                        complete: () => {

                        }
                    }
                );
            this.subsList.push(sub);
        });
    }

    getOpportunitiesSpecialsForWebsite() {
        return [...this.specials];
    }

    getRecentOpportunities(){
        return [...this.recentOpportunities];
    }

}