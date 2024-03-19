import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Subscription } from 'rxjs';
import { navigateUrl } from 'src/app/core/helpers/helper';
import { ProductCategory } from 'src/app/core/models/Product-category';
import { ProductsCategoriesService } from 'src/app/core/services/backend-services/products-categories.service';
import { TranslatePipe } from '@ngx-translate/core';
import { RolesPermissionsService } from 'src/app/core/services/backend-services/permissions/roles-permissions.service';
import { RolesPermissionsVm } from 'src/app/core/models/ViewModel/permissions/roles-permissions-vm';
import { UserPermission } from 'src/app/core/models/permissions/user-permissions';
import { Store } from '@ngrx/store';
import { REQUIRED_VALIDATORS } from 'src/app/core/constants/input-validators';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProductsCategoriesActions } from 'src/app/core/stores/actions/productscategories.actions';
const PAGEID = 20; // from pages table in database seeding table
@Component({
  selector: 'app-products-categories',
  templateUrl: './products-categories.component.html',
  styleUrls: ['./products-categories.component.scss'],
})
export class ProductsCategoriesComponent implements OnInit, OnDestroy {
  changeProductsCategoriesFlag: number = 0;
  //properties
  productCategoryForm!: FormGroup;
  productCategoryObj!: ProductCategory;

  id: any = 0;
  sub: any;
  add!: boolean;
  update!: boolean;

  errorMessage = '';
  errorClass = '';
  submited: boolean = false;
  Response!: ResponseResult<ProductCategory>;
  productsCategoriesList: ProductCategory[] = [];
  lang;
  /////toolbar
  currnetUrl: any;
  addUrl: string = '/control-panel/maintenance/add-product-category';
  updateUrl: string = '/control-panel/maintenance/update-product-category/';
  listUrl: string = '/control-panel/maintenance/products-categories-list';
  toolbarPathData: ToolbarPath = {
    pageId: PAGEID,
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList: 'menu.products-categories',
    componentAdd: 'products-categories.add-product-category',
  };
  //

  //#region ngOnDestory
  ngOnDestroy() {
    this.subsList.forEach((s) => {
      if (s) {
        s.unsubscribe();
      }
    });
    localStorage.removeItem('PageId');
    localStorage.removeItem('RecordId');
  }
  //#endregion
  //constructor
  constructor(
    private ProductsCategoriesService: ProductsCategoriesService,
    private alertsService: NotificationsAlertsService,
    private router: Router,
    private fb: FormBuilder,
    private rolesPerimssionsService: RolesPermissionsService,
    private route: ActivatedRoute,
    private sharedServices: SharedService,
    private translate: TranslatePipe,
    private store: Store<any>,
    private spinner: NgxSpinnerService
  ) {
    this.defineProductCategoryForm();
  }
  //
  getLanguage() {
    this.sharedServices.getLanguage().subscribe((res) => {
      this.lang = res;
    });
  }
  defineProductCategoryForm() {
    this.productCategoryForm = this.fb.group({
      id: 0,
      categoryNameAr: REQUIRED_VALIDATORS,
      categoryNameEn: REQUIRED_VALIDATORS,
      parentId: '',
    });
  }
  //oninit
  ngOnInit(): void {
    localStorage.setItem('PageId', PAGEID.toString());
    this.getLanguage();
    this.getPagePermissions(PAGEID);
    this.add = true;
    this.currnetUrl = this.router.url;
    this.GetProductsCategories();
    this.listenToClickedButton();
    this.changePath();

    this.sub = this.route.params.subscribe((params) => {
      if (params['id'] != null) {
        this.update = true;
        this.add = false;
        this.id = Number(params['id']);
        if (this.id > 0) {
          localStorage.setItem('RecordId', params['id']);
          this.toolbarPathData.componentAdd =
            'products-categories.update-product-category';
          this.getProductCategoryById(this.id);
          this.sharedServices.changeButton({action:'Update'} as ToolbarData);
        }
      }else{
        this.sharedServices.changeButton({action:'SinglePage'} as ToolbarData);
      }
    });
  }
  //
  //methods

