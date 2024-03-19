import { SelectedUnit } from './offer-unit-details';
import { OfferUnitServiceDetails } from './offers-units-details';
export interface Offers {

    id: number;
    ownerId: number | null;
    tenantId: number | null;
    vendorId: number | null;
    buildingId: number | null;
    purposeType: number | null;
    offerDuration: number | null;
    offerDate: string | null;
    rentalPeriod: number | null;
    rentPeriodType: number | null;
    realestateId: number | null;
    rentalPeriodType: number | null;
    averagePriceOfMeter: number | null;
    totalAreaSize: number | null;
    firtsDueDate: string | null;
    numberOfPayments: number | null;
    periodBetweenPayments: number | null;
    paymentTimeType: number | null;
    totalRentAmount: number | null;
    notes: string;
    offerUnitDetails: SelectedUnit[];
    offerUnitServiceDetails: OfferUnitServiceDetails[];

}
