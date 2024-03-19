import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { TranslatePipe } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject, Subscription, throwError } from 'rxjs';
import {
  AlertTypes,
  CheckTableRelationsStatus,
  ToolbarActions,
  convertEnumToArray,
  delegationTypeArEnum,
  delegationTypeEnum,
} from 'src/app/core/constants/enumrators/enums';
import {
  IDENTITY_REQUIRED_VALIDATORS,
  NAME_REQUIRED_VALIDATORS,
  Phone_REQUIRED_VALIDATORS,
  TEXT_FORMAT_VALIDATORS,
} from 'src/app/core/constants/input-validators';
import { ICustomEnum } from 'src/app/core/interfaces/ICustom-enum';
import { ResponseResult } from 'src/app/core/models/ResponseResult';
import { CountriesVM } from 'src/app/core/models/ViewModel/countries-vm';
import { RolesPermissionsVm } from 'src/app/core/models/ViewModel/permissions/roles-permissions-vm';
import { UserPermission } from 'src/app/core/models/permissions/user-permissions';
import { ResponsiblePersons } from 'src/app/core/models/responsible-persons';
import { SystemSettings } from 'src/app/core/models/system-settings';
import { CountriesService } from 'src/app/core/services/backend-services/countries.service';
import { RolesPermissionsService } from 'src/app/core/services/backend-services/permissions/roles-permissions.service';
import { ResponsiblePersonsService } from 'src/app/core/services/backend-services/responsible-persons.service';
import { SystemSettingsService } from 'src/app/core/services/backend-services/system-settings.service';
import { DateConverterService } from 'src/app/core/services/local-services/date-services/date-converter.service';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { CountryActions } from 'src/app/core/stores/actions/country.actions';
import { DateModel } from 'src/app/core/view-models/date-model';
import { MessageModalComponent } from 'src/app/shared/message-modal/message-modal.component';
import { QuickModalService } from 'src/app/shared/services/quick-modal.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Countries } from 'src/app/core/models/countries';


