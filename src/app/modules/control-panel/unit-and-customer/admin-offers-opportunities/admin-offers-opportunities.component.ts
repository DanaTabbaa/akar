import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
 AlertTypes,
  ToolbarActions,
} from 'src/app/core/constants/enumrators/enums';

import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { ResponseResult } from 'src/app/core/models/ResponseResult';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { SharedService } from 'src/app/shared/services/shared.service';
import { TranslatePipe } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { DateModel } from 'src/app/core/view-models/date-model';
import { DateConverterService } from 'src/app/core/services/local-services/date-services/date-converter.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { getParmasFromActiveUrl, navigateUrl } from 'src/app/core/helpers/helper';
import { QuickModalService } from 'src/app/shared/services/quick-modal.service';
import { ManagerService } from 'src/app/core/services/backend-services/manager.service';
import { ConfirmMessage } from 'src/app/core/interfaces/confirm-message';
import { MessageModalComponent } from 'src/app/shared/message-modal/message-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OpportunitiesOffersService } from 'src/app/core/services/backend-services/opportunities-offers.service';
import { OpportunitiesOffers } from 'src/app/core/models/opportunities-offers';
import { Opportunity } from 'src/app/core/models/opportunity';
const PAGEID = 1014;


@Component({
  selector: 'app-admin-offers-opportunities',
  templateUrl: './admin-offers-opportunities.component.html',
  styleUrls: ['./admin-offers-opportunities.component.scss']
})
export class AdminOffersOpportunitiesComponent implements OnInit, OnDestroy, AfterViewInit {

  id: any;
  constructor(
    
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private alertsService: NotificationsAlertsService,
    private sharedServices: SharedService,    
    private translate: TranslatePipe,
    private dateService: DateConverterService,
    private spinner: NgxSpinnerService,
    private managerService: ManagerService,
    private modalService: NgbModal,    
    private opportunitiesOfferService:OpportunitiesOffersService
  ) {
    this.createForm();
  }
  
  opportunities:Opportunity[]=[];
  opportunityOfferForm!: FormGroup;

  lang: any = '';
 
 
  addUrl: string = '/control-panel/definitions/add-opportunities-offers';
  listUrl: string = '/control-panel/definitions/opportunities-offers';
  updateUrl: string = '/control-panel/definitions/update-opportunities-offers/';
  toolbarPathData: ToolbarPath = {
    pageId: PAGEID,
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList: "component-names.list-opportunities-offers",
    componentAdd: "component-names.add-opportunities-offers",
  };
  //#endregion

  //#region ngOnInit
  ngOnInit(): void {


    localStorage.setItem("PageId", PAGEID.toString());
    this.loadData();
    
  }

  public ngAfterViewInit(): void {
    //this.loadMap();
  }

  createForm() {
    this.opportunityOfferForm = this.fb.group({
      id: 0,
      opportunityId: '',
      expireDate: '',
      status: ''
    });
    this.setInitialDates();

  }

  setInitialDates() {
    
    this.expireDate = this.dateService.getCurrentDate();
  }
  get f(): { [key: string]: AbstractControl } {
    return this.opportunityOfferForm.controls;
  }
  //#endregion
  //#region ngOnDestory
  ngOnDestroy() {
    this.managerService.destroy();
    this.subsList.forEach((s) => {
      if (s) {
        s.unsubscribe();
      }
    });

    localStorage.removeItem("PageId");
    localStorage.removeItem("RecordId");
  }
  //#endregion

  //#region Basic Data
  currnetUrl;

  loadData() {

    //this.listenToLocationsDetails();
    this.currnetUrl = this.router.url;
    this.lang = localStorage.getItem('language')!;
    this.spinner.show();
    Promise.all([
      this.getLanguage(),
      this.managerService.loadPagePermissions(PAGEID),
      this.managerService.loadOpportunities(),
      

    ]).then(a => {
     
      this.opportunities = this.managerService.getOpportunities();
      this.getRouteData();
      this.changePath();
      this.listenToClickedButton();
    }).catch((err) => {
      this.spinner.hide();
    });
  }

  getRouteData() {
    let sub = this.route.params.subscribe((params) => {
      if (params["id"]) {
        this.id = params["id"];
        if (this.id > 0) {
          this.getOpportunityById(params["id"]).then(a => {
            this.spinner.hide();
            this.sharedServices.changeButton({ action: 'Update', submitMode: false } as ToolbarData);
            localStorage.setItem("RecordId", params["id"]);
          }).catch(err => {
            this.spinner.hide();
          });
        } else {
          this.sharedServices.changeButton({ action: 'New' } as ToolbarData);
          this.spinner.hide();
        }

      }
      else {
         
        this.sharedServices.changeButton({ action: 'New' } as ToolbarData);
        this.spinner.hide();
      }

    });
    this.subsList.push(sub);
  }


  //#endregion
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
  // getPropertyTypes() {
  //   if (this.lang == 'en') {
  //     this.propertyType = convertEnumToArray(propertyTypeEnum);
  //   }
  //   else {
  //     this.propertyType = convertEnumToArray(propertyTypeArEnum);

  //   }
  // }
  // getBuildingTypes() {
  //   if (this.lang == 'en') {
  //     this.buildingTypes = convertEnumToArray(buildingTypeEnum);
  //   }
  //   else {
  //     this.buildingTypes = convertEnumToArray(buildingTypeArEnum);

  //   }
  // }


  //#endregion
  //#region Crud Opertions

  submited: boolean = false;
  errorMessage = '';
  errorClass = '';
  setDate() {

    this.opportunityOfferForm.controls["expireDate"].setValue(this.dateService.getDateForInsertISO_Format(this.expireDate));
    

  }

