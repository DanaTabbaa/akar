import { Component, OnInit, OnDestroy, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { MessageModalComponent } from 'src/app/shared/message-modal/message-modal.component';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Subscription } from 'rxjs'
import { AlertTypes, ToolbarActions } from 'src/app/core/constants/enumrators/enums';
import { ITabulatorActionsSelected } from 'src/app/core/interfaces/ITabulator-action-selected';
import { SettingMenuShowOptions } from 'src/app/core/view-models/setting-menu-show-options';
import { ProductsCategoriesService } from 'src/app/core/services/backend-services/products-categories.service';
import { ProductCategory } from 'src/app/core/models/Product-category';
import { TranslatePipe } from '@ngx-translate/core';
import { RolesPermissionsService } from 'src/app/core/services/backend-services/permissions/roles-permissions.service';
import { RolesPermissionsVm } from 'src/app/core/models/ViewModel/permissions/roles-permissions-vm';
import { UserPermission } from 'src/app/core/models/permissions/user-permissions';
import { Store } from '@ngrx/store';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProductsCategoriesActions } from 'src/app/core/stores/actions/productscategories.actions';
const PAGEID = 20; // from pages table in database seeding table
@Component({
  selector: 'app-products-categories-list',
  templateUrl: './products-categories-list.component.html',
  styleUrls: ['./products-categories-list.component.scss']
})
export class ProductsCategoriesListComponent implements OnInit, OnDestroy,OnChanges {
  @Input() changeProductsCategoriesFlag:number=0;
  productsCategories: ProductCategory[] = [];
  _search: any;
  addUrl: string = '/control-panel/maintenance/add-product-category';
  updateUrl: string = '/control-panel/maintenance/update-product-category/';
  listUrl: string = '/control-panel/maintenance/products-categories-list';
  toolbarPathData: ToolbarPath = {
    pageId:PAGEID,
    listPath: this.listUrl,
    addPath: '',
    updatePath: this.updateUrl,
    componentList: "menu.products-categories",
    componentAdd: '',
  };
  productCategorySearchForm!: FormGroup;
  constructor(private ProductsCategoriesService: ProductsCategoriesService,
    private modalService: NgbModal,
    private alertsService: NotificationsAlertsService,
    private rolesPerimssionsService: RolesPermissionsService,
    private translate: TranslatePipe,
    private sharedServices: SharedService,
    private store: Store<any>,
    private spinner: NgxSpinnerService,
    private router: Router, private fb: FormBuilder) {
    this.productCategorySearchForm = this.fb.group({
      _search: ''
    }
    )

  }

  //#region ngOnDestory
  ngOnDestroy() {
    this.subsList.forEach((s) => {
      if (s) {
        s.unsubscribe();
      }
    });
  }
  //#endregion
    ngOnInit(): void {
    localStorage.setItem("PageId",PAGEID.toString());
    this.getPagePermissions(PAGEID)
    this.listenToClickedButton();
   // this.sharedServices.changeButton({ action: 'List' } as ToolbarData);
    this.sharedServices.changeToolbarPath(this.toolbarPathData);
    this.defineGridColumn();
    this.getProductsCategories();

  }
  ngOnChanges(changes: SimpleChanges): void {
    if(this.changeProductsCategoriesFlag){
      this.getProductsCategories();
    }
  }
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

  getProductsCategories() {
    this.spinner.show();
    return new Promise<void>((resolve, reject) => {
      let sub = this.ProductsCategoriesService.getAll("GetAll").subscribe({
        next: (res: any) => {
          this.productsCategories = res.data.map((res: ProductCategory[]) => {
            return res
          });
          resolve();

        },
        error: (err: any) => {
          reject(err);
        },
        complete: () => {
          this.spinner.hide();

        },
      });
      this.subsList.push(sub);

    });
  }
  delete(id: any) {
    if (this.userPermissions.isDelete) {
      this.showConfirmDeleteMessage(id);
    }
    else {
      this.showResponseMessage(true, AlertTypes.warning, this.translate.transform("permissions.permission-denied"))

    }

  }
  isListEmpty
  //#region Helper Functions
  showConfirmDeleteMessage(id: number) {
    const modalRef = this.modalService.open(MessageModalComponent);
    modalRef.componentInstance.message = this.translate.transform('messages.confirm-delete');
    modalRef.componentInstance.title = this.translate.transform('buttons.delete');
    modalRef.componentInstance.isYesNo = true;
    modalRef.result.then((rs) => {
      if (rs == 'Confirm') {



        this.ProductsCategoriesService.deleteWithUrl("Delete?id="+id).subscribe((resonse) => {

          let deletedItem = this.productsCategories.find(x => x.id == id) as ProductCategory ;
          let deletedVendorIndex =  this.productsCategories.indexOf(deletedItem);
           let ProductsCategorieList= this.productsCategories.splice(deletedVendorIndex,1);
          this.spinner.show();
          this.getProductsCategories();
          if (resonse.success == true) {
            this.store.dispatch(ProductsCategoriesActions.actions.delete({
              data: JSON.parse(JSON.stringify({ ...deletedItem }))
            }));
            this.showResponseMessage(
              resonse.success,
              AlertTypes.success,
           this.translate.transform("messages.delete-success")
            );
            if(this.productsCategories.length==0)
            {
              this.isListEmpty=true
            }
          } else if (resonse.success == false) {
            this.showResponseMessage(
              resonse.success,
              AlertTypes.error,
              this.translate.transform("messages.delete-faild")
            );
          }
        });
        setTimeout(() => {
          this.spinner.hide();
        }, 500);
      }
    });
  }

