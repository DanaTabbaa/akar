export interface OffersListVm {

    id: number;
    ownerId: number | null;
    tenantId: number | null;
    vendorId: number | null;
    buildingId: number | null;
    purposeType: number | null;
    offerDuration: number | null;
    offerDate: string | null;
    rentalPeriod: number;
    realestateId: number | null;
    ownerNameEn: string;
    ownerNameAr: string;
    tenantNameEn: string;
    tenantNameAr: string;
    vendorNameEn: string;
    vendorNameAr: string;
    realestateNumber: string;
    realestateNameAr: string;
    realestateNameEn: string;
    buildingNameAr: string;
    buildingNameEn: string;


}