const PAGEID = 37;
@Component({
  selector: 'app-responsible-persons',
  templateUrl: './responsible-persons.component.html',
  styleUrls: ['./responsible-persons.component.scss'],
})
export class ResponsiblePersonsComponent
  implements OnInit, OnDestroy, AfterViewInit {
  //#region Main Declarations
  delegationTypes: ICustomEnum[] = [];
  changeCountriesFlag: number = 0;
  countries: CountriesVM[] = [];
  responsiblePersonsForm!: FormGroup;
  lang: string = '';
  //sub: any;
  url: any;
  id: any = 0;
  // currnetUrl;
  // addUrl: string = '/control-panel/settings/add-country';
  // updateUrl: string = '/control-panel/settings/update-country/';
  // listUrl: string = '/control-panel/settings/countries-list';
  // toolbarPathData: ToolbarPath = {
  //   pageId: PAGEID,
  //   listPath: '',
  //   updatePath: this.updateUrl,
  //   addPath: this.addUrl,
  //   componentList: 'component-names.list-owners',
  //   componentAdd: 'component-names.blank',
  // };
  errorMessage = '';
  errorClass = '';
  submited: boolean = false;
  rolePermission!: RolesPermissionsVm;
  userPermissions!: UserPermission;
  //Response!: ResponseResult<CountriesVM>;
  //#endregion

  //#region Constructor
  //responsiblePersonData$: BehaviorSubject<ResponsiblePersons> = new BehaviorSubject(new ResponsiblePersons());
  updateItemIndex: BehaviorSubject<number> = new BehaviorSubject<number>(-1);
  //responsiblePersonsSubjectList: BehaviorSubject<ResponsiblePersons[]> = new BehaviorSubject<ResponsiblePersons[]>([]);
  constructor(
    private router: Router,
    private countriesService: CountriesService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private rolesPerimssionsService: RolesPermissionsService,
    private alertsService: NotificationsAlertsService,
    private spinner: NgxSpinnerService,
    private snackBar: MatSnackBar,
    private sharedServices: SharedService,
    private dateService: DateConverterService,
    private translate: TranslatePipe,
    private quickModalService: QuickModalService,
    private store: Store<any>,
    private modalService: NgbModal,
    private responsiblePersonsService: ResponsiblePersonsService,
    private sysyemSettingsServices: SystemSettingsService
  ) {
    this.createResponsiblePersonsForm();
    // this.responsiblePersonData$ = new BehaviorSubject(new ResponsiblePersons());
    // this.responsiblePersonsSubject = new BehaviorSubject<ResponsiblePersons[]>([]);
  }
  //#endregion
  systemSettings!: SystemSettings;
  //#region ngOnInit
  ngOnInit(): void {
  
    
    this.currentUserId = parseInt(localStorage.getItem('UserId')!);
    this.spinner.show();
    Promise.all([this.getLanguage(), this.getPagePermissions(PAGEID),this.getSystemSettings()
     ]).then(a=>{
      this.spinner.hide();
      this.getDelegationTypes()
    }).catch(err=>{
      this.spinner.hide();
    });
    

    
    this.listenToResponsibleListData();
  }
  getLanguage() {
    return new Promise<void>((acc, rej) => {
      let sub = this.sharedServices.getLanguage().subscribe({
        next: (res) => {
          this.lang = res;
          acc();

        },
        error: (err) => {
          acc();
        }
      });
      this.subsList.push(sub);
    })

  }

  ngAfterViewInit(): void { }
  onClose(e: Event) {
    e.preventDefault();
    this.quickModalService.closeDialog();
    
    
    //this.sharedServices.setResponsibleListData([]);
    //this.sharedServices.setResponsibleListData(this.responsiblePersons);
    
  }
  resetModalForm(e: any) {
    e.preventDefault();
    e.stopPropagation();
    this.updateMode = false;
    this.responsiblePersonsForm.reset();
  }
  //#endregion

  //#region ngOnDestroy
  ngOnDestroy() {
    this.subsList.forEach((s) => {
      if (s) {
        s.unsubscribe();
      }
    });
    // this.sharedServices.setResponsibleData({} as ResponsiblePersons);
    // this.sharedServices.setResponsibleListData([]);

  }
  //#endregion

  //#region Authentications

  //#endregion

  //#region Permissions
 
  getPagePermissions(pageId) {
   return new Promise<void>((resolve, reject) => {
      let sub = this.rolesPerimssionsService
        .getAll('GetPagePermissionById?pageId=' + pageId)
        .subscribe({
          next: (res: any) => {
            resolve();
            this.rolePermission = JSON.parse(JSON.stringify(res.data));
            this.userPermissions = JSON.parse(
              this.rolePermission.permissionJson
            );
            this.sharedServices.setUserPermissions(this.userPermissions);
            
          },
          error: (err: any) => {
            this.spinner.hide();
            reject(err);
          },
          complete: () => { },
        });

        this.subsList.push(sub);
    });
    
  }
  //#endregion

  //#region  State Management
  //#endregion

  //#region Basic Data
  ///Geting form dropdown list data
  createResponsiblePersonsForm() {
    this.responsiblePersonsForm = this.fb.group({
      id: '',
      parentId: 0,
      nameAr: NAME_REQUIRED_VALIDATORS,
      nameEn: NAME_REQUIRED_VALIDATORS,
      identityNo: IDENTITY_REQUIRED_VALIDATORS,
      identityIssuerPlace: '',
      identityIssuerDate: '',
      identityExpireDate: '',
      jobTitle: '',
      delegationTypeId: 1,
      mobileNumber: Phone_REQUIRED_VALIDATORS,
      phoneNumber: '',
      isActive: '',
    });
    this.respoIdentityExpireDate = this.dateService.getCurrentDate();
    this.identityIssuerDate = this.dateService.getCurrentDate();
  }
  currentUserId!: number;
  IdentityNumberDigits: number = 14;
  identityNoDigits: number = 14;
  getSystemSettings() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.sysyemSettingsServices.getAll('GetAll').subscribe({
        next: (res: any) => {
          resolve();
          this.systemSettings = res.data
            .filter((x) => x.userId == this.currentUserId)
            .map((res: SystemSettings[]) => {
              return res;
            });
          this.identityNoDigits =
            this.systemSettings.numberOfIdentityNo != null || 0
              ? this.systemSettings.numberOfIdentityNo
              : this.IdentityNumberDigits;

          
          //(("res", res);
          //((" this.countries", this.countries);
        },
        error: (err: any) => {
          reject(err);
        },
        complete: () => { },
      });
      this.subsList.push(sub);
    });
    
  }
  showSnackBarMessage(messageKey: string) {
    this.snackBar.open(
      this.translate.transform(messageKey),
      this.translate.transform('buttons.close'),
      {
        duration: 3000, // Show the message for 3 seconds
        direction: 'rtl',
        panelClass: 'error-snackbar', // Apply custom CSS class for styling
      }
    );
  }
  //#endregion
  // Add a responsible person to the array.
  addResponsiblePerson() {
     
    this.responsiblePersonsForm.value.identityExpireDate = this.dateService.getDateForInsertISO_Format(this.respoIdentityExpireDate);
    const responsiblePerson = this.responsiblePersonsForm.value;
    // Check if the name and identity are empty
    if (!responsiblePerson.nameAr || !responsiblePerson.nameEn || !responsiblePerson.identityNo) {
      // Display error message using MatSnackBar
      this.showSnackBarMessage("validation-messages.invalid-data");
      this.responsiblePersonsForm.markAllAsTouched();
      return; // Exit the function if the data is empty
    }

    // Check for duplicate records
    const isDuplicate = this.responsiblePersons.some(
      (person: ResponsiblePersons) => {
        // Compare the properties that determine uniqueness
        return (
          person.nameAr === responsiblePerson.nameAr &&
          person.nameEn === responsiblePerson.nameEn &&
          person.identityNo === responsiblePerson.identityNo
        );
      }
    );

    if (isDuplicate) {
      // Display error message using MatSnackBar
      this.showSnackBarMessage("messages.record-exsiting");
    } else {

      // Add the responsible person to the BehaviorSubject
      responsiblePerson.id = 0;
      this.responsiblePersons.push(responsiblePerson);

      this.sharedServices.setResponsibleListData(this.responsiblePersons);
      // Reset the form and show success message
      //this.responsiblePersonsForm.reset();
      this.showSnackBarMessage("messages.add-list-success");
    }
  }
  editResponsiblePerson(responsiblePerson: ResponsiblePersons) {


    // Check if the name and identity are empty
    if (!responsiblePerson.nameAr || !responsiblePerson.nameEn || !responsiblePerson.identityNo) {
      // Display error message using MatSnackBar
      this.showSnackBarMessage("validation-messages.invalid-data");
      return; // Exit the function if the data is empty
    }

    // Check for duplicate records
    let itemIndex = this.updateItemIndex.getValue()
    // const isDuplicate = this.responsiblePersons.some((person: ResponsiblePersons) => {

    if (itemIndex !== -1) {
      // Update the responsible person in the list
      this.responsiblePersons[itemIndex] = responsiblePerson;
      this.sharedServices.setResponsibleListData(this.responsiblePersons);
      //this.responsiblePersonsSubjectList.next( this.responsiblePersons);
      //this.sharedServices.setResponsibleData(responsiblePerson);

      // Show success message
      this.showSnackBarMessage("messages.update-success");
      //this.updateItemIndex.next(-1); //resset varialbe
    }

  }
  updateMode: boolean = false;
  getEditItem(responsiblePerson: ResponsiblePersons, event:Event) {
    event.preventDefault();
    this.updateMode = true;
    let itemIndex = this.responsiblePersons.findIndex((person: ResponsiblePersons) => person === responsiblePerson);
    this.updateItemIndex.next(itemIndex)
    this.responsiblePersonsForm.reset();
    this.responsiblePersonsForm.patchValue({ ...responsiblePerson })
  }
  // checkDublicate(responsiblePerson:ResponsiblePersons) {
  //   // let sub = this.sharedServices.getResponsibleData().subscribe({
  //   //   next: (responsiblePerson: ResponsiblePersons) => {

        
  //   //   },
  //   // });
  //   // this.subsList.push(sub);

  //   if (ObjectIsNotNullOrEmpty(responsiblePerson)) {
  //     this.responsiblePersonsForm.patchValue({ ...responsiblePerson });
  //     const isDuplicate = this.responsiblePersons.some(
  //       (person: ResponsiblePersons) => {
  //         // Compare the properties that determine uniqueness
  //         return (
  //           person.nameAr === responsiblePerson.nameAr &&
  //           person.nameEn === responsiblePerson.nameEn &&
  //           person.identityNo === responsiblePerson.identityNo
  //         );
  //       }
  //     );

  //     if (isDuplicate) {
  //       // Display error message using MatSnackBar
  //       this.showSnackBarMessage("messages.record-exsiting");
        
  //     } else {
  //       //  this.responsiblePersons.push(responsiblePerson);
  //     }
  //     return isDuplicate;


  //   }
  //   return false;
  // }
  listenToResponsibleListData() {
    let sub = this.sharedServices.getResponsibleListData().subscribe({
      next: (responsiblePersons: ResponsiblePersons[]) => {
        
        if (responsiblePersons.length > 0) {
          this.responsiblePersons = [];
          this.responsiblePersons.push(...responsiblePersons);
        }
      },
    });
    this.subsList.push(sub);
  }
  // Remove a responsible person from the array.
  deleteResponsiblePerson(index:any,  event: Event) {
    event.preventDefault();
    let person  = this.responsiblePersons[index];
    if(person){
      if(!person.id){
        this.deleteFromList(index);
      }
      else
      {
        this.showConfirmDeleteMessage(person.id);
       
      }
    }
    
  }

  

  deleteFromList(index:any)
  {
    this.responsiblePersons.splice(index, 1);
    this.sharedServices.setResponsibleListData(this.responsiblePersons);
  }

  // The array of responsible persons.

  //#region CRUD Operations
  // getCountries() {
  //   return new Promise<void>((resolve, reject) => {
  //     let sub = this.store.select(CountrySelectors.selectors.getListSelector).subscribe({
  //       next: (res: CountriesModel) => {
  //         resolve();
  //         this.countries = [...res.list];
  //       },
  //       error: (err: any) => {
  //         reject(err);
  //       },
  //       complete: () => { },
  //     });
  //     this.subsList.push(sub);
  //   });

  // }

  // onChangeCountry(countryId: any) {
  //   let country = this.countries.find(x => x.id == countryId);
  //   if (country) {
  //     this.responsiblePersonsForm.setValue({
  //       id: country.id,
  //       countryNameAr: country.countryNameAr,
  //       countryNameEn: country.countryNameEn,
  //     });
  //   }

  // }

  getDelegationTypes() {
    if (this.lang == 'en') {
      this.delegationTypes = convertEnumToArray(delegationTypeEnum);
    } else {
      this.delegationTypes = convertEnumToArray(delegationTypeArEnum);
    }
  }

  getDelegationTypesById(id: any) {
    let delegationType;
    if (this.lang == 'en') {
      delegationType = convertEnumToArray(delegationTypeEnum).find(
        (x) => x.id == id
      )?.name;
    } else {
      delegationType = convertEnumToArray(delegationTypeArEnum).find(
        (x) => x.id == id
      )?.name;
    }
    return delegationType;
  }
  getActiveStatus(activeStatue: any) {
    if (activeStatue) {
      return this.translate.transform('user-manager.active');
    } else {
      return this.translate.transform('user-manager.disactive');
    }
  }

  //#endregion

  //#region Helper Functions

  get f(): { [key: string]: AbstractControl } {
    return this.responsiblePersonsForm.controls;
  }

  showResponseMessage(responseStatus, alertType, message) {
    if (responseStatus == true && AlertTypes.success == alertType) {
      this.alertsService.showSuccess(
        message,
        this.translate.transform('messageTitle.done')
      );
    } else if (responseStatus == true && AlertTypes.warning) {
      this.alertsService.showWarning(
        message,
        this.translate.transform('messageTitle.alert')
      );
    } else if (responseStatus == true && AlertTypes.info) {
      this.alertsService.showInfo(
        message,
        this.translate.transform('messageTitle.info')
      );
    } else if (responseStatus == false && AlertTypes.error) {
      this.alertsService.showError(
        message,
        this.translate.transform('messageTitle.error')
      );
    }
  }

  //#endregion
  //#region Toolbar
  subsList: Subscription[] = [];
  // currentBtnResult;
  // listenToClickedButton() {
  //   let sub = this.sharedServices.getClickedbutton().subscribe({
  //     next: (currentBtn: ToolbarData) => {
  //       currentBtn;

  //       if (currentBtn != null) {
  //         if (currentBtn.action == ToolbarActions.List) {
  //           this.sharedServices.changeToolbarPath(this.toolbarPathData);
  //           //  this.router.navigate([this.listUrl]);
  //         } else if (
  //           currentBtn.action == ToolbarActions.Save &&
  //           currentBtn.submitMode
  //         ) {
  //           this.onSave();
  //         } else if (currentBtn.action == ToolbarActions.New) {
  //           this.toolbarPathData.componentAdd = this.translate.transform(
  //             'component-names.add-country'
  //           );

  //           this.sharedServices.changeToolbarPath(this.toolbarPathData);
  //           this.router.navigate([this.addUrl]);
  //         } else if (
  //           currentBtn.action == ToolbarActions.Update &&
  //           currentBtn.submitMode
  //         ) {
  //           this.onUpdate();
  //         }
  //       }
  //     },
  //   });
  //   this.subsList.push(sub);
  // }
  // changePath() {
  //   this.sharedServices.changeToolbarPath(this.toolbarPathData);
  // }

  //#endregion

  onSave() {
    if (this.responsiblePersonsForm.valid) {
      this.sharedServices.changeButtonStatus({
        button: 'Save',
        disabled: true,
      });

      return new Promise<void>((resolve, reject) => {
        let sub = this.countriesService.addWithUrl(
          'Insert',
          this.responsiblePersonsForm.value
        ).subscribe({
          next: (result: ResponseResult<Countries>) => {
            this.spinner.show();

            if (result.success && !result.isFound) {
              this.changeCountriesFlag++;
              this.store.dispatch(
                CountryActions.actions.insert({
                  data: JSON.parse(JSON.stringify({ ...result.data })),
                })
              );
              //  this.defineCountryForm();

              setTimeout(() => {
                this.spinner.hide();
                this.showResponseMessage(
                  result.success,
                  AlertTypes.success,
                  this.translate.transform('messages.add-success')
                );
                // navigateUrl(this.addUrl, this.router);
              }, 500);
            } else if (result.isFound) {
              this.spinner.hide();
              this.showResponseMessage(
                result.success,
                AlertTypes.warning,
                this.translate.transform('messages.record-exsiting')
              );
            }
          },
          error: (err: any) => {
            this.spinner.hide();
            reject(err);
          },
          complete: () => { },
        });

        this.subsList.push(sub);
      });

    } else {
      this.errorMessage = this.translate.transform(
        'validation-messages.invalid-data'
      );
      this.errorClass = 'errorMessage';
      this.alertsService.showError(
        this.errorMessage,
        this.translate.transform('message-title.wrong')
      );
      return this.responsiblePersonsForm.markAllAsTouched();
    }
  }
  onUpdate() {
    if (this.responsiblePersonsForm.valid) {
      this.responsiblePersonsForm.value.id = this.id;
      return new Promise<void>((resolve, reject) => {
        let sub = this.countriesService.updateWithUrl(
          'Update',
          this.responsiblePersonsForm.value
        ).subscribe({
          next: (result: any) => {
            this.spinner.show();
            
            if (result.success && !result.isFound) {
              this.changeCountriesFlag++;
              this.store.dispatch(
                CountryActions.actions.update({
                  data: JSON.parse(JSON.stringify({ ...result.data })),
                })
              );

              setTimeout(() => {
                this.spinner.hide();
                this.showResponseMessage(
                  result.success,
                  AlertTypes.success,
                  this.translate.transform('messages.update-success')
                );
                //  navigateUrl(this.addUrl, this.router);
              }, 500);
            } else if (result.isFound) {
              this.spinner.hide();
              this.showResponseMessage(
                result.success,
                AlertTypes.warning,
                this.translate.transform('messages.record-exsiting')
              );
            }
          },
          error: (err: any) => {
            this.spinner.hide();
            reject(err);
          },
          complete: () => { },
        });
        this.subsList.push(sub);
      });
      
    } else {
      this.errorMessage = this.translate.transform(
        'validation-messages.invalid-data'
      );
      this.errorClass = 'errorMessage';
      this.alertsService.showError(
        this.errorMessage,
        this.translate.transform('message-title.wrong')
      );
      return this.responsiblePersonsForm.markAllAsTouched();
    }
  }
  identityIssuerDate!: DateModel;
  respoIdentityExpireDate!: DateModel;
  isRespoIdentityExpireDateGreater: boolean = false;
  onSelectRespoIdentityExpireDate: boolean = false;
  respoIdentityDate!: DateModel;
  getRespoIdentityExpireDate(selectedDate: DateModel) {

    this.isRespoIdentityExpireDateGreater =
      this.dateService.compareStartDateIsGreater(
        this.identityIssuerDate,
        selectedDate
      );
    if (this.isRespoIdentityExpireDateGreater == false) {
      this.onSelectRespoIdentityExpireDate = true;
      this.respoIdentityExpireDate = selectedDate;
    } else {
      this.onSelectRespoIdentityExpireDate = false;
    }
  }
  getIdentityIssuerDate(selectedDate: DateModel) {

    this.identityIssuerDate = selectedDate;
  }

  delete(id: any) {
    if (this.userPermissions.isDelete) {
      this.showConfirmDeleteMessage(id);
    } else {
      this.showResponseMessage(
        true,
        AlertTypes.warning,
        this.translate.transform('permissions.permission-denied')
      );
    }
  }
  //#endregion
  //#region Helper Functions
  goToAdd(typeOfComponent: any) {
    this.router.navigate(['/control-panel/definitions/add-owner'], {
      queryParams: { typeOfComponent: typeOfComponent },
    });
  }
  //edit(id: string) {
    //this.sharedServices.changeButton({ action: 'Update' } as ToolbarData);
    //this.router.navigate(['/control-panel/definitions/update-owner', id]);
    
  //}
  responsiblePersons: ResponsiblePersons[] = [];

  showConfirmDeleteMessage(id: number) {
    const modalRef = this.modalService.open(MessageModalComponent);
    modalRef.componentInstance.message = this.translate.transform(
      'messages.confirm-delete'
    );
    modalRef.componentInstance.title =
      this.translate.transform('messages.delete');
    modalRef.componentInstance.isYesNo = true;
    modalRef.result.then(
      (rs) => {
        if (rs == 'Confirm') {
          
          let deletedItem = this.responsiblePersons.find(
            (x) => x.id == id
          ) as ResponsiblePersons;
          let deletedOwnerIndex = this.responsiblePersons.indexOf(deletedItem);
          
          this.spinner.show();
          let sub = this.responsiblePersonsService
            .deleteWithUrl('delete?id=' + id)
            .subscribe(
              (resonse) => {
              this.spinner.hide();
              if (resonse.success == true) {
                //this.getResponsiblePersons();
                //   this.store.dispatch(OwnerActions.actions.setList({
                //     data: [...ownersList!]
                // }));
                this.deleteFromList(deletedOwnerIndex);
                

                this.showResponseMessage(
                  resonse.success,
                  AlertTypes.success,
                  this.translate.transform('messages.delete-success')
                );
              } else if (
                resonse.success == false &&
                resonse.status == CheckTableRelationsStatus.hasRelations
              ) {
                let message =
                  this.translate.transform('messages.delete-faild') +
                  '-' +
                  this.translate.transform('tables-names.' + resonse.message) +
                  '-';
                this.showResponseMessage(
                  resonse.success,
                  AlertTypes.error,
                  message
                );
              }
            }, err=>{
              this.spinner.hide();  
              let message =
              this.translate.transform('messages.delete-faild') +
              '-' +
              this.translate.transform('tables-names.' + JSON.stringify(err.error)) +
              '-';
            this.showResponseMessage(
              false,
              AlertTypes.error,
              message
            );
                  
            });
            this.subsList.push(sub);
          
        }
      },
      (err) => {
        this.spinner.hide();
      }
    );
  }
  
}
