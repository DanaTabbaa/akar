import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { EntryType } from 'src/app/core/models/entry-type';
import { EntryTypeSelectors } from 'src/app/core/stores/selectors/entry-type.selectors';
import { EntryTypeModel } from 'src/app/core/stores/store.model.ts/entry-types.store.model';
import { Subscription } from 'rxjs';
import { BillTypeSelectors } from 'src/app/core/stores/selectors/bill-type.selector';
import { BillTypeModel } from 'src/app/core/stores/store.model.ts/bill-types.store.model';
import { BillType } from 'src/app/core/models/bill-type';
import { EntryTypeUsersPermissionsService } from 'src/app/core/services/backend-services/entry-type-users-permissions.service';
import { EntryTypesUsersPermissionsVM } from 'src/app/core/models/ViewModel/entry-types-users-permissions-vm';
import { BillTypeUsersPermissionsService } from 'src/app/core/services/backend-services/bill-type-users-permissions.service';
import { BillTypesUsersPermissionsVM } from 'src/app/core/models/ViewModel/bill-types-users-permissions-vm';


import { SharedService } from '../../services/shared.service';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { ContractsSettings } from 'src/app/core/models/contracts-settings';
import { ManagerService } from 'src/app/core/services/backend-services/manager.service';
import { RolesService } from 'src/app/core/services/backend-services/permissions/roles.service';
import { ResponseResult } from 'src/app/core/models/ResponseResult';
import { Roles } from 'src/app/core/models/permissions/roles';


import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})

export class SidebarComponent implements OnInit, OnDestroy {
  rentContractSettings: ContractsSettings[] = [];
  salesContractSettings: ContractsSettings[] = [];
  buyContractSettings: ContractsSettings[] = [];
  maintenanceContractSettings: ContractsSettings[] = [];
  currentUserId: any;
  showRentContract: boolean = false;
  subsList: Subscription[] = [];
  entryTypes: EntryType[] = [];
  entryTypeUsersPermissions: EntryTypesUsersPermissionsVM[] = [];
  billTypes: BillType[] = [];
  billTypesUsersPermissions: BillTypesUsersPermissionsVM[] = [];
  currentRole!:Roles;

  constructor(    
    private store: Store<any>,
    private sharedService: SharedService,    
    private entryTypeUsersPermissionsService: EntryTypeUsersPermissionsService,
    private billTypeUsersPermissionsService: BillTypeUsersPermissionsService,
    private managerService: ManagerService,
    private roleService:RolesService,
    private spinner:NgxSpinnerService
  ) {

  } 
    

  getRoleAndPermission()
  {
    return new Promise<void>((resolve,reject)=>{
      let sub = this.roleService.getWithResponse<Roles>("GetCurrentRole").subscribe({
        next:(res:ResponseResult<Roles>)=>{
          resolve();
          console.log("Current Role ------------------------------",res);
          if(res.data){
            this.currentRole = res.data;
          
          }

        },
        error:(err)=>{

          resolve();
        },
        complete:()=>{

        }
      });
      this.subsList.push(sub);
    })
    
  }


  // loadContractPermissions() {
  //   return new Promise<void>((resolve, reject) => {
  //    let sub =  this.rolesPerimssionsService.getAll("GetUserPagePermissions").subscribe({
  //       next: (res: any) => {

  //         this.userPermissions = res.data;
  //         resolve();

  //       },
  //       error: (err: any) => {
  //         reject(err);
  //       },
  //       complete: () => {

  //       },
  //     });
  //     this.subsList.push(sub);
  //   });


  // }
  //#endregion

  checkUserPermissionsByPageId(pageId) {
    if(this.currentRole){
      let userPermission = this.currentRole.rolesPermissions.find(x => x.pageId == pageId);
      if (userPermission?.permissionJson) {
        let perm = JSON.parse(userPermission?.permissionJson!);
        if(perm["isShow"] == true)
        {
          return true;
        }
      } else {
        return false;
      }
    }
    return false;

    
  }


  ngOnInit(): void {
    this.currentUserId = localStorage.getItem("UserId");
    this.spinner.show();
    
    this.getRoleAndPermission().then(a=>{
      Promise.all([
         
        this.managerService.loadContractSettings(),
        this.managerService.loadEntryTypes(),
      ]).then(a => {
        
        
        this.spinner.hide();
        this.getContractSettings();
        this.getEntryTypes();
        
      }).catch(e=>{
        
        this.spinner.hide();
      });
    }).catch(e=>{
      this.spinner.hide();
    })
   
  }
  ngOnDestroy(): void {
    this.subsList.forEach(s => {
      if (s) {
        s.unsubscribe();
      }
    })
  }
 
