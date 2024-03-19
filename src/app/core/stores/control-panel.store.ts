import { AreaReducers } from "./reducers/area.reducers";
import { CityReducers } from "./reducers/city.reducers";
import { AreaUserReducers } from "./reducers/areauser.reducers";
import { BuildingReducers } from "./reducers/building.reducers";
import { BuildingFloorReducers } from "./reducers/buildingfloor.reducers";
import { BuildingFloorUserReducers } from "./reducers/buildingflooruser.reducers";
import { BuildingUserReducers } from "./reducers/buildinguser.reducers";
import { UnitReducers } from "./reducers/unit.reducers";
import { CityUserReducers } from "./reducers/cityuser.reducers";
import { CompanyActivityReducers } from "./reducers/companyactivity.reducers";
import { CompanyActivityUserReducers } from "./reducers/companyactivityuser.reducers";
import { CompanyInfoReducers } from "./reducers/companyinfo.reducers";
import { CompanyInfoUserReducers } from "./reducers/companyinfouser.reducers";
import { CountryReducers } from "./reducers/country.reducers";
import { CountryUserReducers } from "./reducers/countryuser.reducers";
import { UnitUserReducers } from "./reducers/unituser.reducers";
import { ElectricMeterReducers } from "./reducers/electricmeter.reducers";
import { ElectricMeterUserReducers } from "./reducers/electricmeteruser.reducers";

import { OfficeReducers } from "./reducers/office.reducers";
import { OwnerUserReducers } from "./reducers/owner-user.reducers";
import { OwnerReducers } from "./reducers/owner.reducers";
import { PartnerReducers } from "./reducers/partner.reducers";
import { PartnerUserReducers } from "./reducers/partneruser.reducers";
import { PeopleOfBenefitsReducers } from "./reducers/peopleofbenefits.reducers";
import { PeopleOfBenefitsUsersReducers } from "./reducers/peopleofbenefitsuser.reducers";
import { PurchaserReducers } from "./reducers/purchaser.reducers";
import { PurchaserUserReducers } from "./reducers/purchaseruser.reducers";
import { RealestateReducers } from "./reducers/realestate.reducers";
import { RealestateUserReducers } from "./reducers/realestateuser.reducers";
import { RegionReducers } from "./reducers/region.reducers";
import { RegionsUsersReducers } from "./reducers/regionuser.reducers";
import { RentContractDuesReducers } from "./reducers/rentcontractdues.reducers";
import { RentContractGroundReducers } from "./reducers/rentcontractground.reducers";
import { RentContractUnitReducers } from "./reducers/rentcontractunits.reducers";
import { RentContractUserReducers } from "./reducers/rentcontractuser.reducers";
import { RentContractReducers } from "./reducers/rentcontract.reducers";
import { RentContractSettlementReducers } from "./reducers/rentcontractsettlement.reducers";