  onSubmit() {
    this.submited = true;
    


    if (this.opportunityOfferForm.valid) {
       
      this.opportunityOfferForm.value.id = 0;
      this.setDate();
      this.spinner.show();
      this.confirmSubmit().then(a => {
        this.spinner.hide();
      }).catch(err => {
        this.spinner.hide();
      });

    } else {
      this.errorMessage = this.translate.transform("validation-messages.invalid-data");
      this.errorClass = 'errorMessage';
      this.alertsService.showError(this.errorMessage, this.translate.transform("message-title.wrong"));
      return this.opportunityOfferForm.markAllAsTouched();
    }
  }

  confirmSubmit() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.opportunitiesOfferService
        .addWithResponse<OpportunitiesOffers>('AddWithCheck?uniques=OpportunityId',
          this.opportunityOfferForm.value)
        .subscribe({
          next: (result: ResponseResult<OpportunitiesOffers>) => {
            resolve();
            if (result.success && !result.isFound) {
              this.showResponseMessage(
                result.success,
                AlertTypes.success,
                this.translate.transform("messages.add-success")
              );
              navigateUrl(this.listUrl, this.router);
            } else if (result.isFound) {
              this.showResponseMessage(
                result.success,
                AlertTypes.warning,
                this.translate.transform("messages.record-exsiting")
              );
            } else {
              this.showResponseMessage(
                result.success,
                AlertTypes.error,
                this.translate.transform("messages.error")
              );
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


 

  onUpdate() {
    

    if (this.opportunityOfferForm.value != null) {
      this.opportunityOfferForm.value.id = this.id;
      this.setDate();
      
   

      this.spinner.show();
      this.confirmUpdate().then(a => {
        this.spinner.hide();
      }).catch(err => {
        this.spinner.hide();
      });

    } else {
      this.errorMessage = this.translate.transform("validation-messages.invalid-data");
      this.errorClass = 'errorMessage';
      this.alertsService.showError(this.errorMessage, this.translate.transform("message-title.wrong"));
      return this.opportunityOfferForm.markAllAsTouched();
    }
  }

  confirmUpdate() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.opportunitiesOfferService.updateWithUrl("UpdateWithCheck?uniques=OpportunityId",
       this.opportunityOfferForm.value).subscribe({
        next: (result: ResponseResult<OpportunitiesOffers>) => {
          if (result.isFound) {
            this.showResponseMessage(
              result.success,
              AlertTypes.warning,
              this.translate.transform("messages.record-exsiting")
            );
          }
          else if (result.success) {
            this.showResponseMessage(
              result.success,
              AlertTypes.success,
              this.translate.transform("messages.update-success")
            );
            navigateUrl(this.listUrl, this.router);
          }
          else {
            this.showResponseMessage(
              result.success,
              AlertTypes.error,
              result.message
            );
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

  getOpportunityById(id: any) {

    return new Promise<void>((resolve, reject) => {
      let sub = this.opportunitiesOfferService.getWithResponse<OpportunitiesOffers>("GetById?id=" + id).subscribe({
        next: (res: ResponseResult<OpportunitiesOffers>) => {
          if (res.success && res.data) {
            this.opportunityOfferForm.patchValue({
              ...res.data
            });
            this.expireDate = this.dateService.getDateForCalender(res.data.expireDate);
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
  //#endregion
  //#region Helper functions

  getParamsFromUrl() {
    let params = getParmasFromActiveUrl(this.route);
    let id = params?.get('id');
    if (id != null) {
      this.toolbarPathData.componentAdd = 'Update Opprtunity Offer';
      this.sharedServices.changeToolbarPath(this.toolbarPathData);
      this.getOpportunityById(id);
      this.id = id;
    }
  }

  showResponseMessage(responseStatus, alertType, message) {
    if (responseStatus == true && AlertTypes.success == alertType) {
      this.alertsService.showSuccess(message, this.translate.transform("messageTitle.done"));
    } else if (responseStatus == true && AlertTypes.warning) {
      this.alertsService.showWarning(message, this.translate.transform("messageTitle.alert"));
    } else if (responseStatus == true && AlertTypes.info) {
      this.alertsService.showInfo(message, this.translate.transform("messageTitle.info"));
    } else if (responseStatus == false && AlertTypes.error) {
      this.alertsService.showError(message, this.translate.transform("messageTitle.error"));
    }
  }
  confirmMessage!: ConfirmMessage;
  showConfirmMessage(confirmMessage: ConfirmMessage) {
    const modalRef = this.modalService.open(MessageModalComponent);
    modalRef.componentInstance.message = confirmMessage.message;
    modalRef.componentInstance.title = confirmMessage.title;
    modalRef.componentInstance.isYesNo = confirmMessage.isYesNo;
    modalRef.componentInstance.btnConfirmTxt = confirmMessage.btnConfirmTxt;
    modalRef.componentInstance.btnClass = confirmMessage.btnClass;
    return modalRef.result;
  }
  //#endregion

  //#region Toolbar Service
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
            this.onSubmit();
          } else if (currentBtn.action == ToolbarActions.New) {
            this.toolbarPathData.componentAdd = "component-names.add-opportunity";
            this.sharedServices.changeToolbarPath(this.toolbarPathData);
            //this.opportunityOfferForm.reset();
            this.router.navigate([this.addUrl]);
          } else if (currentBtn.action == ToolbarActions.Update && currentBtn.submitMode) {
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

  expireDate!: DateModel;
  getExpireDate(selectedDate: DateModel) {
    this.expireDate = selectedDate;
  }
  createDate!: DateModel;
  getCreateDate(selectedDate: DateModel) {
    this.createDate = selectedDate;
  }
 



  onDateChanged(e: DateModel, id: any) {
    
  }

}
