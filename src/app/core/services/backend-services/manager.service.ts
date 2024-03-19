import { Injectable, OnDestroy } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { NgxSpinnerService } from "ngx-spinner";
import { BuildingsService } from "./buildings.service";
import { RealestatesService } from "./realestates.service";
import { TenantsService } from "./tenants.service";
import { OwnersService } from "./owners.service";
import { Building } from "../../models/buildings";
import { Realestate } from "../../models/realestates";
import { Owner } from "../../models/owners";
import { Tenants } from "../../models/tenants";
import { OfficesService } from "./offices.service";
import { Office } from "../../models/offices";
import { UnitsService } from "./units.service";
import { Unit } from "../../models/units";
import { VendorsService } from "./vendors.service";
import { Vendors } from "../../models/vendors";
import { SystemSettingsService } from "./system-settings.service";
import { SystemSettings } from "../../models/system-settings";
import { ContractsSettingsService } from "./contracts-settings.service";
import { ContractsSettings } from "../../models/contracts-settings";
import { CountriesService } from "./countries.service";
import { ResponseResult } from "../../models/ResponseResult";
import { PeopleOfBenefitsService } from "./people-of-benefits.service";
import { PeopleOfBenefit } from "../../models/people-of-benefits";
import { Countries } from "../../models/countries";
import { RegionsService } from "./regions.service";
import { Region } from "../../models/regions";
import { Cities } from "../../models/cities";
import { CitiesService } from "./cities.service";
import { BillType } from "../../models/bill-type";
import { MaintenanceRequestsActions } from "../../stores/actions/maintenancerequests.actions";
import { MaintenanceRequests } from "../../models/maintenance-requests";
import { ProductsReceiptDetailsService } from "./products-receipt-details.service";
import { ProductsReceiptDetails } from "../../models/products-receipt-details";
import { ProductsReceiptDetailsActions } from "../../stores/actions/productsreceiptdetails.actions";
import { MaintenanceRequestsService } from "./maintenance-requests.service";
import { AccountService } from "./account.service";
import { SuppliersActions } from "../../stores/actions/suppliers.actions";
import { SuppliersService } from "./suppliers.service";
import { MaintenanceServicesService } from "./maintenance-services.service";
import { MaintenanceServices } from "../../models/maintenance-services";
import { MaintenanceServicesActions } from "../../stores/actions/maintenanceservices.actions";
import { ProductCategory } from "../../models/Product-category";
import { ProductsCategoriesActions } from "../../stores/actions/productscategories.actions";
import { Products } from "../../models/products";
import { ProductsActions } from "../../stores/actions/products.actions";
import { ProductsCategoriesService } from "./products-categories.service";
import { ProductsService } from "./products.service";
import { MaintenanceContractDuesService } from "./maintenance-contracts-dues.service";
import { MaintenanceContractsSettingsDetailsService } from "./maintenance-contracts-Settings-details.service";
import { MaintenanceContractDuesActions } from "../../stores/actions/maintenancecontractdues.actions";
import { MaintenanceContractsSettingsDetails } from "../../models/maintenance-contract-settings-details";
import { MaintenanceContractsSettingsDetailsActions } from "../../stores/actions/maintenancecontractssettingsdetails.actions";
import { EntryTypeService } from "./entry-type.service";
import { EntryType } from "../../models/entry-type";
import { BillTypeService } from "./bill-type.service";
import { Accounts } from "../../models/accounts";
import { PurchasersService } from "./purchasers.service";
import { RentContractDueVM } from "../../models/ViewModel/rent-contract-due-vm";
import { RentContractDuesService } from "./rent-contract-dues.service";
import { RentContractDuesActions } from "../../stores/actions/rentcontractdues.actions";
import { VMMaintenanceContractDues } from "../../models/ViewModel/vm-maintenance-contract-dues";
// import { ContractDue, ContractDueVM } from "../../models/contract-due";
// import { SalesBuyContractDuesService } from "./sales-buy-contracts-dues.service";
// import { SalesBuyContractsDuesActions } from "../../stores/actions/salescontractdue.actions";
import { Bills } from "../../models/bills";
import { BillsService } from "./bills.service";
import { Voucher } from "../../models/voucher";
import { VouchersService } from "./vouchers.service";
import { DistrictsService } from "./district.service";
import { District } from "../../models/district";
import { Purchasers } from "../../models/purchasers";
import { CurrenciesService } from "./currencies.service";
import { Currencies } from "../../models/currencies";
import { CurrenciesActions } from "../../stores/actions/currencies.actions";
import { DashboardSettings } from "../../models/dashboard-settings";
import { DashboardSettingsService } from "./dashboard-settings.service";
import { ContractService } from "./contract.service";
import { CostCenterService } from "./cost-center.service";
import { CostCenters } from "../../models/cost-centers";
import { SharedService } from "src/app/shared/services/shared.service";
import { RolesPermissionsService } from "./permissions/roles-permissions.service";
import { RolesPermissionsVm } from "../../models/ViewModel/permissions/roles-permissions-vm";
import { UserPermission } from "../../models/permissions/user-permissions";
import { Floor } from "../../models/floors";
import { FloorsService } from "./floors.service";
import { VwBuildings } from "../../view-models/vw-buildings-vm";
import { CompaniesActivitiesService } from "./companies-activities.service";
import { CompaniesActivities } from "../../models/companies-activities";
import { Nationality } from "../../models/nationality";
import { NationalityService } from "./nationality.service";
import { UnitsTypesService } from "./units-types.service";
import { UnitsTypesVM } from "../../models/ViewModel/units-types-vm";
import { GroundsService } from "./grounds.service";
import { Ground } from "../../models/grounds";
import { VendorCommissionsService } from "./vendor-commissions.service";
import { VendorCommissions } from "../../models/vendor-commissions";
import { RentContractsService } from "./rent-contracts.service";
import { UsersUsers } from "../../models/usersusers";
import { UsersUsersService } from "./users-users.service";

