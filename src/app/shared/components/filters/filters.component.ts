import { Component, OnInit, Output, Input, EventEmitter, OnDestroy, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { Region } from 'src/app/core/models/regions';
import { DateConverterService } from 'src/app/core/services/local-services/date-services/date-converter.service';
import { BuildingsService } from 'src/app/core/services/backend-services/buildings.service';
import { TenantsService } from 'src/app/core/services/backend-services/tenants.service';
import { RegionsService } from 'src/app/core/services/backend-services/regions.service';
import { RealestatesService } from 'src/app/core/services/backend-services/realestates.service';
import { UnitsService } from 'src/app/core/services/backend-services/units.service';
import { OwnersVM } from 'src/app/core/models/ViewModel/owners-vm';
import { TenantsVM } from 'src/app/core/models/ViewModel/tenants-vm';
import { BuildingVM } from 'src/app/core/models/ViewModel/buildings-vm';
import { UnitVM } from 'src/app/core/view-models/unit-vm';
import { Floor } from 'src/app/core/models/floors';
import { OwnersService } from 'src/app/core/services/backend-services/owners.service';
import { FloorsService } from 'src/app/core/services/backend-services/floors.service';
import { BuildingsFloorsService } from 'src/app/core/services/backend-services/buildings-floors.service';
import { RealestateVM } from 'src/app/core/models/ViewModel/realestates-vm';
import { UnitsVM } from 'src/app/core/models/ViewModel/units-vm';
import { OfficesVM } from 'src/app/core/models/ViewModel/offices-vm';
import { OfficesService } from 'src/app/core/services/backend-services/offices.service';
import { RentContract } from 'src/app/core/models/rent-contracts';
import { RentContractsService } from 'src/app/core/services/backend-services/rent-contracts.service';
import { DateModel } from 'src/app/core/view-models/date-model';
import { SharedService } from '../../services/shared.service';




@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit,AfterViewInit, OnDestroy {

  selectedFromDate!: DateModel;
  selectedToDate!: DateModel;
  dateType: number = 1;
  enableFilters: boolean = false;
  lang

  @Output() OnFilter: EventEmitter<{
    parentRealEstateId, subRealEstateId,
    ownerId, buildingId, tenantId, regionId, unitId,
     fromDate, toDate, floorId,officeId,rentContractId
  }> = new EventEmitter();

  @Input() ShowOptions: {
    ShowRegion: boolean, ShowRealestate: boolean, ShowSubRealestate: boolean, ShowBuilding: boolean, ShowOwner: boolean,
    ShowTenant: boolean, ShowUnit: boolean,

    ShowFromDate: boolean,
    ShowToDate: boolean, ShowSearch:boolean,ShowFloor:boolean,ShowOffice:boolean,ShowRentContract:boolean,
  } = {
      ShowBuilding: true,
      ShowTenant: true,
      ShowOwner: true,
      ShowRealestate: true,
      ShowSubRealestate:true,
      ShowRegion: true,
      ShowUnit: true,
      ShowFromDate: false,
      ShowToDate: false,
      ShowSearch:true,
      ShowFloor:true,
      ShowOffice: false,
      ShowRentContract: false

    }

  subsList: Subscription[] = [];

  selectedTenantId: any;
  selectedOfficeId: any;
  selectedBuildingId: any;
  selectedUnitId: any;
  selectedRealestateId: any;
  selectedSubRealestateId: any;

  selectedOwnerId: any;
  selectedRegionId: any;
  selectedFloorId: any;
  selectedRentContractId: any;

  regionList: Region[] = [];
  tenantList: TenantsVM[] = [];
  ownerList: OwnersVM[] = [];
  officeList: OfficesVM[] = [];

  currentRoleName!: string;
  lblFromDate: string = "من تاريخ";
  lblToDate: string = "إلى تاريخ";

  buildingList: BuildingVM[] = [];
  realestateList: RealestateVM[] = [];
  subRealestateList: RealestateVM[] = [];

  floorList: Floor[] = [];
  unitList:UnitsVM[]=[];
  rentContractList: RentContract[] = [];



  constructor(private buildSrv: BuildingsService,
    private floorSrv: FloorsService,
    private tenantSrv: TenantsService,
    private ownerSrv: OwnersService,
    private officeSrv: OfficesService,
    private realEstateSrv: RealestatesService,
    private regionSrv: RegionsService,
    private unitSrv: UnitsService,
    private rentContractsSrv: RentContractsService,
    private sharedServices:SharedService,
    private dateConverterService: DateConverterService,
    private spinner: NgxSpinnerService) {
    this.GetData();
  }

  getLanguage() {
    this.sharedServices.getLanguage().subscribe(res => {
      this.lang = res
    })
  }
  ngOnInit() {
    this.getLanguage();

    //
    // this.GetData();

  }
  ngAfterViewInit(): void {
    ;
   // this.selectedFromDate = this.dateConverterService.getCurrentDate();
   // this.selectedToDate = this.dateConverterService.getCurrentDate();
  }
  onSelectFromDate(e: DateModel) {

    this.selectedFromDate = e
    this.FireSearch()
  }

  onSelectToDate(e: DateModel) {
    this.selectedToDate = e;
    this.FireSearch()
  }



  GetData() {
    this.spinner.show();
    //let currentrole = localStorage.getItem("CurrentRole");
    //this.currentRoleName = currentrole;
    Promise.all([
      this.GetOwners(),
    this.GetTenants(),
    this.GetOffices(),
    this.GetBuildings(),
    this.GetRealEstate(),
    this.GetUnits(),
    this.GetRegions(),
    this.GetFloors(),
    this.GetRentContracts()
    ]).then(a => {
      ////(("All Data have been loaded. Enable Filters")
      this.enableFilters = true;
      this.spinner.hide();
    }).catch((err)=>{
      this.spinner.hide();
    })
  }


  GetRegions() {

    const promise = new Promise<void>((resolve, reject) => {
      this.regionSrv.getAll("GetAll").subscribe({
        next: (res: any) => {
          ;
          this.regionList = res.data.map((res: Region[]) => {
            return res
          });
          resolve();
          //(("res", res);
          //((" this.regionList", this.regionList);
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

  GetOwners() {

    const promise = new Promise<void>((resolve, reject) => {
      this.ownerSrv.getAll("GetAllVM").subscribe({
        next: (res: any) => {
          ;
          this.ownerList = res.data.map((res: OwnersVM[]) => {
            return res
          });
          resolve();
          //(("res", res);
          //((" this.ownerList", this.ownerList);
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

  GetRealEstate() {

    const promise = new Promise<void>((resolve, reject) => {
      this.realEstateSrv.getAll("GetAll").subscribe({
        next: (res: any) => {
          ;
          this.realestateList = res.data.map((res: RealestateVM[]) => {
            return res
          });
          resolve();
          //(("res", res);
          //((" this.realestateList", this.realestateList);
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
  getSubRealestate(selectedRealestateId:any)
  {
    if(selectedRealestateId!=null&&selectedRealestateId>0)
    {
    this.subRealestateList=this.realestateList.filter(x=>x.parentId==selectedRealestateId);

    }
    else
    {
      this.subRealestateList=[];
    }
  }

  GetTenants() {

    const promise = new Promise<void>((resolve, reject) => {
      this.tenantSrv.getAll("GetAll").subscribe({
        next: (res: any) => {

          if(this.selectedOwnerId!=null && this.selectedOwnerId!=undefined)
          {
            this.tenantList = res.data.filter(x=>x.ownerId==this.selectedOwnerId).map((res: TenantsVM[]) => {
              return res
            });
         }
         else
         {
          this.tenantList = res.data.map((res: TenantsVM[]) => {
            return res
          });
         }
          resolve();
          //(("res", res);
          //((" this.tenantList", this.tenantList);
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

  GetOffices() {

    const promise = new Promise<void>((resolve, reject) => {
      this.officeSrv.getAll("GetAll").subscribe({
        next: (res: any) => {

          if(this.selectedOwnerId!=null && this.selectedOwnerId!=undefined)
          {
            this.officeList = res.data.filter(x=>x.ownerId==this.selectedOwnerId).map((res: OfficesVM[]) => {
              return res
            });
         }
         else
         {
          this.officeList = res.data.map((res: OfficesVM[]) => {
            return res
          });
         }
          resolve();
          //(("res", res);
          //((" this.officeList", this.officeList);
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

  GetUnits() {

    const promise = new Promise<void>((resolve, reject) => {
      this.unitSrv.getAll("GetAll").subscribe({
        next: (res: any) => {
          ;
          this.unitList = res.data.map((res: UnitVM[]) => {
            return res
          });
          resolve();
          //(("res", res);
          //((" this.unitList", this.unitList);
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

  GetRentContracts() {

    const promise = new Promise<void>((resolve, reject) => {
      this.rentContractsSrv.getAll("GetAll").subscribe({
        next: (res: any) => {
          ;
          this.rentContractList = res.data.map((res: RentContract[]) => {
            return res
          });
          resolve();
          //(("res", res);
          //((" this.rentContractList", this.rentContractList);
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


  GetBuildings() {

    const promise = new Promise<void>((resolve, reject) => {
      this.buildSrv.getAll("GetAll").subscribe({
        next: (res: any) => {
          if (this.selectedOwnerId !=null && this.selectedRealestateId !=null) {

          this.buildingList = res.data.filter(x => x.ownerId == this.selectedOwnerId && x.realestateId == this.selectedRealestateId).map((res: BuildingVM[]) => {
            return res
          });
        }
        else if (this.selectedOwnerId!=null && this.selectedRealestateId == null) {
          ;
          this.buildingList = res.data.filter(x => x.ownerId == this.selectedOwnerId).map((res: BuildingVM[]) => {
            return res
          });
        }
        else
        {
          this.buildingList = res.data.map((res: BuildingVM[]) => {
            return res

          });


        }
          resolve();
          //(("res", res);
          //((" this.buildingList", this.buildingList);
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
  GetFloors() {

    const promise = new Promise<void>((resolve, reject) => {
      this.floorSrv.getAll("GetAll").subscribe({
        next: (res: any) => {
          ;
          this.floorList = res.data.map((res: Floor[]) => {
            return res
          });
          resolve();
          //(("res", res);
          //((" this.floorList", this.floorList);
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


  ngOnDestroy() {
    this.subsList.forEach(s => {
      if (s) {
        s.unsubscribe();
      }
    })
  }













  FireSearch() {

   if(!this.selectedFromDate)
   {
     this.selectedFromDate = this.dateConverterService.getCurrentDate();
   }
   if(!this.selectedToDate)
   {
     this.selectedToDate = this.dateConverterService.getCurrentDate();
   }
    this.OnFilter.emit({
      buildingId: this.selectedBuildingId,
      tenantId: this.selectedTenantId,
      ownerId: this.selectedOwnerId,
      parentRealEstateId: this.selectedRealestateId,
      regionId: this.selectedRegionId,
      unitId: this.selectedUnitId,
      subRealEstateId:this.selectedSubRealestateId,
      fromDate: this.selectedFromDate,
      toDate: this.selectedToDate,
      floorId: this.selectedFloorId,
      officeId:this.selectedOfficeId,
      rentContractId:this.selectedRentContractId

    })
  }

  onSelectRegion() {
    this.FireSearch()

  }
  onSelectOwner() {
    this.FireSearch()

  }
  onSelectTenant() {
    this.FireSearch()

  }
  onSelectOffice() {
    this.FireSearch()

  }
  onSelectRealestate() {
    this.FireSearch()

  }


  onSelectSubRealestate() {
    this.FireSearch()

  }

  onSelectBuilding() {
    this.FireSearch()

  }
  onSelectUnit() {
    this.FireSearch()

  }

  onSelectFloor() {
    this.FireSearch()

  }

  onSelectRentContract() {
    this.FireSearch()

  }


















}