  get f(): { [key: string]: AbstractControl } {
    return this.productCategoryForm.controls;
  }

  navigateUrl(urlroute: string) {
    this.router.navigate([urlroute]);
  }

  //#region Permissions
  rolePermission!: RolesPermissionsVm;
  userPermissions!: UserPermission;
  getPagePermissions(pageId) {
    const promise = new Promise<void>((resolve, reject) => {
      this.rolesPerimssionsService
        .getAll('GetPagePermissionById?pageId=' + pageId)
        .subscribe({
          next: (res: any) => {
            this.rolePermission = JSON.parse(JSON.stringify(res.data));
            this.userPermissions = JSON.parse(
              this.rolePermission.permissionJson
            );
            this.sharedServices.setUserPermissions(this.userPermissions);
            resolve();
          },
         error: (err: any) => {
            this.spinner.hide();
            reject(err);
          },
          complete: () => {},
        });
    });
    return promise;
  }
  //#endregion

  //#region Crud Operations
  onSave() {

    if (this.productCategoryForm.valid) {
      this.sharedServices.changeButtonStatus({button:'Save',disabled:true})
      this.spinner.show();
      this.productCategoryForm.value.id = 0;
      this.ProductsCategoriesService.addWithUrl(
        'Insert',
        this.productCategoryForm.value
      ).subscribe((result) => {
        this.Response = { ...result.data };
        if (result != null) {
          if (result.success && !result.isFound) {
            this.store.dispatch(
              ProductsCategoriesActions.actions.insert({
                data: JSON.parse(JSON.stringify({ ...result.data })),
              })
            );
            this.changeProductsCategoriesFlag++
            this.showResponseMessage(
              result.success,
              AlertTypes.success,
              'messages.add-success'
            );



              navigateUrl(this.addUrl, this.router);
              this.spinner.hide();

          } else if (result.isFound) {
            this.spinner.hide();
            this.checkResponseMessages(result.message)
          }
        }
      },err=>{
        this.spinner.hide();
      });
    } else {
      this.sharedServices.changeButtonStatus({button:'Save',disabled:false})
      this.errorMessage = this.translate.transform(
        'validation-messages.invalid-data'
      );
      this.errorClass = 'errorMessage';
      this.alertsService.showError(
        this.errorMessage,
        this.translate.transform('message-title.wrong')
      );
      return this.productCategoryForm.markAllAsTouched();
    }
  }
  onUpdate() {
    this.spinner.show();
    if (this.productCategoryForm.value != null) {
      const promise = new Promise<void>((resolve, reject) => {
        this.ProductsCategoriesService.updateWithUrl(
          'Update',
          this.productCategoryForm.value
        ).subscribe({
          next: (result: any) => {

            this.Response = { ...result.data };
            if (result != null) {
              if (result.success && !result.isFound) {
                this.changeProductsCategoriesFlag++;
                this.store.dispatch(
                  ProductsCategoriesActions.actions.update({
                    data: JSON.parse(JSON.stringify({ ...result.data })),
                  })
                );
                this.defineProductCategoryForm();


                  this.spinner.hide();
                  this.showResponseMessage(
                    result.success,
                    AlertTypes.success,
                    this.translate.transform('messages.update-success')
                  );
                  this.navigateUrl(this.addUrl);

              } else if (result.isFound) {
                this.spinner.hide();
                this.checkResponseMessages(result.message);
              }
            }
          },
          error: (err: any) => {
            this.spinner.hide();
            reject(err);
          },
          complete: () => {},
        });
      });
      return promise;
    } else {
      this.errorMessage = this.translate.transform(
        'validation-messages.invalid-data'
      );
      this.errorClass = 'errorMessage';
      this.alertsService.showError(
        this.errorMessage,
        this.translate.transform('message-title.wrong')
      );
      return this.productCategoryForm.markAllAsTouched();
    }
  }
  //#endregion