import { RentContractVM } from "../../models/ViewModel/rent-contract-vm";
import { PagesService } from "./pages.service";
import { ContractSettingsUsersPermissionsService } from "./contract-settings-users-permissions.service";
import { ContractSettingsRolePermissions } from "../../models/contract-settings-role-permissions";
import { UnitServices } from "../../models/unit-services";
import { UnitServicesService } from "./unit-services.service";
import { Opportunity } from "../../models/opportunity";
import { OpportunityService } from "./opportunity.setvice";
import { Attributes } from "../../models/attributes";
import { AttributeService } from "./attribute.service";
import { Roles } from "../../models/permissions/roles";
import { RolesService } from "./permissions/roles.service";
import { OpportunitiesOffersVM } from "../../models/ViewModel/opportunities-offers-vm";
import { OpportunitiesSpecialsVM } from "../../models/ViewModel/opportunities-specials-vm";
import { OpportunitiesOffersService } from "./opportunities-offers.service";
import { OpportunitiesSpecialsService } from "./opportunities-spcials.service";
import { OpportunityTypeService } from "./opportunity-type.service";
import { OpportunityType } from "../../models/opportunity-type";
import { VoucherVm } from "../../models/ViewModel/voucher-vm";
import { SalesBuyContracts } from "../../models/sales-buy-contracts";
import { SalesBuyContractVm } from "../../models/ViewModel/sales-buy-contract-vm";
import { SalesBuyContractsService } from "./sales-contracts.service";
import { GeneralAccountIntegrationSettingsComponent } from "src/app/modules/control-panel/accounting-and-finance/general-account-integration-settings/general-account-integration-settings.component";
import { GeneralIntegrationSettingsService } from "./general-integration-settings";
import { GeneralIntegrationSettings } from "../../models/general-integration-settings";

@Injectable({
    providedIn: 'any'
})
export class ManagerService {
    subsList: Subscription[] = [];
    private countries: Countries[] = [];
    private cities: Cities[] = [];
    private regions: Region[] = [];
    private districts: District[] = [];
    private buildings: Building[] = [];
    private buildingsVM: VwBuildings[] = [];
    private owners: Owner[] = [];
    private tenants: Tenants[] = [];
    private contractService: ContractService[] = [];
    private units: Unit[] = [];
    private peopleOfBenifits: PeopleOfBenefit[] = [];
    private accounts: Accounts[] = [];
    private realesatates: Realestate[] = [];
    private entryTypes: EntryType[] = [];
    private vendors: Vendors[] = [];
    private dashboardSettings: DashboardSettings[] = [];
    private billTypes: BillType[] = [];
    private bills: Bills[] = [];
    private vouchers: Voucher[] = [];
    private vouchersVm: VoucherVm[] = [];
    private offices: Office[] = [];
    private systemSettings: SystemSettings[] = [];
    private costCenters: CostCenters[] = [];
    //#region Helper Functions
    private rolePermission?: RolesPermissionsVm;
    private userPermissions?: UserPermission;
    private floors: Floor[] = [];
    private companiesActivities: CompaniesActivities[] = [];
    private nationalities: Nationality[] = [];
    private unitTypes: UnitsTypesVM[] = [];
    private grounds: Ground[] = [];
    private purchasers: Purchasers[] = [];
    private vendorCommissions: VendorCommissions[] = [];
    private contractSettings: ContractsSettings[] = [];
    private managedUsers: UsersUsers[] = [];
    private rentContractsByType: RentContractVM[] = [];
    private salesBuyContractsByType: SalesBuyContractVm[] = [];
    private rentContractUnitServices: UnitServices[] = [];
    private opportunities: Opportunity[] = [];
    private attributes: Attributes[] = [];
    private currentRole?: Roles;

    private opportunitiesOffers: OpportunitiesOffersVM[] = [];
    private opportunitiesSpecials: OpportunitiesSpecialsVM[] = [];
    private opportunitiesTypes: OpportunityType[] = [];
    private currencies: Currencies[] = [];


    constructor(
        private store: Store<any>,
        private toastrSevice: ToastrService,
        private buildingService: BuildingsService,
        private realesateService: RealestatesService,
        private unitService: UnitsService,
        private currenciesService: CurrenciesService,
        private tenantService: TenantsService,
        private ownerService: OwnersService,
        private officeService: OfficesService,
        private countryService: CountriesService,
        private spinnerService: NgxSpinnerService,
        private vendorService: VendorsService,
        private regionService: RegionsService,
        private districtService: DistrictsService,
        private cityService: CitiesService,
        private peopleOfBenefitService: PeopleOfBenefitsService,
        private systemSettingService: SystemSettingsService,
        private contractSettingService: ContractsSettingsService,
        private productsReceiptDetailsService: ProductsReceiptDetailsService,
        private maintenanceRequestsService: MaintenanceRequestsService,
        private suppliersService: SuppliersService,
        private maintenanceServicesService: MaintenanceServicesService,
        private productsCategoriesService: ProductsCategoriesService,
        private productsService: ProductsService,
        private rentContractDuesService: RentContractDuesService,
        private maintenanceContractDuesService: MaintenanceContractDuesService,
        private maintenanceContractsSettingsDetailsService: MaintenanceContractsSettingsDetailsService,
        private entryTypeService: EntryTypeService,
        private billTypeService: BillTypeService,
        private accountService: AccountService,
        private purchasersService: PurchasersService,
        //private salesBuyContractDuesService: SalesBuyContractDuesService,
        private billsService: BillsService,
        private vouchersService: VouchersService,
        private dashboardSettingsService: DashboardSettingsService,
        private costCenterService: CostCenterService,
        private sharedServices: SharedService,
        private rolesPerimssionsService: RolesPermissionsService,
        private floorService: FloorsService,
        private companiesActivitiesService: CompaniesActivitiesService,
        private nationalitiesService: NationalityService,
        private unitTypesService: UnitsTypesService,
        private groundsService: GroundsService,
        private vendorCommissionsService: VendorCommissionsService,
        private rentContractsService: RentContractsService,
        private subUsersSerivice: UsersUsersService,
        private pagesServices: PagesService,
        private contractSettingsUserPermisionsService: ContractSettingsUsersPermissionsService,
        private unitServicesService: UnitServicesService,
        private opportunityService: OpportunityService,
        private opportunityTypeService: OpportunityTypeService,
        private attributeService: AttributeService,
        private roleService: RolesService,
        private opportunitiesOffersService: OpportunitiesOffersService,
        private opportunitesSpecialsService: OpportunitiesSpecialsService,
        //private salesPurchaseContractsService:ContractService,
        private salesBuyContractService: SalesBuyContractsService,
        private generalIntegrationSettingsService: GeneralIntegrationSettingsService

    ) {
        //this.load();
    }





