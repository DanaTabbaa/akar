import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ICustomEnum } from 'src/app/core/interfaces/ICustom-enum';
import { AlertTypes, AttributeDataTypeEnum, convertEnumToArray, pursposeTypeArEnum, pursposeTypeEnum, ToolbarActions, } from 'src/app/core/constants/enumrators/enums';
import { Countries } from 'src/app/core/models/countries';
import { Cities } from 'src/app/core/models/cities';
import { Region } from 'src/app/core/models/regions';
import { Building } from 'src/app/core/models/buildings';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { getParmasFromActiveUrl, navigateUrl, } from 'src/app/core/helpers/helper';
import { ResponseResult } from 'src/app/core/models/ResponseResult';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageModalComponent } from 'src/app/shared/message-modal/message-modal.component';
import { ConfirmMessage } from 'src/app/core/interfaces/confirm-message';
import { TranslatePipe } from '@ngx-translate/core';
import { DateModel } from 'src/app/core/view-models/date-model';
import { NgxSpinnerService } from 'ngx-spinner';
import { DateConverterService } from 'src/app/core/services/local-services/date-services/date-converter.service';
import { NAME_REQUIRED_VALIDATORS } from 'src/app/core/constants/input-validators';
import { District } from 'src/app/core/models/district';
import { ManagerService } from 'src/app/core/services/backend-services/manager.service';
import { OpportunityService } from 'src/app/core/services/backend-services/opportunity.setvice';
import { Opportunity } from 'src/app/core/models/opportunity';
import { Attributes } from 'src/app/core/models/attributes';
import { AttributeValues } from 'src/app/core/models/attribute-value';
import { QuickModalService } from 'src/app/shared/services/quick-modal.service';
import { OpportunityImages } from 'src/app/core/models/opportunity-images';
import { OpportunityImagesComponent } from '../opporunity-images/opporunity-images.component';
import { OpportunityType } from 'src/app/core/models/opportunity-type';
import { OpportunityTypeService } from 'src/app/core/services/backend-services/opportunity-type.service';

const PAGEID = 1016; // from pages table in database seeding table
@Component({
  selector: 'app-opportunities-types',
  templateUrl: './opportunities-types.component.html',
  styleUrls: ['./opportunities-types.component.scss']
})
export class OpportunitiesTypesComponent implements OnInit, OnDestroy, AfterViewInit {

  id: any;  
  
  constructor(
    private opportunityTypeService: OpportunityTypeService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private alertsService: NotificationsAlertsService,
    private sharedServices: SharedService,
    private modalService: NgbModal,
    private translate: TranslatePipe,
    private dateService: DateConverterService,
    private spinner: NgxSpinnerService,
    private managerService: ManagerService,


    private quickModalServices: QuickModalService,
  ) {
    this.createForm();
  }
  
  opportunityTypeForm!: FormGroup;
  
  lang: any = '';
  
  addUrl: string = '/control-panel/definitions/add-opportunities-types';
  updateUrl: string = '/control-panel/definitions/update-opportunities-types/';
  listUrl: string = '/control-panel/definitions/opportunities-types-list';

   toolbarPathData: ToolbarPath = {
    pageId: PAGEID,
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList: "component-names.list-opportunities-types",
    componentAdd: "component-names.add-opportunity-types",

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
  //#endregion
  //#region Form Group
  createForm() {
    this.opportunityTypeForm = this.fb.group({
      id: 0,
      nameAr: NAME_REQUIRED_VALIDATORS,
      nameEn: NAME_REQUIRED_VALIDATORS,
     
    });
    

  }

  get f(): { [key: string]: AbstractControl } {
    return this.opportunityTypeForm.controls;
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
    ]).then(a => {
      

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
          this.getOpportunityTypeById(params["id"]).then(a => {
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
 

  submited: boolean = false;
  errorMessage = '';
  errorClass = '';


  onSubmit() {
    this.submited = true;
   


    if (this.opportunityTypeForm.valid) {
      this.opportunityTypeForm.value.id = 0;      
      
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
      return this.opportunityTypeForm.markAllAsTouched();
    }
  }

  confirmSubmit() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.opportunityTypeService
        .addWithResponse<Opportunity>('AddWithCheck?uniques=NameAr&uniques=NameEn',
          this.opportunityTypeForm.value)
        .subscribe({
          next: (result: ResponseResult<Opportunity>) => {
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
    if (!this.opportunityTypeForm.value.purpose) {
      this.alertsService.showError(this.translate.transform("validation-messages.purpose-required"), this.translate.transform("message-title.wrong"));
      return;
    }

    if (this.opportunityTypeForm.value != null) {
      this.opportunityTypeForm.value.id = this.id;
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
      return this.opportunityTypeForm.markAllAsTouched();
    }
  }

  confirmUpdate() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.opportunityTypeService.updateWithUrl("UpdateWithCheck?uniques=NameAr&uniques=NameEn", this.opportunityTypeForm.value)
        .subscribe({
          next: (result: ResponseResult<OpportunityType>) => {
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

  getOpportunityTypeById(id: any) {

    return new Promise<void>((resolve, reject) => {
      let sub = this.opportunityTypeService.getWithResponse<OpportunityType>("GetById?id=" + id).subscribe({
        next: (res: ResponseResult<OpportunityType>) => {

          if (res.success && res.data) {
          


            this.opportunityTypeForm.patchValue({
              ...res.data
            });

           
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
      this.toolbarPathData.componentAdd = 'Update Opprtunity';
      this.sharedServices.changeToolbarPath(this.toolbarPathData);
      this.getOpportunityTypeById(id);
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
            //this.opportunityForm.reset();
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
}