  getProductCategoryById(id: any) {
    const promise = new Promise<void>((resolve, reject) => {
      this.ProductsCategoriesService.getById(id).subscribe({
        next: (res: any) => {
          this.productCategoryObj = { ...res.data };
          this.productCategoryForm.setValue({
            id: id,
            categoryNameAr: res.data.categoryNameAr,
            categoryNameEn: res.data.categoryNameEn,
            parentId: res.data.parentId,
          });
        },
        error: (err: any) => {
          reject(err);
        },
        complete: () => {},
      });
    });
    return promise;
  }
  cancel() {
    this.productCategoryForm = this.fb.group({
      id: 0,
      productCategoryNameAr: '',
      productCategoryNameEn: '',
      parentId: '',
    });
  }

  new!: boolean;
  toggleButton() {
    this.add = false;
    this.update = this.new = !this.add;
  }

  //
  GetProductsCategories() {
    const promise = new Promise<void>((resolve, reject) => {
      this.ProductsCategoriesService.getAll('GetAll').subscribe({
        next: (res: any) => {
          this.productsCategoriesList = res.data.map(
            (res: ProductCategory[]) => {
              return res;
            }
          );
          resolve();
        },
        error: (err: any) => {
          reject(err);
        },
        complete: () => {},
      });
    });
    return promise;
  }
  //#region Toolbar Service
  subsList: Subscription[] = [];
  currentBtnResult;
  listenToClickedButton() {
    let sub = this.sharedServices.getClickedbutton().subscribe({
      next: (currentBtn: ToolbarData) => {
        currentBtn;

        if (currentBtn != null) {
          if (currentBtn.action == ToolbarActions.List) {
            this.sharedServices.changeToolbarPath(this.toolbarPathData);
          //  this.router.navigate([this.listUrl]);
          } else if (
            currentBtn.action == ToolbarActions.Save &&
            currentBtn.submitMode
          ) {
            this.onSave();
          } else if (currentBtn.action == ToolbarActions.New) {
            this.router.navigate([this.addUrl]);
            this.toolbarPathData.componentAdd =
              'products-categories.add-product-category';
            this.sharedServices.changeToolbarPath(this.toolbarPathData);
            this.productCategoryForm.reset();
          } else if (
            currentBtn.action == ToolbarActions.Update &&
            currentBtn.submitMode
          ) {
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

  checkResponseMessages(message: string) {
    let responseStatus = true;
    switch (message) {
      case 'NameAr':
        this.showResponseMessage(
          responseStatus,
          AlertTypes.warning,
          'messages.nameAr-exist'
        );
        break;
      case 'NameEn':
        this.showResponseMessage(
          responseStatus,
          AlertTypes.warning,
          'messages.nameEn-exist'
        );
        break;
      case 'Code':
        this.showResponseMessage(
          responseStatus,
          AlertTypes.warning,
          'messages.office-code-exist'
        );
        break;
    }
  }
  //#endregion

  //#region Helper Functions

  showResponseMessage(responseStatus, alertType, message) {
    let translateMessage = this.translate.transform(message);
    if (responseStatus == true && AlertTypes.success == alertType) {
      this.alertsService.showSuccess(
        translateMessage,
        this.translate.transform('messageTitle.done')
      );
    } else if (responseStatus == true && AlertTypes.warning) {
      this.alertsService.showWarning(
        translateMessage,
        this.translate.transform('messageTitle.alert')
      );
    } else if (responseStatus == true && AlertTypes.info) {
      this.alertsService.showInfo(
        translateMessage,
        this.translate.transform('messageTitle.info')
      );
    } else if (responseStatus == false && AlertTypes.error) {
      this.alertsService.showError(
        translateMessage,
        this.translate.transform('messageTitle.error')
      );
    }
  }
  //#endregion
}