    loadBuildings() {
        return new Promise<void>((acc, rej) => {

            let sub = this.buildingService.getWithResponse<Building[]>("GetAll")
                .subscribe(
                    {
                        next: (res: ResponseResult<Building[]>) => {

                            acc();
                            if (res.success) {
                                this.buildings = [...res.data ?? []];


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

    getBuildings() {
        return [...this.buildings];
    }

    // getCurrencies() {
    //     return new Promise<void>((acc, rej) => {
    //         let sub = this.currenciesService.getAll("getAll")
    //             .subscribe(
    //                 (data: ResponseResult<Currencies[]>) => {
    //                     //((data);
    //                     this.store.dispatch(CurrenciesActions.actions.setList({
    //                         data: [...data.data!]
    //                     }));
    //                     acc();

    //                 },
    //                 (err: any) => {
    //                     //((err);
    //                     acc();
    //                 },
    //                 () => {

    //                 }
    //             );
    //         this.subsList.push(sub);
    //     });
    // }

    loadContractSettings() {
        return new Promise<void>((resolve, reject) => {
            let sub = this.contractSettingService.getWithResponse<ContractsSettings[]>("GetAll")
                .subscribe({
                    next: (res: ResponseResult<ContractsSettings[]>) => {
                        resolve();
                        // 
                        if (res.success) {
                            this.contractSettings = [...res.data ?? []];
                        }
                    },
                    error: (err: any) => {
                        //((err);
                        resolve();
                    },
                    complete: () => {

                    }
                }
                );
            this.subsList.push(sub);
        });
    }

    getContractSettings() {
        return [...this.contractSettings];
    }
    loadRealestate() {
        return new Promise<void>((acc, rej) => {
            let sub = this.realesateService.getWithResponse<Realestate[]>("getAll")
                .subscribe({
                    next: (res: ResponseResult<Realestate[]>) => {


                        acc();
                        if (res.success) {
                            this.realesatates = [...res.data ?? []];
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

    getRealestates() {
        return [...this.realesatates];
    }

    loadOwners() {
        return new Promise<void>((acc, rej) => {

            let sub = this.ownerService.getWithResponse<Owner[]>("GetAll?includes=OwnerIntegrationSettings").subscribe(
                {
                    next: (res: ResponseResult<Owner[]>) => {

                        acc();
                        if (res.success) {
                            this.owners = [...res.data ?? []];


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




    getOwners() {
        return [...this.owners];
    }
    loadCountries() {
        return new Promise<void>((acc, rej) => {

            let sub = this.countryService.getWithResponse<Countries[]>("GetAllUnAuthorized")
                .subscribe(
                    {
                        next: (res: ResponseResult<Countries[]>) => {

                            acc();
                            if (res.success) {
                                this.countries = [...res.data ?? []];


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

    getCountries() {
        return [...this.countries];
    }
    loadAccounts() {
        return new Promise<void>((acc, rej) => {
            let sub = this.accountService.getWithResponse<Accounts[]>("GetAll")
                .subscribe(
                    {
                        next: (res: ResponseResult<Accounts[]>) => {
                            acc();
                            if (res.success) {
                                this.accounts = [...res.data ?? []]
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
    getAccounts() {
        return [...this.accounts];
    }



    loadEntryTypes() {
        return new Promise<void>((resolve, reject) => {
            let sub = this.entryTypeService.getWithResponse<EntryType[]>("GetAll").subscribe({
                next: (res) => {
                    // 
                    resolve();
                    if (res.success) {
                        this.entryTypes = [...res.data ?? []];
                    }

                },
                error: (err: any) => {
                    //reject(err);
                    resolve();
                },
                complete: () => {

                    resolve();
                },
            });

            this.subsList.push(sub);
        });

    }
    getEntryTypes() {
        return [...this.entryTypes];
    }
    loadDashboardSettings() {
        return new Promise<void>((resolve, reject) => {
            let sub = this.dashboardSettingsService.getWithResponse<DashboardSettings[]>("GetAll").subscribe({
                next: (res) => {
                    resolve();
                    if (res.success) {
                        this.dashboardSettings = [...res.data ?? []];

                    }




                },
                error: (err: any) => {
                    //reject(err);
                    resolve();
                },
                complete: () => {

                    resolve();
                },
            });

            this.subsList.push(sub);
        });

    }

    getDashboardSettings() {
        return [...this.dashboardSettings];
    }

    loadBillTypes() {
        return new Promise<void>((resolve, reject) => {
            let sub = this.billTypeService.getWithResponse<BillType[]>("GetAll").subscribe({
                next: (res) => {
                    resolve();
                    //(("GetBillTypes from Apiiiiiiiiiiiiiiiiiii", res)
                    if (res.success) {
                        this.billTypes = [...res.data ?? []];

                        // this.store.dispatch(BillTypeActions.actions.setList({
                        //     data: res.data ?? []
                        // }))
                    }




                },
                error: (err: any) => {
                    //reject(err);
                    resolve();
                },
                complete: () => {

                    resolve();
                },
            });

            this.subsList.push(sub);
        });

    }

    getBillTypes() {
        return [...this.billTypes];
    }
    loadBills() {
        return new Promise<void>((resolve, reject) => {
            let sub = this.billsService.getWithResponse<Bills[]>("GetAll").subscribe({
                next: (res) => {
                    resolve();
                    if (res.success) {
                        this.bills = [...res.data ?? []]
                    }




                },
                error: (err: any) => {
                    //reject(err);
                    resolve();
                },
                complete: () => {

                    resolve();
                },
            });

            this.subsList.push(sub);
        });

    }

    getBills() {
        return [...this.bills];
    }
    loadVouchers() {
        return new Promise<void>((resolve, reject) => {
            let sub = this.vouchersService.getWithResponse<Voucher[]>("GetAll").subscribe({
                next: (res) => {
                    resolve();
                    //(("GetVouchers from Api", res)
                    if (res.success) {
                        this.vouchers = [...res.data ?? []];
                    }




                },
                error: (err: any) => {
                    //reject(err);
                    resolve();
                },
                complete: () => {

                    resolve();
                },
            });

            this.subsList.push(sub);
        });

    }

    getVouchers() {
        return [...this.vouchers];
    }

    loadTenants() {
        return new Promise<void>((acc, rej) => {
            let sub = this.tenantService.getWithResponse<Tenants[]>("GetAll")
                .subscribe({
                    next: (res: ResponseResult<Tenants[]>) => {
                        console.log("Tenants from service", res);
                        acc();
                        if (res.success) {
                            this.tenants = [...res.data ?? []];
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

    loadTenantsByRole(role: string) {
        return new Promise<void>((acc, rej) => {
            let sub = this.tenantService.getWithResponse<Tenants[]>("GetTenantsByRecordRole?recordRole=" + role)
                .subscribe({
                    next: (res: ResponseResult<Tenants[]>) => {
                        console.log("Tenants from service", res);
                        acc();
                        if (res.success) {
                            this.tenants = [...res.data ?? []];
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

    getTenants() {
        return [...this.tenants];
    }



    getSuppliers() {
        return new Promise<void>((acc, rej) => {
            let sub = this.suppliersService.getAll("getAll")
                .subscribe(
                    (data: any) => {
                        this.store.dispatch(SuppliersActions.actions.setList({
                            data: [...data.data!]
                        }));
                        acc();

                    },
                    (err: any) => {
                        //((err);
                        acc();
                    },
                    () => {

                    }
                );
            this.subsList.push(sub);
        });
    }
    getMaintenanceServices() {
        return new Promise<void>((acc, rej) => {
            let sub = this.maintenanceServicesService.getAll("getAll")
                .subscribe(
                    (data: ResponseResult<MaintenanceServices[]>) => {
                        this.store.dispatch(MaintenanceServicesActions.actions.setList({
                            data: [...data.data!]
                        }));
                        acc();

                    },
                    (err: any) => {
                        //((err);
                        acc();
                    },
                    () => {

                    }
                );
            this.subsList.push(sub);
        });
    }


    getProductsCategories() {
        return new Promise<void>((acc, rej) => {
            let sub = this.productsCategoriesService.getAll("getAll")
                .subscribe(
                    (data: ResponseResult<ProductCategory[]>) => {
                        this.store.dispatch(ProductsCategoriesActions.actions.setList({
                            data: [...data.data!]
                        }));
                        acc();

                    },
                    (err: any) => {
                        //((err);
                        acc();
                    },
                    () => {

                    }
                );
            this.subsList.push(sub);
        });
    }

    getProducts() {
        return new Promise<void>((acc, rej) => {
            let sub = this.productsService.getAll("getAll")
                .subscribe(
                    (data: ResponseResult<Products[]>) => {
                        this.store.dispatch(ProductsActions.actions.setList({
                            data: [...data.data!]
                        }));
                        acc();

                    },
                    (err: any) => {
                        //((err);
                        acc();
                    },
                    () => {

                    }
                );
            this.subsList.push(sub);
        });
    }
    loadOffices() {
        return new Promise<void>((acc, rej) => {
            let sub = this.officeService.getWithResponse<Office[]>("GetAll")
                .subscribe(
                    {
                        next: (res: ResponseResult<Office[]>) => {

                            // this.store.dispatch(OfficeActions.actions.setList({
                            //     data: [...data.data!]
                            // }));
                            acc();
                            //(("getOffices data", data)
                            if (res.success) {
                                this.offices = [...res.data ?? []];
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
    getOffices() {
        return [...this.offices];
    }

    loadUnits() {
        return new Promise<void>((acc, rej) => {
            let sub = this.unitService.getWithResponse<Unit[]>("GetAll")
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
    loadUnitsByPurpose(purpose: string) {
        return new Promise<void>((acc, rej) => {
            let sub = this.unitService.getWithResponse<Unit[]>("GetUnitsByPerpose?purpose=" + purpose)
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

    getUnits() {
        return [...this.units];
    }


    loadVendors() {
        return new Promise<void>((acc, rej) => {
            let sub = this.vendorService.getWithResponse<Vendors[]>("GetAll")
                .subscribe(
                    {
                        next: (res: ResponseResult<Vendors[]>) => {
                            //((data);

                            acc();
                            if (res.success) {
                                this.vendors = [...res.data ?? []];
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

    getVendors() {
        return [...this.vendors];
    }


    loadPeopleOfBenefits() {
        return new Promise<void>((acc, rej) => {
            let sub = this.peopleOfBenefitService.getWithResponse<PeopleOfBenefit[]>("GetAll")
                .subscribe(
                    {
                        next: (res: ResponseResult<PeopleOfBenefit[]>) => {


                            acc();
                            if (res.success) {
                                this.peopleOfBenifits = [...res.data ?? []];
                            }

                        },
                        error: (err: any) => {
                            //(("getPeopleOfBenefits manager err", err);
                            acc();
                        },
                        complete: () => {

                        }
                    }
                );
            this.subsList.push(sub);
        });
    }

    getPeopleOfBenefits() {
        return [...this.peopleOfBenifits];
    }

    loadRegions() {
        return new Promise<void>((acc, rej) => {
            let sub = this.regionService.getWithResponse<Region[]>("GetAllUnAuthorized")
                .subscribe(
                    {
                        next: (res: ResponseResult<Region[]>) => {
                            acc();
                            if (res.success) {
                                this.regions = [...res.data ?? []];
                            }
                        },
                        error: (err: any) => {
                            //(("region manager err", err);
                            acc();
                        },
                        complete: () => {

                        }
                    }
                );
            this.subsList.push(sub);
        });
    }

    getRegions() {
        return [...this.regions];
    }
    loadDistricts() {
        return new Promise<void>((acc, rej) => {
            let sub = this.districtService.getWithResponse<District[]>("GetAllUnAuthorized")
                .subscribe(
                    {
                        next: (res: ResponseResult<District[]>) => {


                            acc();
                            if (res.success) {
                                this.districts = [...res.data ?? []];
                            }

                        },
                        error: (err: any) => {
                            //(("District manager err", err);
                            acc();
                        },
                        complete: () => {

                        }
                    }
                );
            this.subsList.push(sub);
        });
    }

    getDistricts() {
        return [...this.districts];
    }
    loadCities() {
        return new Promise<void>((acc, rej) => {
            let sub = this.cityService.getWithResponse<Cities[]>("GetAllForWebsite")
                .subscribe(
                    {
                        next: (res: ResponseResult<Cities[]>) => {


                            acc();
                            if (res.success) {
                                this.cities = [...res.data ?? []];
                            }

                        },
                        error: (err: any) => {
                            //(("city manager err", err);
                            acc();
                        },
                        complete: () => {

                        }
                    }
                );
            this.subsList.push(sub);
        });
    }

    getCities() {
        return [...this.cities];
    }


    loadSystemSettings() {
        return new Promise<void>((acc, rej) => {
            let sub = this.systemSettingService.getWithResponse<SystemSettings[]>("GetAll")
                .subscribe(
                    {
                        next: (res: ResponseResult<SystemSettings[]>) => {
                            //((data);
                            // this.store.dispatch(SystemSettingActions.actions.setList({
                            //     data: [...data.data!]
                            // }));
                            acc();
                            if (res.success) {
                                this.systemSettings = [...res.data ?? []];
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

    getSystemSettings() {
        return [...this.systemSettings];
    }


    getMaintenanceContractDues() {
        return new Promise<void>((resolve, reject) => {
            let sub = this.maintenanceContractDuesService.getWithResponse<VMMaintenanceContractDues[]>("GetAllVMFromSubTable").subscribe({
                next: (res) => {
                    ;
                    //(("get Maintenance Contract dues from Api", res)
                    if (res.success) {

                        this.store.dispatch(MaintenanceContractDuesActions.actions.setList({
                            data: res.data ?? []
                        }))
                    }


                    resolve();

                },
                error: (err: any) => {
                    //reject(err);
                    resolve();
                },
                complete: () => {

                    resolve();
                },
            });

            this.subsList.push(sub);
        });

    }
    // getSalesBuyContractsDues() {

    //     return new Promise<void>((resolve, reject) => {
    //         let sub = this.salesBuyContractService.getWithResponse<SalesBuyContracts[]>("GetAllVMFromSubTable").subscribe({
    //             next: (res) => {
    //                 ;
    //                 //(("get Sale Buy Contract dues from Api", res)
    //                 if (res.success) {

    //                     this.store.dispatch(SalesBuyContractsDuesActions.actions.setList({
    //                         data: res.data ?? []
    //                     }))
    //                 }


    //                 resolve();

    //             },
    //             error: (err: any) => {
    //                 //reject(err);
    //                 resolve();
    //             },
    //             complete: () => {

    //                 resolve();
    //             },
    //         });

    //         this.subsList.push(sub);
    //     });

    // }
    getRentContractDues() {

        return new Promise<void>((acc, rej) => {
            let sub = this.rentContractDuesService.getAll("getAll")
                .subscribe(
                    (data: ResponseResult<RentContractDueVM[]>) => {
                        //((data);
                        if (data) {
                            this.store.dispatch(RentContractDuesActions.actions.setList({
                                data: [...data.data!]
                            }));
                        }

                        acc();

                    },
                    (err: any) => {
                        //((err);
                        acc();
                    },
                    () => {

                    }
                );
            this.subsList.push(sub);
        });
    }
    getMaintenanceContractsSettingsDetails() {
        return new Promise<void>((acc, rej) => {
            let sub = this.maintenanceContractsSettingsDetailsService.getAll("getAll")
                .subscribe(
                    (data: ResponseResult<MaintenanceContractsSettingsDetails[]>) => {
                        //((data);
                        this.store.dispatch(MaintenanceContractsSettingsDetailsActions.actions.setList({
                            data: [...data.data!]
                        }));
                        acc();

                    },
                    (err: any) => {
                        //((err);
                        acc();
                    },
                    () => {

                    }
                );
            this.subsList.push(sub);
        });
    }

    destroy(): void {
        this.subsList.forEach(s => {
            if (s) {
                s.unsubscribe();
            }
        });
        this.countries = [];
        this.cities = [];
        this.regions = [];
        this.districts = [];
        this.buildings = [];
        this.owners = [];
        this.tenants = [];
        this.contractService = [];
        this.units = [];
        this.peopleOfBenifits = [];
        this.accounts = [];
        this.realesatates = [];
        //this.entryTypes = [];
        this.vendors = [];
        this.dashboardSettings = [];
        this.billTypes = [];
        this.bills = [];
        this.vouchers = [];
        this.offices = [];
        this.systemSettings = [];
        this.costCenters = [];
        this.floors = [];
        this.buildingsVM = [];
        //this.rolePermission = undefined;
        this.userPermissions = undefined;
        this.nationalities = [];
        this.companiesActivities = [];
        this.unitTypes = [];
        this.units = [];
        this.grounds = [];
        this.purchasers = [];
        this.vendorCommissions = [];
        this.managedUsers = [];
        this.rentContractsByType = [];
        this.contractSetttingPagePermission = undefined;
        this.opportunities = [];
        this.attributes = [];
        this.currentRole = undefined;
        this.opportunitiesSpecials = [];
        this.opportunitiesOffers = [];
        this.opportunitiesTypes = [];
        this.currencies = [];
    }
    getMaintenanceRequests() {
        return new Promise<void>((acc, rej) => {
            let sub = this.maintenanceRequestsService.getAll("getAll")
                .subscribe(
                    (data: ResponseResult<MaintenanceRequests[]>) => {
                        //((data);
                        this.store.dispatch(MaintenanceRequestsActions.actions.setList({
                            data: [...data.data!]
                        }));
                        acc();

                    },
                    (err: any) => {
                        //((err);
                        acc();
                    },
                    () => {

                    }
                );
            this.subsList.push(sub);
        });
    }

    getProductsReceiptDetails() {
        return new Promise<void>((acc, rej) => {
            let sub = this.productsReceiptDetailsService.getAll("getAll")
                .subscribe(
                    (data: ResponseResult<ProductsReceiptDetails[]>) => {
                        //((data);
                        this.store.dispatch(ProductsReceiptDetailsActions.actions.setList({
                            data: [...data.data!]
                        }));
                        acc();

                    },
                    (err: any) => {
                        //((err);
                        acc();
                    },
                    () => {

                    }
                );
            this.subsList.push(sub);
        });
    }


    // load() {


    //     // return this.getPermission().then(a => {
    //     return Promise.all([
    //         this.loadDashboardSettings(),
    //         this.loadCountries(),//
    //         this.loadRegions(),//
    //         this.loadDistricts(),//
    //         this.loadCities(),//
    //         this.loadUnits(),//
    //         this.loadTenants(),//
    //         this.loadBuildings(),//
    //         this.loadOffices(),//
    //         this.loadOwners(),//
    //         this.loadRealestate(),//
    //         this.loadVendors(),//
    //         this.loadSystemSettings(),//
    //         this.loadContractSettings(),
    //         this.getPeopleOfBenefits(),//
    //         this.getMaintenanceRequests(),//
    //         this.getProductsReceiptDetails(),//no
    //         this.loadAccounts(),//
    //         this.getSuppliers(),//
    //         this.getMaintenanceServices(),//
    //         this.getProductsCategories(),//
    //         this.getProducts(),//
    //         this.getMaintenanceContractDues(),//no
    //         this.getRentContractDues(),//no
    //         this.loadEntryTypes(),//no
    //         this.loadBillTypes(),//no
    //         this.getPurchasers(),//
    //         this.getMaintenanceContractsSettingsDetails(),//no
    //         this.getSalesBuyContractsDues(),//no
    //         this.loadBills(),//no
    //         this.loadVouchers(),//no
    //         //this.getCurrencies()
    //         this.loadCurrencies()




    //     ]).then(a => {
    //         this.spinnerService.hide();
    //     });
    //     //})

    // }
    loadInitialData() {
        return Promise.all([
            this.getCountries(),
        ]).then(a => {
            this.spinnerService.hide();
        })
    }

    showSuccessMessage(message: string, title: string) {
        this.toastrSevice.success(message, title, {
            closeButton: true,
            positionClass: "toast-top-center"
        })
    }

    showInfoMessage(message: string, title: string) {
        this.toastrSevice.info(message, title, {
            closeButton: true,
            positionClass: "toast-top-center"
        })
    }

    showErrorMessage(message: string, title: string) {
        this.toastrSevice.error
            (message, title, {
                closeButton: true,

                positionClass: "toast-top-center"
            })
    }

    loadCostCenters() {
        return new Promise<void>((resolve, reject) => {
            let sub = this.costCenterService.getWithResponse<CostCenters[]>("GetAll").subscribe({
                next: (res: ResponseResult<CostCenters[]>) => {

                    resolve();
                    if (res.success) {
                        this.costCenters = [...res.data ?? []];
                    }



                },
                error: (err: any) => {
                    console.log(err);
                    resolve();
                    //reject(err);
                },
                complete: () => {

                },
            });
            this.subsList.push(sub);
        });

    }

    getCostCenters() {
        return [...this.costCenters];
    }

    loadPagePermissions(pageId) {
        return new Promise<void>((resolve, reject) => {
            let sub = this.rolesPerimssionsService.getAll("GetPagePermissionById?pageId=" + pageId).subscribe({
                next: (res: any) => {

                    console.log(pageId, "  has the following permission ", res);
                    
                    resolve();
                    if (res.data) {
                        this.rolePermission = JSON.parse(JSON.stringify(res.data));
                        this.userPermissions = JSON.parse(this.rolePermission?.permissionJson);
                        if (this.userPermissions) {
                            this.sharedServices.setUserPermissions(this.userPermissions);
                        }
                    }
                    else {
                        console.log("No Permission for PageId", pageId);
                    }



                },
                error: (err: any) => {
                    reject(err);
                },
                complete: () => {

                },
            });

            this.subsList.push(sub);
        });


    }

    getRolePermissions() {
        return { ...this.rolePermission };
    }

    getUserPermissions() {
        return { ...this.userPermissions };
    }


    loadBuildingsVM() {
        return new Promise<void>((resolve, reject) => {
            let sub = this.buildingService.getWithResponse<VwBuildings[]>("GetAllVM").subscribe({
                next: (res: ResponseResult<VwBuildings[]>) => {

                    resolve();
                    if (res.success) {
                        this.buildingsVM = [...res.data ?? []]
                    }
                },
                error: (err: any) => {
                    console.log(err);
                    resolve();
                },
                complete: () => {

                },
            });
            this.subsList.push(sub);
        });

    }

    getBuildingsVM() {
        return [...this.buildingsVM];
    }




    // getPermission() {

    //     return new Promise<void>((acc, rej) => {
    //         let sub = this.userPermissionService
    //             .getDataWithResponse<UserPermission>("GetAllUserPermissions?userId=" + localStorage.getItem(USER_ID_KEY))
    //             .subscribe({
    //                 next: (res: ResponseResult<UserPermission[]>) => {
    //                     //(("Permissions ========================", res);
    //                     if (res.status == 1) {
    //                         localStorage.setItem(USER_PERMISSION, JSON.stringify(res.entity));
    //                     }
    //                     acc();
    //                 },
    //                 error: (err: any) => {
    //                     acc();
    //                 },
    //                 complete: () => {
    //                     acc();
    //                 }
    //             });
    //         this.subsList.push(sub);
    //     });
    // }


    loadFloors() {
        return new Promise<void>((resolve, reject) => {
            let sub = this.floorService.getWithResponse<Floor[]>("GetAllData").subscribe({
                next: (res: ResponseResult<Floor[]>) => {
                    resolve();
                    if (res.success) {
                        this.floors = [...res.data ?? []];
                    }
                },
                error: (err: any) => {
                    console.log(err);
                    resolve();
                    //reject(err);
                },
                complete: () => {

                },
            });
            this.subsList.push(sub);
        });

    }

    getFloors() {
        return [...this.floors];
    }


    loadCompanyActivities() {
        return new Promise<void>((acc, rej) => {
            let sub = this.companiesActivitiesService.getWithResponse<CompaniesActivities[]>("GetAll")
                .subscribe(
                    {
                        next: (res: ResponseResult<CompaniesActivities[]>) => {
                            acc();
                            if (res.success) {
                                this.companiesActivities = [...res.data ?? []]
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

    getCompanyActivities() {
        return [...this.companiesActivities];
    }


    loadNationalities() {
        return new Promise<void>((acc, rej) => {
            let sub = this.nationalitiesService.getWithResponse<Nationality[]>("GetAllData")
                .subscribe(
                    {
                        next: (res: ResponseResult<Nationality[]>) => {
                            acc();
                            if (res) {


                                if (res.success) {
                                    this.nationalities = [...res.data ?? []];
                                }
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

    getNationalities() {
        return [...this.nationalities];
    }


    loadUnitTypes() {
        return new Promise<void>((resolve, reject) => {
            let sub = this.unitTypesService.getWithResponse<UnitsTypesVM[]>("GetAllVM").subscribe({
                next: (res: ResponseResult<UnitsTypesVM[]>) => {
                    resolve();
                    if (res.success) {
                        this.unitTypes = [...res.data ?? []];
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

    getUnitTypes() {
        return [...this.unitTypes];
    }


    loadGrounds() {
        return new Promise<void>((resolve, reject) => {
            let sub = this.groundsService.getWithResponse<Ground[]>("GetAll").subscribe({
                next: (res: ResponseResult<Ground[]>) => {
                    resolve();
                    if (res.success) {
                        this.grounds = [...res.data ?? []];
                    }


                    //(("res", res);
                    //((" this.grounds", this.grounds);
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

    getGrounds() {
        return [...this.grounds];
    }


    loadPurchasers() {
        return new Promise<void>((resolve, reject) => {
            let sub = this.purchasersService.getWithResponse<Purchasers[]>("GetAll").subscribe({
                next: (res: ResponseResult<Purchasers[]>) => {
                    resolve();
                    if (res.success) {
                        this.purchasers = [...res.data ?? []];
                    }


                    //(("res", res);
                    //((" this.purchasers", this.purchasers);
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


    getPurchasers() {
        return [...this.purchasers];
    }


    loadVendorCommissions() {
        return new Promise<void>((resolve, reject) => {
            let sub = this.vendorCommissionsService.getWithResponse<VendorCommissions[]>("GetAll").subscribe({
                next: (res: ResponseResult<VendorCommissions[]>) => {
                    resolve();
                    if (res.success) {
                        this.vendorCommissions = [...res.data ?? []];
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

    getVendorCommissions() {
        return [...this.vendorCommissions];
    }


    // loadContracts(contractSettingId) {
    //     return new Promise<void>((resolve, reject) => {
    //         let sub = this.rentContractsService.getWithResponse<Contract[]>("GetAll").subscribe({
    //             next: (res: ResponseResult<Contract[]>) => {
    //                 this.rentContractList = res.data.filter(x => x.rentContractSettingId == contractSettingId).map((res: RentContract[]) => {
    //                     return res
    //                 });
    //                 if (this.rentContractList.length > 0) {
    //                     this.isContractSettingHasContracts = true;
    //                 } else {
    //                     this.isContractSettingHasContracts = false;
    //                 }

    //                 resolve();
    //             },
    //             error: (err: any) => {
    //                 this.spinner.hide();
    //                 reject(err);
    //             },
    //             complete: () => {
    //             },
    //         });
    //         this.subsList.push(sub);
    //     });

    // }


    getSubUsers(userId) {
        return new Promise<void>((resolve, reject) => {
            let sub = this.subUsersSerivice.getWithResponse<UsersUsers[]>("GetManagerSubUsers?userId=" + userId).subscribe({
                next: (res: ResponseResult<UsersUsers[]>) => {
                    resolve();
                    if (res.success) {
                        this.managedUsers = [...res.data ?? []];
                    }
                },
                error: (err: any) => {
                    resolve

                    // reject(err);
                },
                complete: () => {

                },
            });

            this.subsList.push(sub);
        });


    }

    loadRentContractsByType(settingId: any) {
        return new Promise<void>((resolve, reject) => {
            let sub = this.rentContractsService.getWithResponse<RentContractVM[]>("GetAllVMByTypeId?contractSettingId=" + settingId).subscribe({
                next: (res: ResponseResult<RentContractVM[]>) => {
                    console.log("Contract-data is ", res);
                    resolve();
                    if (res.success) {
                        this.rentContractsByType = [...res.data ?? []];
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


    loadSalesPurchaseContractsByType(settingId: any) {
        return new Promise<void>((resolve, reject) => {
            let sub = this.salesBuyContractService.getWithResponse<SalesBuyContractVm[]>("GetAllVMByTypeId?contractSettingId=" + settingId).subscribe({
                next: (res: ResponseResult<SalesBuyContractVm[]>) => {
                    console.log("Contract-data is ", res);
                    resolve();
                    if (res.success) {
                        this.salesBuyContractsByType = [...res.data ?? []];
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

    getSalesPurchaseContractsByType() {
        return [...this.salesBuyContractsByType];

    }



    loadVouchersByTypeId(typeId: any) {
        return new Promise<void>((resolve, reject) => {
            let sub = this.vouchersService.getWithResponse<VoucherVm[]>("GetAllVMByTypeId?typeId=" + typeId).subscribe({
                next: (res: ResponseResult<VoucherVm[]>) => {
                    if (res.success) {
                        this.vouchersVm = JSON.parse(JSON.stringify(res.data));
                    }
                    resolve();

                },
                error: (err: any) => {
                    reject(err);
                },
                complete: () => {

                },
            });

            this.subsList.push(sub);
        });

    }

    getVouchersByType() {
        return [...this.vouchersVm];
    }



    getRentContractsByType() {
        return [...this.rentContractsByType];
    }

    //       getPages() {

    //       return new Promise<void>((resolve, reject) => {
    //         let sub = this.pagesServices.getWithResponse("GetAllData").subscribe({
    //         next: (res: any) => {


    //           localStorage.setItem("PageId", (this.page?.id ?? "").toString());
    //           resolve();

    //         },
    //         error: (err: any) => {
    //           reject(err);
    //         },
    //         complete: () => {

    //         },
    //       });
    //     });
    //     return promise;


    //   }



    private contractSetttingPagePermission?: ContractSettingsRolePermissions;

    // loadContractSettingPagePermissions(settingId: any) {
    //     return new Promise<void>((resolve, reject) => {

    //         let currentUser = localStorage.getItem("UserId");
    //         let sub = this.contractSettingsUserPermisionsService
    //             .getWithResponse<ContractSettingsRolePermissions[]>("GetListByFieldNameListVM?fieldNames=UserId&fieldValues=" + currentUser + "&fieldNames=ContractSettingId&fieldValues=" + settingId).subscribe({
    //                 next: (res: ResponseResult<ContractSettingsRolePermissions[]>) => {
    //                     resolve();
    //                     if (res.success) {
    //                         if (res.data?.length) {
    //                             let permissions: ContractSettingsRolePermissions[] = JSON.parse(JSON.stringify(res.data));
    //                             this.contractSetttingPagePermission = permissions.find(x => x.contractSettingId == Number(settingId))!
    //                             let userPermissions = JSON.parse(this.contractSetttingPagePermission?.permissionsJson);
    //                             console.log("Contract Setting Permissions", userPermissions)
    //                             this.sharedServices.setUserPermissions(userPermissions);
    //                         }

    //                     }



    //                 },
    //                 error: (err: any) => {
    //                     //reject(err);
    //                     resolve();
    //                 },
    //                 complete: () => {

    //                 },
    //             });
    //         this.subsList.push(sub);
    //     });


    // }




    getContractSettingPagePermissions() {
        return { ...this.contractSettingsUserPermisionsService };
    }

    loadUnitservices() {
        return new Promise<void>((resolve, reject) => {
            let sub = this.unitServicesService.getWithResponse<UnitServices[]>("GetAll").subscribe({
                next: (res: ResponseResult<UnitServices[]>) => {
                    resolve();
                    if (res.success) {
                        this.rentContractUnitServices = [...res.data ?? []];
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

    getUnitServices() {
        return [...this.rentContractUnitServices];
    }

    loadOpportunities() {
        return new Promise<void>((resolve, reject) => {
            let sub = this.opportunityService.getWithResponse<Opportunity[]>("GetByUserId").subscribe({
                next: (res: ResponseResult<Opportunity[]>) => {
                    resolve();
                    if (res.success) {
                        this.opportunities = [...res.data ?? []];
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

    getOpportunities() {
        return [...this.opportunities];
    }



    loadOpportunitiesTypes() {
        return new Promise<void>((resolve, reject) => {
            let sub = this.opportunityTypeService.getWithResponse<OpportunityType[]>("GetAll").subscribe({
                next: (res: ResponseResult<OpportunityType[]>) => {
                    resolve();
                    if (res.success) {
                        this.opportunitiesTypes = [...res.data ?? []];
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

    getOpportunitiesTypes() {
        return [...this.opportunitiesTypes];
    }



    loadAttributes() {
        return new Promise<void>((resolve, reject) => {
            let sub = this.attributeService.getWithResponse<Attributes[]>("GetAllForWebsite").subscribe({
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


    loadCurrentRoleAndPermission() {
        return new Promise<void>((resolve, reject) => {
            let sub = this.roleService.getWithResponse<Roles>("GetCurrentRole").subscribe({
                next: (res: ResponseResult<Roles>) => {
                    resolve();
                    if (res.data) {
                        this.currentRole = res.data;


                    }
                },
                error: (err) => {
                    resolve();
                },
                complete: () => {

                }
            });
            this.subsList.push(sub);
        })

    }

    getCurrentRole() {
        return this.currentRole;
    }




    loadOpportunitiesOffers() {
        return new Promise<void>((acc, rej) => {

            let sub = this.opportunitiesOffersService.getWithResponse<OpportunitiesOffersVM[]>("GetAllVM").subscribe(
                {
                    next: (res: ResponseResult<OpportunitiesOffersVM[]>) => {
                        console.log(res);
                        acc();
                        if (res.success) {
                            this.opportunitiesOffers = [...res.data ?? []];
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

    getOpportunitiesOffers() {
        return [...this.opportunitiesOffers];
    }


    loadOpportunitiesSpecials() {
        return new Promise<void>((acc, rej) => {

            let sub = this.opportunitesSpecialsService.getWithResponse<OpportunitiesSpecialsVM[]>("GetAllVM").subscribe(
                {
                    next: (res: ResponseResult<OpportunitiesSpecialsVM[]>) => {
                        acc();
                        if (res.success) {
                            this.opportunitiesSpecials = [...res.data ?? []];
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

    getOpportunitiesSpecials() {
        return [...this.opportunitiesSpecials];
    }


    loadCurrencies() {
        return new Promise<void>((resolve, reject) => {
            this.currenciesService.getWithResponse<Currencies[]>("GetAllData").subscribe({
                next: (res: ResponseResult<Currencies[]>) => {
                    resolve();
                    if (res.data) {
                        this.currencies = res.data ?? [];
                    }

                },
                error: (err: any) => {
                    resolve();
                },
                complete: () => {
                    resolve();

                },
            });
        });



    }

    getCurrencies() {
        return [...this.currencies];
    }


    loadGeneralAccountIntegrationSetting() {

        return new Promise<GeneralIntegrationSettings | null>((resolve, reject) => {
            let sub = this.generalIntegrationSettingsService.getWithResponse<GeneralIntegrationSettings>("GetCurrentSetting").subscribe({
                next: (res) => {

                    if (res.success) {
                        if (res.data) {
                            resolve(res.data);

                        } else {
                            resolve(null);
                        }
                    }
                    else {

                        resolve(null);
                    }

                },
                error: (err) => {

                    reject();
                },
                complete: () => { }
            });

            this.subsList.push(sub);

        });

    }

}
