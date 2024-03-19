import {  Component,  OnInit,  OnDestroy,  AfterViewInit} from '@angular/core';
import { Subscription } from 'rxjs';
import { ICustomEnum } from 'src/app/core/interfaces/ICustom-enum';
import {  AlertTypes,  AttributeDataTypeArEnum,  AttributeDataTypeEnum,  convertEnumToArray,  ToolbarActions,} from 'src/app/core/constants/enumrators/enums';
import { ActivatedRoute, Router } from '@angular/router';
import {  AbstractControl,  FormBuilder,  FormGroup} from '@angular/forms';
import {
  getParmasFromActiveUrl,
  navigateUrl,
} from 'src/app/core/helpers/helper';
import { ResponseResult } from 'src/app/core/models/ResponseResult';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageModalComponent } from 'src/app/shared/message-modal/message-modal.component';
import { ConfirmMessage } from 'src/app/core/interfaces/confirm-message';
import { TranslatePipe } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { NAME_REQUIRED_VALIDATORS } from 'src/app/core/constants/input-validators';
import { ManagerService } from 'src/app/core/services/backend-services/manager.service';
import { AttributeService } from 'src/app/core/services/backend-services/attribute.service';
import { Attributes } from 'src/app/core/models/attributes';
import { AttributeIcons } from 'src/app/core/constants/attribute-icons';
import { HttpEventType } from '@angular/common/http';
import { UploadFilesApiService } from 'src/app/shared/services/upload-files-api.service';
import { AppConfigService } from 'src/app/core/services/local-services/app-config.service';
const PAGEID = 1013; // from pages table in database seeding table
@Component({
  selector: 'app-attributes',
  templateUrl: './attributes.component.html',
  styleUrls: ['./attributes.component.scss']
})
export class AttributesComponent implements OnInit, OnDestroy, AfterViewInit {

  id: any;
  constructor(
    private attributeService: AttributeService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private alertsService: NotificationsAlertsService,
    private sharedServices: SharedService,
    private modalService: NgbModal,
    private translate: TranslatePipe,    
    private spinner: NgxSpinnerService,
    private managerService: ManagerService,
    private uploadFileService:UploadFilesApiService
  ) {
    this.createForm();
  }

  attributeForm!: FormGroup;
  lang: any = '';  
  attributeTypes: ICustomEnum[] = [];
  attributeIcons: any = new AttributeIcons();
  //selectedIcon:any;
  addUrl: string = '/control-panel/definitions/add-attribute';
  listUrl: string = '/control-panel/definitions/attributes-list';
  updateUrl: string = '/control-panel/definitions/update-attribute/';
  toolbarPathData: ToolbarPath = {
    pageId: PAGEID,
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList: "component-names.list-attributes",
    componentAdd: "component-names.add-attribute",
  };
  //#endregion

  //#region ngOnInit
  ngOnInit(): void {
    this.getAttributeTypes();
    localStorage.setItem("PageId", PAGEID.toString());
    this.loadData();
  }

  public ngAfterViewInit(): void {
    
  }
  //#endregion
  //#region Form Group
  createForm() {
    this.attributeForm = this.fb.group({
      id: 0,
      nameAr: NAME_REQUIRED_VALIDATORS,
      nameEn: NAME_REQUIRED_VALIDATORS,
      dataType:'',
      selectListValuesAr:'',
      selectListValuesEn:'',
      status:false,
      iconType:'',
      attributeIcon:''
    });
    

  }


  get f(): { [key: string]: AbstractControl } {
    return this.attributeForm.controls;
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
          this.getAttribuesById(params["id"]).then(a => {
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
  getAttributeTypes() {
    if (this.lang == 'en') {
      this.attributeTypes = convertEnumToArray(AttributeDataTypeEnum);
    }
    else {
      this.attributeTypes = convertEnumToArray(AttributeDataTypeArEnum);

    }
  }


  //#endregion
  //#region Crud Opertions

  submited: boolean = false;
  errorMessage = '';
  errorClass = '';


  onSubmit() {
    this.submited = true;
    if (this.attributeForm.valid) {
      if(this.attributeForm.value.iconType == 4 )
      {
        if(!this.imgPath ){
          this.showResponseMessage(false,AlertTypes.error, this.translate.transform("messages.custom-icon-required"));
          return;
        }
      }
      this.attributeForm.value.id = 0;
      this.attributeForm.value.attributeIcon = this.imgPath;
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
      return this.attributeForm.markAllAsTouched();
    }
  }

  confirmSubmit() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.attributeService
        .addWithResponse<Attributes>('AddWithCheck?uniques=NameAr&uniques=NameEn',
          this.attributeForm.value)
        .subscribe({
          next: (result: ResponseResult<Attributes>) => {
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

    if (this.attributeForm.valid) {
      if(this.attributeForm.value.iconType == 4 )
      {
        if(!this.imgPath ){
          this.showResponseMessage(false,AlertTypes.error, this.translate.transform("messages.custom-icon-required"));
          return;
        }
      }
      this.attributeForm.value.id = this.id;  
      this.attributeForm.value.attributeIcon = this.imgPath;    
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
      return this.attributeForm.markAllAsTouched();
    }
  }

  confirmUpdate() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.attributeService.updateWithUrl("UpdateWithCheck?uniques=NameAr&uniques=NameEn", this.attributeForm.value).subscribe({
        next: (result: ResponseResult<Attributes>) => {
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

  getAttribuesById(id: any) {

    return new Promise<void>((resolve, reject) => {
      let sub = this.attributeService.getWithResponse<Attributes>("GetById?id=" + id).subscribe({
        next: (res: ResponseResult<Attributes>) => {

          if (res.success && res.data) {
            console.log(res.data);
            //const result: Building = res.data as Building;
            //this.buildingObj = { ...result };
      

            this.attributeForm.patchValue({
              ...res.data
            });


            if(res.data.iconType == 4){
              this.imgPath = res.data.attributeIcon;
              setTimeout(a=>{
                this.setImageSrc(AppConfigService.appCongif.resourcesUrl+"/"+ this.imgPath);
              },300);

            }
            



           

          

           
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
      this.toolbarPathData.componentAdd = 'Update Building';
      this.sharedServices.changeToolbarPath(this.toolbarPathData);
      this.getAttribuesById(id);
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
            //this.attributeForm.reset();
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

  // onSelectedIconChange(){
  //   console.log(this.selectedIcon)
  // }


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
     
    if(img){
      img.setAttribute("src", src);
    }
    
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

