import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { AlertTypes, ToolbarActions } from 'src/app/core/constants/enumrators/enums';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { Equipments } from 'src/app/core/models/equipments';
import { Owner } from 'src/app/core/models/owners';
import { UserPermission } from 'src/app/core/models/permissions/user-permissions';
import { ResponseResult } from 'src/app/core/models/ResponseResult';
import { OwnersVM } from 'src/app/core/models/ViewModel/owners-vm';
import { RolesPermissionsVm } from 'src/app/core/models/ViewModel/permissions/roles-permissions-vm';
import { EquipmentsService } from 'src/app/core/services/backend-services/equipments.service';
import { OwnersService } from 'src/app/core/services/backend-services/owners.service';
import { RolesPermissionsService } from 'src/app/core/services/backend-services/permissions/roles-permissions.service';
import { DateConverterService } from 'src/app/core/services/local-services/date-services/date-converter.service';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { DateModel } from 'src/app/core/view-models/date-model';
import { SharedService } from 'src/app/shared/services/shared.service';
const PAGEID=28; // from pages table in database seeding table
@Component({
  selector: 'app-equipments',
  templateUrl: './equipments.component.html',
  styleUrls: ['./equipments.component.scss']
})
export class EquipmentsComponent implements OnInit,OnDestroy {
  //properties
  currnetUrl: any;
  addUrl: string = '/control-panel/maintenance/add-equipment';
  updateUrl: string = '/control-panel/maintenance/update-equipment/';
  listUrl: string = '/control-panel/maintenance/equipments-list';
  toolbarPathData: ToolbarPath = {
    pageId:PAGEID,
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList:"menu.equipments",
    componentAdd:"equipments.add-equipment",
  };
  equipmentForm!: FormGroup;
  errorMessage = '';
  errorClass = '';
  ownersList: Owner[] = [];
  sub: any;
  id: any = 0;
  url: any;
  submited: boolean = false;
  Response!: ResponseResult<Equipments>;
  lang
  //
  //constructor
  constructor(
    private OwnerService: OwnersService,
    private EquipmentsService: EquipmentsService,
    private AlertsService: NotificationsAlertsService,
    private sharedServices: SharedService,
    private spinner:NgxSpinnerService,
    private translate: TranslatePipe,
    private dateService: DateConverterService,
    private rolesPerimssionsService:RolesPermissionsService,
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.createEquipmentForm();
  }

  getLanguage() {
    this.sharedServices.getLanguage().subscribe(res => {
      this.lang = res
    })
  }
  createEquipmentForm() {
    this.equipmentForm = this.fb.group({
      id: 0,
      ownerId: ['', Validators.compose([Validators.required])],
      equipmentNumber: ['', Validators.compose([Validators.required])],
      equipmentNameAr: ['', Validators.compose([Validators.required])],
      equipmentNameEn: ['', Validators.compose([Validators.required])],
      manufactureYear: ['', Validators.compose([Validators.required])],
      model: ['', Validators.compose([Validators.required])],
      manufacturingCompany: ['', Validators.compose([Validators.required])],
      supplyingCompany: ['', Validators.compose([Validators.required])],
      installationDate: '',
      installationPlace: ['', Validators.compose([Validators.required])],

    });
    this.installationDate = this.dateService.getCurrentDate();

  }
  //

  //#region ngOnDestory
  ngOnDestroy() {
    this.subsList.forEach((s) => {
      if (s) {
        s.unsubscribe();
      }
    });
  }
  //


  //#region Permissions
  rolePermission!:RolesPermissionsVm;
  userPermissions!:UserPermission;
  getPagePermissions(pageId)
  {
    const promise = new Promise<void>((resolve, reject) => {
        this.rolesPerimssionsService.getAll("GetPagePermissionById?pageId="+pageId).subscribe({
          next: (res: any) => {
            this.rolePermission = JSON.parse(JSON.stringify(res.data));
             this.userPermissions=JSON.parse(this.rolePermission.permissionJson);
             this.sharedServices.setUserPermissions(this.userPermissions);
            resolve();

          },
         error: (err: any) => {
            this.spinner.hide();
            reject(err);
          },
          complete: () => {

          },
        });
      });
      return promise;

  }
//#endregion

  //ngOnInit
  ngOnInit(): void {
    this.getLanguage()
    this.sharedServices.changeButton({action:'Save'}as ToolbarData)
    this.getPagePermissions(PAGEID)
    this.currnetUrl = this.router.url;
    this.listenToClickedButton();
    this.id = 0;
    this.getOwners();

    this.sub = this.route.params.subscribe((params) => {
      if (params['id'] != null) {
        this.id = +params['id'];
        if (this.id > 0) {
          this.sharedServices.changeButton({action:'Update'}as ToolbarData)
          this.getEquipmentById(this.id);
        }
      }
      // (+) converts string 'id' to a number
      // In a real app: dispatch action to load the details here.
      this.url = this.router.url.split('/')[2];
    });
  }
  //