import { TenantReducers } from "./reducers/tenant.reducers";
import { TenantsUserReducers } from "./reducers/tenantuser.reducers";
import { UserRegisterationReducers } from "./reducers/userregisterations.reducers";
import { VendorReducers } from "./reducers/vendor.reducers";
import { VendorsUserReducers } from "./reducers/vendorsuser.reducers";
import { WaterMeterReducers } from "./reducers/watermeter.reducers";
import { WaterMeterUserReducers } from "./reducers/watermeteruser.reducers";
import { GroundUsersReducers } from "./reducers/ground-users.reducers";
import { FloorReducers } from "./reducers/floor.reducers";
import { GroundReducers } from "./reducers/ground.reducers";
import { OfficeUserReducers } from "./reducers/officie-user.reducers";
import { FloorsUsersReducers } from "./reducers/floors-users.reducers";
import { SystemSettingReducers } from "./reducers/system-setting.reducers";
import { ContractSettingReducers } from "./reducers/contract-setting.reducer";
import { DistrictReducers } from "./reducers/district.reducers";
import { MaintenanceRequestsReducers } from "./reducers/maintenancerequests.reducers";
import { ProductsReceiptDetailsReducers } from "./reducers/productsreceiptdetails.reducers";
import { AccountsReducers } from "./reducers/accounts.reducers";
import { MaintenanceContractsReducers } from "./reducers/maintenancecontracts.reducers";
import { MaintenanceContractsDetailsReducers } from "./reducers/maintenancecontractsdetails.reducers";
import { MaintenanceServicesReducers } from "./reducers/maintenance-services.reducers";
import { SuppliersReducers } from "./reducers/suppliers.reducers";
import { ProductsReducers } from "./reducers/products.reducers";
import { ProductsCategoriesReducers } from "./reducers/productscategories.reducers";
import { MaintenanceContractDuesReducers } from "./reducers/maintenancecontractdues.reducers";
import { MaintenanceContractsSettingsDetailsReducers } from "./reducers/maintenancecontractssettingsdetails.reducers";
import { EntryTypeReducers } from "./reducers/entry-type.reducers";
import { BillTypeReducers } from "./reducers/bill-type.reducer";

import { BillReducers } from "./reducers/bill.reducer";
import { VoucherReducers } from "./reducers/voucher.reducer";
import { DashboardSettingsReducers } from "./reducers/dashboard-settings.reducers";

