import { Component, OnInit, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertTypes, convertEnumToArray, productTypeArEnum, productTypeEnum, ToolbarActions } from 'src/app/core/constants/enumrators/enums';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { Subscription } from 'rxjs'
import { ResponseResult } from 'src/app/core/models/ResponseResult';
import { Products } from 'src/app/core/models/products';
import { ProductCategory } from 'src/app/core/models/Product-category';
import { ProductsCategoriesService } from 'src/app/core/services/backend-services/products-categories.service';
import { ICustomEnum } from 'src/app/core/interfaces/ICustom-enum';
import { ProductsService } from 'src/app/core/services/backend-services/products.service';
import { TranslatePipe } from '@ngx-translate/core';
import { RolesPermissionsService } from 'src/app/core/services/backend-services/permissions/roles-permissions.service';
import { RolesPermissionsVm } from 'src/app/core/models/ViewModel/permissions/roles-permissions-vm';
import { UserPermission } from 'src/app/core/models/permissions/user-permissions';
import { Store } from '@ngrx/store';
import { ProductsActions } from 'src/app/core/stores/actions/products.actions';
const PAGEID = 21; // from pages table in database seeding table

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, OnDestroy {
changeProductsFlag:number=0;
  //#region Main Declarations
  productForm!: FormGroup;
  productsCategoriesList: ProductCategory[] = [];
  productTypes: ICustomEnum[] = [];
  sub: any;
  id: any = 0;
  url: any;
  errorMessage = '';
  errorClass = '';
  currnetUrl: any;
  lang: string = '';
  addUrl: string = '/control-panel/maintenance/add-product';
  updateUrl: string = '/control-panel/maintenance/update-product/';
  listUrl: string = '/control-panel/maintenance/products-list';
  toolbarPathData: ToolbarPath = {
    pageId:PAGEID,
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList: "menu.products",
    componentAdd: "products.add-product",
  };

  submited: boolean = false;
  Response!: ResponseResult<Products>;

  //#endregion

  //#region Constructor
  constructor(
    private productsService: ProductsService,
    private productsCategoriesService: ProductsCategoriesService,
    private alertsService: NotificationsAlertsService,
    private sharedServices: SharedService,
    private spinner: NgxSpinnerService,
    private rolesPerimssionsService: RolesPermissionsService,
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private translate: TranslatePipe,
    private store: Store<any>,
  ) {
    this.defineProductForm()
  }



  //#endregion

  //#region ngOnInit
  ngOnInit(): void {
    localStorage.setItem("PageId",PAGEID.toString());
    this.loadData();
    this.sub = this.route.params.subscribe(params => {
      if (params['id'] != null) {
        this.id = +params['id'];
        if (this.id > 0) {
          localStorage.setItem("RecordId",params["id"]);
          this.toolbarPathData.componentAdd = "products.update-product";
          this.getProductById(this.id);
          this.sharedServices.changeButton({action:'Update'} as ToolbarData)
        }
      } else {
        this.sharedServices.changeButton({action:'SinglePage'} as ToolbarData)
      }

    })
  }

  //#endregion

  //#region ngOnDestroy
  ngOnDestroy() {
    this.subsList.forEach((s) => {
      if (s) {
        s.unsubscribe();
      }
    });
    localStorage.removeItem("PageId");
    localStorage.removeItem("RecordId");
  }

  //#endregion

  //#region Authentications

  //#endregion

  //#region Permissions
  rolePermission!: RolesPermissionsVm;
  userPermissions!: UserPermission;
  getPagePermissions(pageId) {
    const promise = new Promise<void>((resolve, reject) => {
      this.rolesPerimssionsService.getAll("GetPagePermissionById?pageId=" + pageId).subscribe({
        next: (res: any) => {
          this.rolePermission = JSON.parse(JSON.stringify(res.data));
          this.userPermissions = JSON.parse(this.rolePermission.permissionJson);
          this.sharedServices.setUserPermissions(this.userPermissions);
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
  //#endregion

  //#region  State Management
  //#endregion

  //#region Basic Data
  ///Geting form dropdown list data
  defineProductForm() {
    this.productForm = this.fb.group({
      id: 0,
      productNameAr: ['', Validators.compose([Validators.required])],
      productNameEn: ['', Validators.compose([Validators.required])],
      productCategoryId: ['', Validators.compose([Validators.required])],
      productType: ['', Validators.compose([Validators.required])],
      sellPrice: ['', Validators.compose([Validators.required])],
      purchasePrice: ['', Validators.compose([Validators.required])],
      isTaxable: false,
      taxRatio: ''


    });

  }

  loadData() {
    this.getPagePermissions(PAGEID)
    this.currnetUrl = this.router.url;
    this.listenToClickedButton();
    this.changePath();
    this.getLanguage();
    this.getProductTypes();
    this.spinner.show();
    Promise.all([
      this.getProductsCategories()
    ]).then(a => {
      this.spinner.hide();
    })

  }
  getProductTypes() {
    if (this.lang == 'en') {
      this.productTypes = convertEnumToArray(productTypeEnum);
    }
    else {
      this.productTypes = convertEnumToArray(productTypeArEnum);

    }
  }
  getLanguage() {
    this.sharedServices.getLanguage().subscribe(res => {
      this.lang = res
    })
  }
  getProductsCategories() {
    const promise = new Promise<void>((resolve, reject) => {
      this.productsCategoriesService.getAll("GetAll").subscribe({
        next: (res: any) => {
          this.productsCategoriesList = res.data.map((res: ProductCategory[]) => {
            return res
          });
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



  //#endregion

  //#region CRUD Operations
  getProductById(id: any) {
    const promise = new Promise<void>((resolve, reject) => {

      this.productsService.getById(id).subscribe({
        next: (res: any) => {


          //(("result data getbyid", res.data);
          this.productForm.setValue({
            id: this.id,
            productNameAr: res.data.productNameAr,
            productNameEn: res.data.productNameEn,
            productCategoryId: res.data.productCategoryId,
            productType: res.data.productType,
            sellPrice: res.data.sellPrice,
            purchasePrice: res.data.purchasePrice,
            isTaxable: res.data.isTaxable == 1 ? true : false,
            taxRatio: res.data.isTaxable == 1 ? res.data.taxRatio : ''


          });

          //(("this.productForm.value set value", this.productForm.value)
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

  onSave() {
    this.spinner.show();
    if (this.productForm.valid) {
      this.sharedServices.changeButtonStatus({button:'Save',disabled:true})
      this.productForm.value.id = this.id;
      if (!this.productForm.value.isTaxable) {
        this.productForm.value.taxRatio = '';
      }
      const promise = new Promise<void>((resolve, reject) => {
        this.productsService.addWithUrl("Insert", this.productForm.value).subscribe({
          next: (result: any) => {


            if(result!=null){

          if(result.success&& !result.isFound){

            this.store.dispatch(ProductsActions.actions.insert({
              data: JSON.parse(JSON.stringify({ ...result.data }))
            }));
          //  this.defineProductForm();
            this.changeProductsFlag++
            this.submited = false;

              this.spinner.hide();
              this.showResponseMessage(result.success, AlertTypes.success, this.translate.transform("messages.add-success"));
              this.navigateUrl(this.addUrl);

          }else if(result.isFound){
            this.spinner.hide();
            this.checkResponseMessages(result.message);
          }
          }
          },
          error: (err: any) => {
            this.spinner.hide();
            reject(err);
          },
          complete: () => {

          },
        });
      });
      return promise
    }
    else {
      this.sharedServices.changeButtonStatus({button:'Save',disabled:false})
      this.errorMessage = this.translate.transform("validation-messages.invalid-data");
      this.errorClass = 'errorMessage';
      this.alertsService.showError(this.errorMessage, this.translate.transform("message-title.wrong"));
      return this.productForm.markAllAsTouched();
    }
  }



  onUpdate() {
    this.spinner.show();
    if (this.productForm.value != null) {
      if (!this.productForm.value.isTaxable) {
        this.productForm.value.taxRatio = '';
      }
      const promise = new Promise<void>((resolve, reject) => {
        this.productsService.updateWithUrl("Update",this.productForm.value).subscribe({
          next: (result: any) => {
            if(result!=null){

           if(result.success&& !result.isFound)
           {

           this.changeProductsFlag++;
            this.store.dispatch(ProductsActions.actions.update({
              data: JSON.parse(JSON.stringify({ ...result.data }))
            }));
           // this.defineProductForm();

            setTimeout(() => {
              this.spinner.hide();
              this.showResponseMessage(result.success, AlertTypes.success,
                this.translate.transform('messages.update-success')

                );
              this.navigateUrl(this.addUrl);
            },500);
          }else if(result.isFound){
            this.spinner.hide();
            this.checkResponseMessages(result.message);
          }
          }
          },
          error: (err: any) => {
            this.spinner.hide();
            reject(err);
          },
          complete: () => {

          },
        });
      });
      return promise
    }
    else {
      this.errorMessage = this.translate.transform("validation-messages.invalid-data");
      this.errorClass = 'errorMessage';
      this.alertsService.showError(this.errorMessage, this.translate.transform("message-title.wrong"));
      return this.productForm.markAllAsTouched();
    }
  }
  //#endregion

  //#region Helper Functions

  showResponseMessage(responseStatus, alertType, message) {
    if (responseStatus == true && AlertTypes.success == alertType) {
      this.alertsService.showSuccess(message, this.translate.transform('messages.done'));
    } else if (responseStatus == true && AlertTypes.warning) {
      this.alertsService.showWarning(message, this.translate.transform('messages.alert'));
    } else if (responseStatus == true && AlertTypes.info) {
      this.alertsService.showInfo(message, this.translate.transform('messages.info'));
    } else if (responseStatus == false && AlertTypes.error) {
      this.alertsService.showError(message, this.translate.transform('messages.error'));
    }
  }

  checkResponseMessages(message: string) {
    let responseStatus = true;
    switch (message) {
      case 'NameAr':
        this.showResponseMessage(
          responseStatus,
          AlertTypes.warning,
          this.translate.transform('messages.nameAr-exist')
        );
        break;
      case 'NameEn':
        this.showResponseMessage(
          responseStatus,
          AlertTypes.warning,
          this.translate.transform('messages.nameEn-exist')
        );
        break;
      case 'Code':
        this.showResponseMessage(
          responseStatus,
          AlertTypes.warning,
          this.translate.transform('messages.office-code-exist')
        );
        break;
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.productForm.controls;
  }


  //#endregion

  //#region Tabulator
  subsList: Subscription[] = [];
  currentBtnResult;
  listenToClickedButton() {
    let sub = this.sharedServices.getClickedbutton().subscribe({
      next: (currentBtn: ToolbarData) => {
        currentBtn;

        if (currentBtn != null) {
          if (currentBtn.action == ToolbarActions.List) {
            this.sharedServices.changeToolbarPath(this.toolbarPathData);
            //this.router.navigate([this.listUrl]);
          } else if (currentBtn.action == ToolbarActions.Save && currentBtn.submitMode) {
            this.onSave();
          } else if (currentBtn.action == ToolbarActions.New) {
            this.toolbarPathData.componentAdd = "products.add-product";
            this.router.navigate([this.addUrl]);
            this.defineProductForm();
            this.sharedServices.changeToolbarPath(this.toolbarPathData);
            this.navigateUrl(this.addUrl);
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
  navigateUrl(urlroute: string) {
    this.router.navigate([urlroute]);
  }
  //#endregion

}

