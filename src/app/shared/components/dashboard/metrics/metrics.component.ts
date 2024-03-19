import { Component, OnInit } from '@angular/core';
import { MaintenanceContractsService } from 'src/app/core/services/backend-services/maintenance-contracts.service';
import { OwnersService } from 'src/app/core/services/backend-services/owners.service';
import { PurchasersService } from 'src/app/core/services/backend-services/purchasers.service';
import { RentContractsService } from 'src/app/core/services/backend-services/rent-contracts.service';
import { SalesBuyContractsService } from 'src/app/core/services/backend-services/sales-contracts.service';
import { TenantsService } from 'src/app/core/services/backend-services/tenants.service';
import { UnitsService } from 'src/app/core/services/backend-services/units.service';

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.scss']
})
export class MetricsComponent implements OnInit {
  tenantsCount!: Number;
  ownersCount!: Number;
  purchasersCount!: Number;
  vacantRentalUnitsCount!: Number;
  rentedRentalUnitsCount!: Number;
  underContractRentalUnitsCount!: Number;
  evacuationRentalUnitsCount!: Number;
  offerRentalUnitsCount!: Number;
  bookedRentalUnitsCount!: Number;
  rentalUnitsCount!: Number;
  salesUnitsCount!: Number;
  rentContractsCount!: Number;
  salesAndBuyContractsCount!: Number;
  maintenanceContractsCount!: Number;




  constructor(private tenantsService: TenantsService,
    private ownersService: OwnersService,
    private purchasersService: PurchasersService,
    private unitsService: UnitsService,
    private rentContractsService: RentContractsService,
    private salesBuyContractsService: SalesBuyContractsService,
    private maintenanceContractsService: MaintenanceContractsService

  ) { }

  ngOnInit(): void {
    
    this.getOwnersCount()
    this.getTenantsCount()
    this.getPurchasersCount()
    this.getRentContractssCount()
    this.getUnitsCount()
    this.getSalesBuyContractssCount()
    this.getMaintenanceContractssCount()


  }
  getOwnersCount() {
    const promise = new Promise<void>((resolve, reject) => {
      this.ownersService.getAll("GetAllVM").subscribe({
        next: (res: any) => {

          this.ownersCount = res.data.length
          resolve();

        },
        error: (err: any) => {
          reject(err);
        },
        complete: () => {

        },
      });
    });
    return promise;
  }
  getTenantsCount() {
    const promise = new Promise<void>((resolve, reject) => {
      this.tenantsService.getAll("GetAll").subscribe({
        next: (res: any) => {

          this.tenantsCount = res.data.length
          resolve();

        },
        error: (err: any) => {
          reject(err);
        },
        complete: () => {

        },
      });
    });
    return promise;
  }
  getPurchasersCount() {
    const promise = new Promise<void>((resolve, reject) => {
      this.purchasersService.getAll("GetAll").subscribe({
        next: (res: any) => {

          this.purchasersCount = res.data.length
          resolve();

        },
        error: (err: any) => {
          reject(err);
        },
        complete: () => {

        },
      });
    });
    return promise;
  }
  getUnitsCount() {
    const promise = new Promise<void>((resolve, reject) => {
      this.unitsService.getAll("GetAll").subscribe({
        next: (res: any) => {
           
          this.vacantRentalUnitsCount = res.data.filter(x => x.purposeType == 1 && (x.unitStatus == null || x.unitStatus == 1)).length
          this.rentedRentalUnitsCount = res.data.filter(x => x.purposeType == 1 && x.unitStatus == 4).length
          this.underContractRentalUnitsCount = res.data.filter(x => x.purposeType == 1 && x.unitStatus == 3).length
          this.bookedRentalUnitsCount = res.data.filter(x => x.purposeType == 1 && x.unitStatus == 2).length
          this.evacuationRentalUnitsCount = res.data.filter(x => x.purposeType == 1 && x.unitStatus == 5).length
          this.offerRentalUnitsCount = res.data.filter(x => x.purposeType == 1 && x.unitStatus == 6).length
          this.rentalUnitsCount = res.data.filter(x => x.purposeType == 1).length
          this.salesUnitsCount = res.data.filter(x => x.purposeType == 2).length


          resolve();

        },
        error: (err: any) => {
          reject(err);
        },
        complete: () => {

        },
      });
    });
    return promise;
  }
  getRentContractssCount() {
    const promise = new Promise<void>((resolve, reject) => {
      this.rentContractsService.getAll("GetAll").subscribe({
        next: (res: any) => {

          this.rentContractsCount = res.data.length
          resolve();

        },
        error: (err: any) => {
          reject(err);
        },
        complete: () => {

        },
      });
    });
    return promise;
  }
  getSalesBuyContractssCount() {
    const promise = new Promise<void>((resolve, reject) => {
      this.salesBuyContractsService.getAll("GetAll").subscribe({
        next: (res: any) => {

          this.salesAndBuyContractsCount = res.data.length
          resolve();

        },
        error: (err: any) => {
          reject(err);
        },
        complete: () => {

        },
      });
    });
    return promise;
  }
  getMaintenanceContractssCount() {
    const promise = new Promise<void>((resolve, reject) => {
      this.maintenanceContractsService.getAll("GetAll").subscribe({
        next: (res: any) => {

          this.maintenanceContractsCount = res.data.length
          resolve();

        },
        error: (err: any) => {
          reject(err);
        },
        complete: () => {

        },
      });
    });
    return promise;
  }

}
