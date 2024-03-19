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
  
} from 'src/app/core/constants/enumrators/enums';
import { ICustomEnum } from 'src/app/core/interfaces/ICustom-enum';
import { ResponseResult } from 'src/app/core/models/ResponseResult';
import { CountriesVM } from 'src/app/core/models/ViewModel/countries-vm';
import { RolesPermissionsVm } from 'src/app/core/models/ViewModel/permissions/roles-permissions-vm';
import { UserPermission } from 'src/app/core/models/permissions/user-permissions';
import { SystemSettings } from 'src/app/core/models/system-settings';
import { CountriesService } from 'src/app/core/services/backend-services/countries.service';
import { RolesPermissionsService } from 'src/app/core/services/backend-services/permissions/roles-permissions.service';

import { SystemSettingsService } from 'src/app/core/services/backend-services/system-settings.service';
import { DateConverterService } from 'src/app/core/services/local-services/date-services/date-converter.service';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { CountryActions } from 'src/app/core/stores/actions/country.actions';
import { MessageModalComponent } from 'src/app/shared/message-modal/message-modal.component';
import { QuickModalService } from 'src/app/shared/services/quick-modal.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Countries } from 'src/app/core/models/countries';

import { OpportunityImages } from 'src/app/core/models/opportunity-images';
import { HttpEventType } from '@angular/common/http';
import { UploadFilesApiService } from 'src/app/shared/services/upload-files-api.service';
import { AppConfigService } from 'src/app/core/services/local-services/app-config.service';
import { OpportunityImagesService } from 'src/app/core/services/backend-services/opporunity-images.service';
const PAGEID = 37;
@Component({
  selector: 'app-opporunity-images',
  templateUrl: './opporunity-images.component.html',
  styleUrls: ['./opporunity-images.component.scss'],
})
export class OpportunityImagesComponent
  implements OnInit, OnDestroy, AfterViewInit {
  //#region Main Declarations
  delegationTypes: ICustomEnum[] = [];
  changeCountriesFlag: number = 0;
  countries: CountriesVM[] = [];
  opportunityImagesForm!: FormGroup;
  lang: string = '';
  //sub: any;
  url: any;
  id: any = 0;
 
  errorMessage = '';
  errorClass = '';
  submited: boolean = false;
  rolePermission!: RolesPermissionsVm;
  userPermissions!: UserPermission; 
  updateItemIndex: BehaviorSubject<number> = new BehaviorSubject<number>(-1); 
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
    private opportunityImageService: OpportunityImagesService,
    private sysyemSettingsServices: SystemSettingsService,
    private uploadFileService: UploadFilesApiService,
  ) {
    this.createOpportunityImagesForm();    
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
      
    }).catch(err=>{
      this.spinner.hide();
    });
    

    
    this.listenToOpportunityImagesListData();
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
    this.opportunityImagesForm.reset();
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
  createOpportunityImagesForm() {
    this.opportunityImagesForm = this.fb.group({
      id: '',
      opportunityId: 0,
      nameAr: '',
      nameEn: '',
      imagePath:'',
      isActive: '',
      descriptions:''
    });
  
  }
  currentUserId!: number;
  
  
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
  addOpportunityImage() {
    
    if(!this.imgPath){
      this.showResponseMessage(false, AlertTypes.error,this.translate.transform("messages.image-required"));
      return;
    }
    const opportunitImage = this.opportunityImagesForm.value;

    // Check if the name and identity are empty
    // if (!opportunitImage.nameAr || !opportunitImage.nameEn || !opportunitImage.identityNo) {
    //   // Display error message using MatSnackBar
    //   this.showSnackBarMessage("validation-messages.invalid-data");
    //   this.opportunityImagesForm.markAllAsTouched();
    //   return; // Exit the function if the data is empty
    // }

    // Check for duplicate records
    // const isDuplicate = this.responsiblePersons.some(
    //   (person: ResponsiblePersons) => {
    //     // Compare the properties that determine uniqueness
    //     return (
    //       person.nameAr === responsiblePerson.nameAr &&
    //       person.nameEn === responsiblePerson.nameEn &&
    //       person.identityNo === responsiblePerson.identityNo
    //     );
    //   }
    // );

    // if (isDuplicate) {
    //   // Display error message using MatSnackBar
    //   this.showSnackBarMessage("messages.record-exsiting");
    // } else {

      // Add the responsible person to the BehaviorSubject
       
      opportunitImage.id = 0;
      opportunitImage.imagePath = this.imgPath+"";
      this.opportunityImages.push({...opportunitImage});

      this.sharedServices.setOpportunityImagesListData(this.opportunityImages);
      this.imgPath = "";
      this.setImageSrc("");
      this.progress = 0;
      // Reset the form and show success message
      //this.opportunityImagesForm.reset();
      this.showSnackBarMessage("messages.add-list-success");
    // }
  }
  editOpportunintyImage(opportunitImage: OpportunityImages) {


   if(!this.imgPath){
    this.showResponseMessage(false, AlertTypes.error,this.translate.transform("messages.image-required"));
    return;
   }

    // Check for duplicate records
    let itemIndex = this.updateItemIndex.getValue();
    // const isDuplicate = this.responsiblePersons.some((person: ResponsiblePersons) => {

    if (itemIndex !== -1) {
      // Update the responsible person in the list
      opportunitImage.imagePath = this.imgPath;
      this.opportunityImages[itemIndex] = {...opportunitImage};
      this.sharedServices.setOpportunityImagesListData(this.opportunityImages);
      //this.responsiblePersonsSubjectList.next( this.responsiblePersons);
      //this.sharedServices.setResponsibleData(responsiblePerson);

      // Show success message
      this.showSnackBarMessage("messages.update-success");
      //this.updateItemIndex.next(-1); //resset varialbe
    }

  }
  updateMode: boolean = false;
  getEditItem(opportunitImage: OpportunityImages, event:Event) {
    event.preventDefault();
    this.updateMode = true;
    this.imgPath = opportunitImage.imagePath;
    let itemIndex = this.opportunityImages.findIndex((opp: OpportunityImages) => opp === opportunitImage);
    this.updateItemIndex.next(itemIndex)
    this.opportunityImagesForm.reset();
    this.setImageSrc(AppConfigService.appCongif.resourcesUrl+"/"+ opportunitImage.imagePath);
    this.opportunityImagesForm.patchValue({ ...opportunitImage })
  }
  // checkDublicate(responsiblePerson:ResponsiblePersons) {
  //   // let sub = this.sharedServices.getResponsibleData().subscribe({
  //   //   next: (responsiblePerson: ResponsiblePersons) => {

        
  //   //   },
  //   // });
  //   // this.subsList.push(sub);

  //   if (ObjectIsNotNullOrEmpty(responsiblePerson)) {
  //     this.opportunityImagesForm.patchValue({ ...responsiblePerson });
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
  listenToOpportunityImagesListData() {
    let sub = this.sharedServices.getOpportunityImagesListData().subscribe({
      next: (images: OpportunityImages[]) => {
        
        if (images.length > 0) {
          this.opportunityImages = [];
          this.opportunityImages.push(...images);
        }
      },
    });
    this.subsList.push(sub);
  }
  // Remove a responsible person from the array.
  deleteOpportunityImage(index:any,  event: Event) {
    event.preventDefault();
    let opp  = this.opportunityImages[index];
    if(opp){
      if(!opp.id){
        this.deleteFromList(index);
      }
      else
      {
        this.showConfirmDeleteMessage(opp.id);
       
      }
    }
    
  }

  

  deleteFromList(index:any)
  {
    this.opportunityImages.splice(index, 1);
    this.sharedServices.setOpportunityImagesListData(this.opportunityImages);
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
  //     this.opportunityImagesForm.setValue({
  //       id: country.id,
  //       countryNameAr: country.countryNameAr,
  //       countryNameEn: country.countryNameEn,
  //     });
  //   }

  // }




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
    return this.opportunityImagesForm.controls;
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
    if (this.opportunityImagesForm.valid) {
      this.sharedServices.changeButtonStatus({
        button: 'Save',
        disabled: true,
      });

      return new Promise<void>((resolve, reject) => {
        let sub = this.countriesService.addWithUrl(
          'Insert',
          this.opportunityImagesForm.value
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
      return this.opportunityImagesForm.markAllAsTouched();
    }
  }
  onUpdate() {
    if (this.opportunityImagesForm.valid) {
      this.opportunityImagesForm.value.id = this.id;
      return new Promise<void>((resolve, reject) => {
        let sub = this.countriesService.updateWithUrl(
          'Update',
          this.opportunityImagesForm.value
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
      return this.opportunityImagesForm.markAllAsTouched();
    }
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
  opportunityImages: OpportunityImages[] = [];

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
          
          let deletedItem = this.opportunityImages.find(
            (x) => x.id == id
          ) as OpportunityImages;
          let deletedOwnerIndex = this.opportunityImages.indexOf(deletedItem);
          
          this.spinner.show();
          let sub = this.opportunityImageService
            .deleteWithUrl('delete?id=' + id)
            .subscribe(
              {
                next:(resonse) => {
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
                }, error:err=>{
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
                      
                }
              });
            this.subsList.push(sub);
          
        }
      },
      (err) => {
        this.spinner.hide();
      }
    );
  }
  getImageSrc(image:OpportunityImages){
    return AppConfigService.appCongif.resourcesUrl+"/"+ image.imagePath ;
  }


  readImage(input) {    
    if (input.files && input.files.length > 0) {
      let fileReader = new FileReader();
      fileReader.onload = (e:any) => {
        // var img = document.getElementById("viewer");
        // img.setAttribute("src", e.target.result.toString());
        this.setImageSrc(e.target.result.toString());
      }

      //Fire Read Event
      fileReader.readAsDataURL(input.files[0]);
    }

  }

  setImageSrc(src) {
    var img:any = document.getElementById("viewer");
    img.setAttribute("src", src);
  }


  
  message:string = "";
  progress:number = 0;
  imgPath:string = "";
  uploadFiles(files, e) {
     
    e.preventDefault();
    if (files.length === 0) {
      return;
    }

    let fileToUpload = <File>files[0];
    const formData: FormData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    let sub = this.uploadFileService.uploadFileMethod(formData).subscribe(
     {
      next: (events:any) => {
        if (events.type == HttpEventType.UploadProgress) {
          this.progress = Math.round(100 * events.loaded / events.total);
          console.log(this.progress);
        }
        else if (events.type == HttpEventType.Response) {
          this.message = "Upload Success";
          
          this.imgPath = events.body['dbPath'];
          console.log(this.imgPath);
          this.showResponseMessage(true,AlertTypes.success,"" );
  
          //this.onUploadFinshed.emit(events.body);
        }
  
      }
     });
    this.subsList.push(sub);

  }
}
