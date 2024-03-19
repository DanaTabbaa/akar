import { Component, OnInit, OnDestroy, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  AlertTypes,
  ToolbarActions,
} from 'src/app/core/constants/enumrators/enums';
import { ITabulatorActionsSelected } from 'src/app/core/interfaces/ITabulator-action-selected';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { SettingMenuShowOptions } from 'src/app/core/view-models/setting-menu-show-options';
import { MessageModalComponent } from 'src/app/shared/message-modal/message-modal.component';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Subscription } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';
import { Products } from 'src/app/core/models/products';
import { ProductsService } from 'src/app/core/services/backend-services/products.service';
import { ProductsVM } from 'src/app/core/models/ViewModel/products-vm';
import { RolesPermissionsService } from 'src/app/core/services/backend-services/permissions/roles-permissions.service';
import { RolesPermissionsVm } from 'src/app/core/models/ViewModel/permissions/roles-permissions-vm';
import { UserPermission } from 'src/app/core/models/permissions/user-permissions';
import { Store } from '@ngrx/store';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProductsActions } from 'src/app/core/stores/actions/products.actions';
const PAGEID = 21; // from pages table in database seeding table
@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
})
export class ProductsListComponent implements OnInit, OnDestroy,OnChanges {
  @Input() changeProductsFlag:number=0;
  //#region Main Declarations
  currnetUrl: any;
  addUrl: string = '/control-panel/maintenance/add-product';
  updateUrl: string = '/control-panel/maintenance/update-product/';
  listUrl: string = '/control-panel/maintenance/products-list';
  toolbarPathData: ToolbarPath = {
    pageId: PAGEID,
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList: 'menu.products',
    componentAdd: '',
  };
  products: Products[] = [];
  //#endregion
  //#region Constructor
  constructor(
    private productsService: ProductsService,
    private router: Router,
    private sharedServices: SharedService,
    private rolesPerimssionsService: RolesPermissionsService,
    private alertsService: NotificationsAlertsService,
    private modalService: NgbModal,
    private translate: TranslatePipe,
    private store: Store<any>,
    private spinner: NgxSpinnerService
  ) {}
  //#endregion
  //#region ngOnInit
  ngOnInit(): void {
    localStorage.setItem('PageId', PAGEID.toString());
    this.getPagePermissions(PAGEID);
    this.listenToClickedButton();
    //this.sharedServices.changeButton({ action: 'List' } as ToolbarData);
    this.sharedServices.changeToolbarPath(this.toolbarPathData);
    this.defineGridColumn();
    this.getProducts();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(this.changeProductsFlag){
      this.getProducts();
    }
  }
  //#endregion
  //#region ngOnDestroy
  ngOnDestroy() {
    this.subsList.forEach((s) => {
      if (s) {
        s.unsubscribe();
      }
    });
  }
  //#endregion
  //#region Authentications
  //#endregion
  //#region Permissions
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
  //#endregion
  //#region  State Management
  //#endregion
  //#region Basic Data
  ///Geting form dropdown list data
  //#endregion
  //#region CRUD Operations
  getProducts() {
    this.spinner.show();
    return new Promise<void>((resolve, reject) => {
      let sub = this.productsService.getAll('GetAll').subscribe({
        next: (res: any) => {
          this.products = res.data.map((res: ProductsVM[]) => {
            return res;
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
    } else {
      this.showResponseMessage(
        true,
        AlertTypes.warning,
        this.translate.transform('permissions.permission-denied')
      );
    }
  }
  //navigatetoupdate
  edit(id: string) {
    this.router.navigate(['/control-panel/maintenance/update-product', id]);
    this.sharedServices.changeButton({
      action: 'Update',
      componentName: 'List',
    } as ToolbarData);
  }
  //#endregion
  //#region Helper Functions
  showResponseMessage(responseStatus, alertType, message) {
    if (responseStatus == true && AlertTypes.success == alertType) {
      this.alertsService.showSuccess(
        message,
        this.translate.transform('messages.done')
      );
    } else if (responseStatus == true && AlertTypes.warning) {
      this.alertsService.showWarning(
        message,
        this.translate.transform('messages.alert')
      );
    } else if (responseStatus == true && AlertTypes.info) {
      this.alertsService.showInfo(
        message,
        this.translate.transform('messages.info')
      );
    } else if (responseStatus == false && AlertTypes.error) {
      this.alertsService.showError(
        message,
        this.translate.transform('messages.error')
      );
    }
  }
  isListEmpty;
  showConfirmDeleteMessage(id: number) {
    const modalRef = this.modalService.open(MessageModalComponent);
    modalRef.componentInstance.message = this.translate.transform(
      'messages.confirm-delete'
    );
    modalRef.componentInstance.title =
      this.translate.transform('buttons.delete');
    modalRef.componentInstance.isYesNo = true;
    modalRef.result.then((rs) => {
      if (rs == 'Confirm') {
        this.spinner.show();

        let deletedItem = this.products.find((x) => x.id == id) as ProductsVM;
        let deletedVendorIndex = this.products.indexOf(deletedItem);
        let productsList = this.products.splice(deletedVendorIndex, 1);

        this.productsService.deleteWithUrl("Delete?id="+id).subscribe((resonse) => {
          this.getProducts();
          if (resonse.success == true) {
            this.store.dispatch(
              ProductsActions.actions.delete({
                data: JSON.parse(JSON.stringify({ ...deletedItem })),
              })
            );

            this.showResponseMessage(
              resonse.success,
              AlertTypes.success,
              this.translate.transform('messages.delete-success')
            );

            if (this.products.length == 0) {
              this.isListEmpty = true;
            }
          } else if (resonse.success == false) {
            this.showResponseMessage(
              resonse.success,
              AlertTypes.error,
              this.translate.transform('messages.delete-faild')
            );
          }
        });
        setTimeout(() => {
          this.spinner.hide();
        },500);
      }
    });
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
        this.lang == 'ar'
          ? { title: ' أسم الصنف', field: 'productNameAr' }
          : { title: 'Product Name', field: 'productNameEn' },

        this.lang == 'ar'
          ? { title: ' أسم مجموعة الصنف', field: 'categoryNameAr' }
          : { title: 'Product Category Name', field: 'categoryNameEn' },

        this.lang == 'ar'
          ? {
              title: 'حذف',
              field: '',
              formatter: this.deleteFormatIcon,
              cellClick: (e, cell) => {
                this.delete(cell.getRow().getData().id);
              },
            }
          : {
              title: 'Delete',
              field: '',
              formatter: this.deleteFormatIcon,
              cellClick: (e, cell) => {
                this.delete(cell.getRow().getData().id);
              },
            },
        this.lang == 'ar'
          ? {
              title: 'تعديل',
              field: '',
              formatter: this.editFormatIcon,
              cellClick: (e, cell) => {
                this.edit(cell.getRow().getData().id);
              },
            }
          : {
              title: 'Edit',
              field: '',
              formatter: this.editFormatIcon,
              cellClick: (e, cell) => {
                this.edit(cell.getRow().getData().id);
              },
            },
      ];
    });
  }
  editFormatIcon() {
    //plain text value
    return "<i class=' fa fa-edit'></i>";
  }
  deleteFormatIcon() {
    //plain text value
    return "<i class=' fa fa-trash'></i>";
  }
  CheckBoxFormatIcon() {
    //plain text value
    return "<input id='yourID' type='checkbox' />";
  }

  menuOptions: SettingMenuShowOptions = {
    showDelete: true,
    showEdit: true,
  };

  direction: string = 'ltr';

  onSearchTextChange(searchTxt: string) {
    this.searchFilters = [
      [
        { field: 'productNameAr', type: 'like', value: searchTxt },
        { field: 'productNameEn', type: 'like', value: searchTxt },
        { field: 'categoryNameAr', type: 'like', value: searchTxt },
        { field: 'categoryNameEn', type: 'like', value: searchTxt },
      ],
    ];
  }

  openAddProducts() {}

  onMenuActionSelected(event: ITabulatorActionsSelected) {
    if (event != null) {
      if (event.actionName == 'Edit') {
        this.edit(event.item.id);
        this.sharedServices.changeButton({
          action: 'Update',
          componentName: 'List',
        } as ToolbarData);
        this.sharedServices.changeToolbarPath(this.toolbarPathData);
      } else if (event.actionName == 'Delete') {
        this.delete(event.item.id);
      }
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
          } else if (currentBtn.action == ToolbarActions.New) {
            this.router.navigate([this.addUrl]);
          }
        }
      },
    });
    this.subsList.push(sub);
  }
  //#endregion
}