  //navigatetoupdate
  edit(id: string) {
    this.sharedServices.changeButton({ action: 'Update' } as ToolbarData);
    this.router.navigate(['/control-panel/maintenance/update-product-category', id]);
  }
  navigate(urlroute: string) {
    this.router.navigate([urlroute]);
  }
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
  //#endregion
  //#region Toolbar Service
  currentBtn!: string;
  subsList: Subscription[] = [];
  listenToClickedButton() {

    let sub = this.sharedServices.getClickedbutton().subscribe({
      next: (currentBtn: ToolbarData) => {
        currentBtn;
        if (currentBtn != null) {
          if (currentBtn.action == ToolbarActions.List) {
            // this.router.navigate(['/control-panel/definitions/buildings']);
          } else if (currentBtn.action == ToolbarActions.New) {
            this.router.navigate([this.addUrl]);
          }
        }
      },
    });
    this.subsList.push(sub);
  }
  //#endregion

  //#region Tabulator

  panelId: number = 1;
  sortByCols: any[] = [];
  searchFilters: any;
  groupByCols: string[] = [];
  lang: string = '';
  columnNames: any[] = [];
  defineGridColumn() {
    this.sharedServices.getLanguage().subscribe((res) => {

      this.lang = res;
      this.columnNames = [
        {
          title: this.lang == 'ar' ? 'رقم' : 'Id',
          field: 'id',
        },
        {
          title: this.lang == 'ar' ? 'أسم المجموعة باللغة العربية' : ' Category Name In Arabic',
          field: 'categoryNameAr',
        },

        {
          title: this.lang == 'ar' ? 'أسم المجموعة باللغة الانجليزية' : ' Category Name In English',
          field: 'categoryNameEn',
        },
        this.lang == "ar" ? {
          title: "حذف",
          field: "", formatter: this.deleteFormatIcon, cellClick: (e, cell) => {
            this.delete(cell.getRow().getData().id);
          },
        } :
          {
            title: "Delete",
            field: "", formatter: this.deleteFormatIcon, cellClick: (e, cell) => {
              this.delete(cell.getRow().getData().id);
            },
          }
        ,
        this.lang == "ar" ? {
          title: "تعديل",
          field: "", formatter: this.editFormatIcon, cellClick: (e, cell) => {
            this.edit(cell.getRow().getData().id);
          }
        }
          :
          {
            title: "Edit",
            field: "", formatter: this.editFormatIcon, cellClick: (e, cell) => {
              this.edit(cell.getRow().getData().id);
            }
          },
      ];
    })
  }
  editFormatIcon() { //plain text value
    return "<i class=' fa fa-edit'></i>";
  };
  deleteFormatIcon() { //plain text value
    return "<i class=' fa fa-trash'></i>";
  };
  CheckBoxFormatIcon() { //plain text value
    return "<input id='yourID' type='checkbox' />";
  };


  menuOptions: SettingMenuShowOptions = {
    showDelete: true,
    showEdit: true,
  };

  direction: string = 'ltr';

  onSearchTextChange(searchTxt: string) {
    this.searchFilters = [
      [
        { field: 'categoryNameAr', type: 'like', value: searchTxt },
        { field: 'categoryNameEn', type: 'like', value: searchTxt },
        ,
      ],
    ];
  }


  openAddProductCategory() { }

  onMenuActionSelected(event: ITabulatorActionsSelected) {

    if (event != null) {
      if (event.actionName == 'Edit') {
        this.edit(event.item.id);
        this.sharedServices.changeButton({ action: 'Update', componentName: "List" } as ToolbarData);
        this.sharedServices.changeToolbarPath(this.toolbarPathData);
      } else if (event.actionName == 'Delete') {
        this.delete(event.item.id);
      }
    }
  }

  //#endregion

}