export const ControlPanelStore = {
    units: UnitReducers.reducers.getListreducer(),
    selectedUnit: UnitReducers.reducers.getSelectedReducer(),
    selectedUnitList: UnitReducers.reducers.getSelectedListReducer(),

    unitsusers: UnitUserReducers.reducers.getListreducer(),
    selectedUnitUser: UnitUserReducers.reducers.getSelectedReducer(),
    selectedUnitUserList: UnitUserReducers.reducers.getSelectedListReducer(),

    areas: AreaReducers.reducers.getListreducer(),
    selectedArea: AreaReducers.reducers.getSelectedReducer(),
    selectedAreaList: AreaReducers.reducers.getSelectedListReducer(),

    areasusers: AreaUserReducers.reducers.getListreducer(),
    selectedAreaUser: AreaUserReducers.reducers.getSelectedReducer(),
    selectedAreaUserList: AreaUserReducers.reducers.getSelectedListReducer(),

    buildings: BuildingReducers.reducers.getListreducer(),
    selectedBuilding: BuildingReducers.reducers.getSelectedReducer(),
    selectedBuildingList: BuildingReducers.reducers.getSelectedListReducer(),

    buildingsusers: BuildingUserReducers.reducers.getListreducer(),
    selectedBuildingUser: BuildingUserReducers.reducers.getSelectedReducer(),
    selectedBuildingUserList: BuildingUserReducers.reducers.getSelectedListReducer(),


    buildingsfloors: BuildingFloorReducers.reducers.getListreducer(),
    selectedBuildingFloor: BuildingFloorReducers.reducers.getSelectedReducer(),
    selectedBuildingFloorList: BuildingFloorReducers.reducers.getSelectedListReducer(),

    buildingsfloorsusers: BuildingFloorUserReducers.reducers.getListreducer(),
    selectedBuildingFloorUser: BuildingFloorUserReducers.reducers.getSelectedReducer(),
    selectedBuildingFloorUserList: BuildingFloorUserReducers.reducers.getSelectedListReducer(),


    cities: CityReducers.reducers.getListreducer(),
    selectedCity: CityReducers.reducers.getSelectedReducer(),
    selectedCityList: CityReducers.reducers.getSelectedListReducer(),

    citiesusers: CityUserReducers.reducers.getListreducer(),
    selectedCityUser: CityUserReducers.reducers.getSelectedReducer(),
    selectedCityUserList: CityUserReducers.reducers.getSelectedListReducer(),

    companiesactivities: CompanyActivityReducers.reducers.getListreducer(),
    selectedCompanyActivity: CompanyActivityReducers.reducers.getSelectedReducer(),
    selectedCompanyActivityList: CompanyActivityReducers.reducers.getSelectedListReducer(),

    companiesactivitiesuser: CompanyActivityUserReducers.reducers.getListreducer(),
    selectedCompanyActivityUser: CompanyActivityUserReducers.reducers.getSelectedReducer(),
    selectedCompanyActivityUserList: CompanyActivityUserReducers.reducers.getSelectedListReducer(),


    companiesInfos: CompanyInfoReducers.reducers.getListreducer(),
    selectedCompanyInfo: CompanyInfoReducers.reducers.getSelectedReducer(),
    selectedCompanyInfoList: CompanyInfoReducers.reducers.getSelectedListReducer(),

    companiesInfosuser: CompanyInfoUserReducers.reducers.getListreducer(),
    selectedCompanyInfoUser: CompanyInfoUserReducers.reducers.getSelectedReducer(),
    selectedCompanyInfoUserList: CompanyInfoUserReducers.reducers.getSelectedListReducer(),


    countries: CountryReducers.reducers.getListreducer(),
    selectedCountry: CountryReducers.reducers.getSelectedReducer(),
    selectedCouuntryList: CountryReducers.reducers.getSelectedListReducer(),

    countriesusers: CountryUserReducers.reducers.getListreducer(),
    selectedCountryUser: CountryUserReducers.reducers.getSelectedReducer(),
    selectedCountryUserList: CountryUserReducers.reducers.getSelectedListReducer(),

    electricmeters: ElectricMeterReducers.reducers.getListreducer(),
    selectedElectricMeter: ElectricMeterReducers.reducers.getSelectedReducer(),
    selectedElectricMeterList: ElectricMeterReducers.reducers.getSelectedListReducer(),

    electricmetersusers: ElectricMeterUserReducers.reducers.getListreducer(),
    selectedElectricMeterUser: ElectricMeterUserReducers.reducers.getSelectedReducer(),
    selectedElectricMeterUserList: ElectricMeterUserReducers.reducers.getSelectedListReducer(),


    floorsUsers: FloorsUsersReducers.reducers.getListreducer(),
    selectedFloorsUsers: FloorsUsersReducers.reducers.getSelectedReducer(),
    selectedFloorsUsersList: FloorsUsersReducers.reducers.getSelectedListReducer(),

    floors: FloorReducers.reducers.getListreducer(),
    selectedFloors: FloorReducers.reducers.getSelectedReducer(),
    selectedFloorsList: FloorReducers.reducers.getSelectedListReducer(),

    groundsUsers: GroundUsersReducers.reducers.getListreducer(),
    selectedGroundsUsers: GroundUsersReducers.reducers.getSelectedReducer(),
    selectedGroundsUsersList: GroundUsersReducers.reducers.getSelectedListReducer(),


    grounds: GroundReducers.reducers.getListreducer(),
    selectedGrounds: GroundReducers.reducers.getSelectedReducer(),
    selectedGroundsList: GroundReducers.reducers.getSelectedListReducer(),

    officeUser: OfficeUserReducers.reducers.getListreducer(),
    selectedOfficeUser: OfficeUserReducers.reducers.getSelectedReducer(),
    selectedOfficeUserList: OfficeUserReducers.reducers.getSelectedListReducer(),

    office: OfficeReducers.reducers.getListreducer(),
    selectedOffice: OfficeReducers.reducers.getSelectedReducer(),
    selectedOfficeList: OfficeReducers.reducers.getSelectedListReducer(),

    ownerUser: OwnerUserReducers.reducers.getListreducer(),
    selectedOwnerUser: OwnerUserReducers.reducers.getSelectedReducer(),
    selectedOwnerUserList: OwnerUserReducers.reducers.getSelectedListReducer(),

    owner: OwnerReducers.reducers.getListreducer(),
    selectedOwner: OwnerReducers.reducers.getSelectedReducer(),
    selectedOwnerList: OwnerReducers.reducers.getSelectedListReducer(),


    partners: PartnerReducers.reducers.getListreducer(),
    selectedPartner: PartnerReducers.reducers.getSelectedReducer(),
    selectedPartnerList: PartnerReducers.reducers.getSelectedListReducer(),

    partnersusers: PartnerUserReducers.reducers.getListreducer(),
    selectedPartnerUser: PartnerUserReducers.reducers.getSelectedReducer(),
    selectedPartnerUserList: PartnerUserReducers.reducers.getSelectedListReducer(),

    peopleofbenefits: PeopleOfBenefitsReducers.reducers.getListreducer(),
    selectedPeopleOfBenefits: PeopleOfBenefitsReducers.reducers.getSelectedReducer(),
    selectedPeopleOfBenefitsList: PeopleOfBenefitsReducers.reducers.getSelectedListReducer(),

    peopleofbenefitsusers: PeopleOfBenefitsUsersReducers.reducers.getListreducer(),
    selectedPeopleOfBenefitsUsers: PeopleOfBenefitsUsersReducers.reducers.getSelectedReducer(),
    selectedPeopleOfBenefitsUsersList: PeopleOfBenefitsUsersReducers.reducers.getSelectedListReducer(),


    purchasers: PurchaserReducers.reducers.getListreducer(),
    selectedPurchaser: PurchaserReducers.reducers.getSelectedReducer(),
    selectedPurchaserList: PurchaserReducers.reducers.getSelectedListReducer(),


    purchasersusers: PurchaserUserReducers.reducers.getListreducer(),
    selectedPurchaserUser: PurchaserUserReducers.reducers.getSelectedReducer(),
    selectedPurchaserUserList: PurchaserUserReducers.reducers.getSelectedListReducer(),


    realestates: RealestateReducers.reducers.getListreducer(),
    selectedRealestate: RealestateReducers.reducers.getSelectedReducer(),
    selectedRealestateList: RealestateReducers.reducers.getSelectedListReducer(),

    realestatesusers: RealestateUserReducers.reducers.getListreducer(),
    selectedRealestateUser: RealestateUserReducers.reducers.getSelectedReducer(),
    selectedRealestateUserList: RealestateUserReducers.reducers.getSelectedListReducer(),

    regions: RegionReducers.reducers.getListreducer(),
    selectedRegion: RegionReducers.reducers.getSelectedReducer(),
    selectedRegionList: RegionReducers.reducers.getSelectedListReducer(),

    regionsusers: RegionsUsersReducers.reducers.getListreducer(),
    selectedRegionUser: RegionsUsersReducers.reducers.getSelectedReducer(),
    selectedRegionUserList: RegionsUsersReducers.reducers.getSelectedListReducer(),

    rentcontractdues: RentContractDuesReducers.reducers.getListreducer(),
    selectedRentContractDues: RentContractDuesReducers.reducers.getSelectedReducer(),
    selectedRentContractDuesList: RentContractDuesReducers.reducers.getSelectedListReducer(),

    rentcontractgrounds: RentContractGroundReducers.reducers.getListreducer(),
    selectedRentContractGrounds: RentContractGroundReducers.reducers.getSelectedReducer(),
    selectedRentContractGroundsList: RentContractGroundReducers.reducers.getSelectedListReducer(),

    rentcontractunits: RentContractUnitReducers.reducers.getListreducer(),
    selectedRentContractUnits: RentContractUnitReducers.reducers.getSelectedReducer(),
    selectedRentContractUnitsList: RentContractUnitReducers.reducers.getSelectedListReducer(),

    rentcontractusers: RentContractUserReducers.reducers.getListreducer(),
    selectedRentContractUsers: RentContractUserReducers.reducers.getSelectedReducer(),
    selectedRentContractUsersList: RentContractUserReducers.reducers.getSelectedListReducer(),

    rentcontracts: RentContractReducers.reducers.getListreducer(),
    selectedRentContract: RentContractReducers.reducers.getSelectedReducer(),
    selectedRentContractList: RentContractReducers.reducers.getSelectedListReducer(),
    rentcontractsettlement: RentContractSettlementReducers.reducers.getListreducer(),
    selectedRentContractSettlement: RentContractSettlementReducers.reducers.getSelectedReducer(),
    selectedRentContractSettlementList: RentContractSettlementReducers.reducers.getSelectedListReducer(),
    tenants: TenantReducers.reducers.getListreducer(),
    selectedTenant: TenantReducers.reducers.getSelectedReducer(),
    selectedTenantList: TenantReducers.reducers.getSelectedListReducer(),
    tenantsusers: TenantsUserReducers.reducers.getListreducer(),
    selectedTenantUser: TenantsUserReducers.reducers.getSelectedReducer(),
    selectedTenantUserList: TenantsUserReducers.reducers.getSelectedListReducer(),
    usersregisterations: UserRegisterationReducers.reducers.getListreducer(),
    selectedUserRegisteration: UserRegisterationReducers.reducers.getSelectedReducer(),
    selectedUserRegisterationList: UserRegisterationReducers.reducers.getSelectedListReducer(),
    vendors: VendorReducers.reducers.getListreducer(),
    selectedVendor: VendorReducers.reducers.getSelectedReducer(),
    selectedVendorList: VendorReducers.reducers.getSelectedListReducer(),
    vendorsusers: VendorsUserReducers.reducers.getListreducer(),
    selectedVendorUser: VendorsUserReducers.reducers.getSelectedReducer(),
    selectedVendorUserList: VendorsUserReducers.reducers.getSelectedListReducer(),

    watermeters: WaterMeterReducers.reducers.getListreducer(),
    selectedWaterMeter: WaterMeterReducers.reducers.getSelectedReducer(),
    selectedWaterMeterList: WaterMeterReducers.reducers.getSelectedListReducer(),


    watermetersusers: WaterMeterUserReducers.reducers.getListreducer(),
    selectedWaterMeterUser: WaterMeterUserReducers.reducers.getSelectedReducer(),
    selectedWaterMeterUserList: WaterMeterUserReducers.reducers.getSelectedListReducer(),

    systemSettings:SystemSettingReducers.reducers.getListreducer(),
    selectedSystemSetting:SystemSettingReducers.reducers.getSelectedReducer(),
    selectedSystemSettingList:SystemSettingReducers.reducers.getSelectedListReducer(),

    contractSettings:ContractSettingReducers.reducers.getListreducer(),
    selectedContractSetting:ContractSettingReducers.reducers.getSelectedReducer(),
    selectedContractSettingList:ContractSettingReducers.reducers.getSelectedListReducer(),

    districts:DistrictReducers.reducers.getListreducer(),
    selectedDistrict:DistrictReducers.reducers.getSelectedListReducer(),
    selectedDistrictList:DistrictReducers.reducers.getSelectedListReducer(),

   
    
    entryTypes:EntryTypeReducers.reducers.getListreducer(),
    selectedEntryType:EntryTypeReducers.reducers.getSelectedReducer(),
    selectedEntryTypeList:EntryTypeReducers.reducers.getSelectedListReducer(),

    billTypes:BillTypeReducers.reducers.getListreducer(),
    selectedBillType:BillTypeReducers.reducers.getSelectedReducer(),
    selectedBillTypeList:BillTypeReducers.reducers.getSelectedListReducer(),

    bills:BillReducers.reducers.getListreducer(),
    selectedBill:BillReducers.reducers.getSelectedReducer(),
    selectedBillList:BillReducers.reducers.getSelectedListReducer(),


    vouchers:VoucherReducers.reducers.getListreducer(),
    selectedVoucher:VoucherReducers.reducers.getSelectedReducer(),
    selectedVoucherList:VoucherReducers.reducers.getSelectedListReducer(),

    maintenanceRequests:MaintenanceRequestsReducers.reducers.getListreducer(),
    selectedMaintenanceRequests:MaintenanceRequestsReducers.reducers.getSelectedListReducer(),
    selectedMaintenanceRequestsList:MaintenanceRequestsReducers.reducers.getSelectedListReducer(),

    productsReceiptDetails:ProductsReceiptDetailsReducers.reducers.getListreducer(),
    selectedProductsReceiptDetails:ProductsReceiptDetailsReducers.reducers.getSelectedListReducer(),
    selectedProductsReceiptDetailsList:ProductsReceiptDetailsReducers.reducers.getSelectedListReducer(),

    accounts:AccountsReducers.reducers.getListreducer(),
    selectedAccounts:AccountsReducers.reducers.getSelectedListReducer(),
    selectedAccountsList:AccountsReducers.reducers.getSelectedListReducer(),


    maintenanceContracts:MaintenanceContractsReducers.reducers.getListreducer(),
    selectedMaintenanceContracts:MaintenanceContractsReducers.reducers.getSelectedListReducer(),
    selectedMaintenanceContractsList:MaintenanceContractsReducers.reducers.getSelectedListReducer(),



    maintenanceContractsDetails:MaintenanceContractsDetailsReducers.reducers.getListreducer(),
    selectedMaintenanceContractsDetails:MaintenanceContractsDetailsReducers.reducers.getSelectedListReducer(),
    selectedMaintenanceContractsDetailsList:MaintenanceContractsDetailsReducers.reducers.getSelectedListReducer(),


    maintenanceServices:MaintenanceServicesReducers.reducers.getListreducer(),
    selectedMaintenanceServices:MaintenanceServicesReducers.reducers.getSelectedListReducer(),
    selectedMaintenanceServicesList:MaintenanceServicesReducers.reducers.getSelectedListReducer(),


    suppliers:SuppliersReducers.reducers.getListreducer(),
    selectedSuppliers:SuppliersReducers.reducers.getSelectedListReducer(),
    selectedSuppliersList:SuppliersReducers.reducers.getSelectedListReducer(),

    products:ProductsReducers.reducers.getListreducer(),
    selectedProducts:ProductsReducers.reducers.getSelectedListReducer(),
    selectedProductsList:ProductsReducers.reducers.getSelectedListReducer(),

    productsCategories:ProductsCategoriesReducers.reducers.getListreducer(),
    selectedProductsCategories:ProductsCategoriesReducers.reducers.getSelectedListReducer(),
    selectedproductsCategoriesList:ProductsCategoriesReducers.reducers.getSelectedListReducer(),


    maintenanceContractDues:MaintenanceContractDuesReducers.reducers.getListreducer(),
    selectedMaintenanceContractDues:MaintenanceContractDuesReducers.reducers.getSelectedListReducer(),
    selectedMaintenanceContractDuesList:MaintenanceContractDuesReducers.reducers.getSelectedListReducer(),

    maintenanceContractsSettingsDetails:MaintenanceContractsSettingsDetailsReducers.reducers.getListreducer(),
    selectedMaintenanceContractsSettingsDetails:MaintenanceContractsSettingsDetailsReducers.reducers.getSelectedListReducer(),
    selectedMaintenanceContractsSettingsDetailsList:MaintenanceContractsSettingsDetailsReducers.reducers.getSelectedListReducer(),

    dashboardSettings:DashboardSettingsReducers.reducers.getListreducer(),
    selecteDashboardSettings:DashboardSettingsReducers.reducers.getSelectedListReducer(),
    selectedDashboardSettingsList:DashboardSettingsReducers.reducers.getSelectedListReducer(),








}