  getContractSettings() {
    if (this.managerService.getContractSettings().length) {
      this.rentContractSettings = [];
      this.salesContractSettings = [];
      this.buyContractSettings = [];
      this.maintenanceContractSettings = [];
      
      this.currentRole.contractSettingsRolesPermissions.forEach(c=>{
        let contractType = this.managerService.getContractSettings().find(x=>x.id == c.contractSettingId);
        let perm = JSON.parse( c.permissionsJson);
        if(contractType?.contractTypeId == 1 && perm['isShow'])
        {
          this.rentContractSettings.push(contractType);
        }
        else if(contractType?.contractTypeId == 2 && perm['isShow'])
        {
          this.salesContractSettings.push(contractType);
        }
        else if(contractType?.contractTypeId == 3 && perm['isShow'])
        {
          this.buyContractSettings.push(contractType);
        }
        else if(contractType?.contractTypeId == 4 && perm['isShow'])
        {
          this.maintenanceContractSettings.push(contractType);
        }
      });

      
      
      
      
    }   

  }



  getEntryTypes() {
    
    if (this.managerService.getEntryTypes().length) {
      this.entryTypes = [];
      
      
      this.currentRole.entryTypeRolesPermissions.forEach(c=>{
        let entryType = this.managerService.getEntryTypes().find(x=>x.id == c.entryTypeId);
        let perm = JSON.parse( c.permissionsJson);
        if(perm['isShow'])
        {
          if(entryType)
          {
            this.entryTypes.push(entryType);
          }          
        }       
      });

      
      
      
      
    }  

   console.log("*****************************",this.entryTypes);
  }

  getEntryTypesUserPermissions() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.entryTypeUsersPermissionsService.getWithResponse<EntryTypesUsersPermissionsVM[]>("GetEntryTypeUsersPermissionsOfCurrentUser").subscribe({
        next: (res) => {

          this.entryTypeUsersPermissions = JSON.parse(JSON.stringify(res.data));
        },
        error: (err: any) => {
          reject(err);
        },
        complete: () => {

        },
      })


      this.subsList.push(sub);
    });

  }
  getEntryTypeName(entryType: EntryType) {

    var langCode = localStorage.getItem("language");
    if (langCode == "ar") {
      return entryType.entryNameAr
    }
    return entryType.entryNameEn;
  }
  getEntryTypeData(entryType: EntryType) {

    var langCode = localStorage.getItem("language");
    localStorage.setItem("entryNameAr", entryType.entryNameAr);
    localStorage.setItem("entryNameEn", entryType.entryNameEn);
    if (langCode == "ar") {
      this.sharedService.changeToolbarPath({ componentList: entryType.entryNameAr } as ToolbarPath)
    } else {
      this.sharedService.changeToolbarPath({ componentList: entryType.entryNameEn } as ToolbarPath)

    }

  }
  getContractName(contractsSettings: ContractsSettings) {

    var langCode = localStorage.getItem("language");

    if (langCode == "ar") {

      return contractsSettings.contractArName;
    }

    return contractsSettings.contractEnName;
  }

  getContractInfo(contractsSettings: ContractsSettings) {

    var langCode = localStorage.getItem("language");
    localStorage.setItem("contractArName", contractsSettings.contractArName);
    localStorage.setItem("contractEnName", contractsSettings.contractEnName);
    if (langCode == "ar") {
      this.sharedService.changeToolbarPath({ componentList: contractsSettings.contractArName } as ToolbarPath)
      return contractsSettings.contractArName;
    } else {
      this.sharedService.changeToolbarPath({ componentList: contractsSettings.contractEnName } as ToolbarPath)
      return contractsSettings.contractEnName;
    }

  }

  getBillTypeName(item: BillTypesUsersPermissionsVM) {
    var langCode = localStorage.getItem("language");
    if (langCode == "ar") {
      return item.typeNameAr;
    } else {
      return item.typeNameEn;
    }

  }

  getBillTypeData(item: BillTypesUsersPermissionsVM) {
    var langCode = localStorage.getItem("language");
    if (langCode == "ar") {
      this.sharedService.changeToolbarPath({ componentList: item.typeNameAr } as ToolbarPath)
      return item.typeNameAr;
    } else {
      this.sharedService.changeToolbarPath({ componentList: item.typeNameEn } as ToolbarPath)
      return item.typeNameEn;
    }

  }

  getBillTypes() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.store.select(BillTypeSelectors.selectors.getListSelector).subscribe({
        next: (res: BillTypeModel) => {
          this.billTypes = JSON.parse(JSON.stringify(res.list));


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
  getBillTypesUserPermissions() {

    return new Promise<void>((resolve, reject) => {

      let sub = this.billTypeUsersPermissionsService.getWithResponse<BillTypesUsersPermissionsVM[]>("GetBillTypeUsersPermissionsOfCurrentUser").subscribe({
        next: (res) => {

          this.billTypesUsersPermissions = JSON.parse(JSON.stringify(res.data));
        },
        error: (err: any) => {
          reject(err);
        },
        complete: () => {

        },
      })


      this.subsList.push(sub);
    });

  }


}