  //methods
  getOwners() {
    const promise = new Promise<void>((resolve, reject) => {
      this.OwnerService.getAll("GetAllVM").subscribe({
        next: (res: any) => {
          this.ownersList = res.data.map((res: OwnersVM[]) => {
            return res;
          });
          resolve();
          //(('res', res);
          //((' this.ownersList', this.ownersList);
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



  navigateUrl(urlroute: string) {
    this.router.navigate([urlroute]);
  }

  onSave() {
    this.submited = true;

    if (this.equipmentForm.valid) {
      if (this.id == 0) {
        this.sharedServices.changeButtonStatus({button:'Save',disabled:true})
        this.equipmentForm.value.Id = 0;
        this.equipmentForm.value.installationDate =
          this.dateService.getDateForInsertISO_Format(
            this.installationDate
          );

        this.EquipmentsService.addData('Insert', this.equipmentForm.value).subscribe(
          (result) => {
            if (result != null) {

              this.Response = { ...result.response};
              this.showResponseMessage(
                true, AlertTypes.success, this.translate.transform("messages.add-success")
              );
              this.createEquipmentForm();
              this.equipmentForm.reset();
              this.submited = false;

              setTimeout(() => {
                this.navigateUrl(this.listUrl);
              }, 500);
            }
          },
          (error) => console.error(error)
        );
      }
    } else {
      this.sharedServices.changeButtonStatus({button:'Save',disabled:false})
      this.errorMessage = this.translate.transform("validation-messages.invalid-data");
      this.errorClass = 'errorMessage';
      this.AlertsService.showError(this.errorMessage, this.translate.transform("message-title.wrong"));
      return this.equipmentForm.markAllAsTouched();
    }
  }
  equipmentObj!: Equipments;
  onUpdate() {

    if (this.equipmentObj != null) {
      this.equipmentForm.value.id = this.id;
      this.equipmentForm.value.installationDate =this.dateService.getDateForInsertISO_Format(this.installationDate);
      this.EquipmentsService.update(this.equipmentForm.value).subscribe(
        (result) => {

          if (result != null) {
            this.showResponseMessage(true, AlertTypes.success, this.translate.transform("messages.update-success"))
            this.router.navigate([this.listUrl]);

          }
        },
        (error) => console.error(error)
      );
    } else {
      this.errorMessage = this.translate.transform("validation-messages.invalid-data");
      this.errorClass = 'errorMessage';
      this.AlertsService.showError(this.errorMessage, this.translate.transform("message-title.wrong"));
      return this.equipmentForm.markAllAsTouched();
    }
  }

  getEquipmentById(id: any) {
    const promise = new Promise<void>((resolve, reject) => {
      this.EquipmentsService.getById(id).subscribe({
        next: (res: any) => {
          this.equipmentObj = { ...res.data };


          this.equipmentForm.setValue({
            id: this.id,
            ownerId: res.data.ownerId,
            equipmentNumber: res.data.equipmentNumber,
            equipmentNameAr: res.data.equipmentNameAr,
            equipmentNameEn: res.data.equipmentNameEn,
            manufactureYear: res.data.manufactureYear,
            model: res.data.model,
            manufacturingCompany: res.data.manufacturingCompany,
            supplyingCompany: res.data.supplyingCompany,
            installationDate: '',
            installationPlace:res.data.installationPlace


          });

          this.installationDate = this.dateService.getDateForCalender(
            res.data.installationDate
          );
        //(('this.equipmentForm.value set value', this.equipmentForm.value);
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
  showResponseMessage(responseStatus, alertType, message) {

    if (responseStatus == true && AlertTypes.success == alertType) {
      this.AlertsService.showSuccess(message, this.translate.transform("messageTitle.done"));
    } else if (responseStatus == true && AlertTypes.warning) {
      this.AlertsService.showWarning(message, this.translate.transform("messageTitle.alert"));
    } else if (responseStatus == true && AlertTypes.info) {
      this.AlertsService.showInfo(message, this.translate.transform("messageTitle.info"));
    } else if (responseStatus == false && AlertTypes.error) {
      this.AlertsService.showError(message, this.translate.transform("messageTitle.error"));
    }
  }
  get f(): { [key: string]: AbstractControl } {
    return this.equipmentForm.controls;
  }
  //

  //#region tabulator

  subsList: Subscription[] = [];
  currentBtnResult;
  listenToClickedButton() {
    let sub = this.sharedServices.getClickedbutton().subscribe({
      next: (currentBtn: ToolbarData) => {
        currentBtn;

        if (currentBtn != null) {
          if (currentBtn.action == ToolbarActions.List) {
            this.sharedServices.changeToolbarPath({
              listPath: this.listUrl,
            } as ToolbarPath);
            this.router.navigate([this.listUrl]);
          } else if (currentBtn.action == ToolbarActions.Save && currentBtn.submitMode) {
            this.onSave();
          } else if (currentBtn.action == ToolbarActions.New) {
            this.toolbarPathData.componentAdd ="equipments.add-equipment";
            this.createEquipmentForm();
            this.sharedServices.changeToolbarPath(this.toolbarPathData);
            this.navigateUrl(this.addUrl);
          } else if (currentBtn.action == ToolbarActions.Update && currentBtn.submitMode ) {
            this.onUpdate();
          }
        }
      },
    });
    this.subsList.push(sub);
  }

  changePath() {
    this.sharedServices.changeToolbarPath(this.toolbarPathData);
  }
  //#endregion

  //#region Date Picker

  installationDate!: DateModel;

  getInstallationDate(selectedDate: DateModel) {

    this.installationDate = selectedDate;
  }

  //#endregion
  currentYear:any=new Date().getFullYear();
  isValidManufactureYear:boolean=false;
  checkNumber(input:number) {

    if( input>this.currentYear||input <= 1900)
    {
      this.isValidManufactureYear =true;
    }else{
      this.isValidManufactureYear =false;
    }

  }
}
