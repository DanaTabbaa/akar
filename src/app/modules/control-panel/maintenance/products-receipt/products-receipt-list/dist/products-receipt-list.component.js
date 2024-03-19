"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ProductsReceiptListComponent = void 0;
var core_1 = require("@angular/core");
var enums_1 = require("src/app/core/constants/enumrators/enums");
var message_modal_component_1 = require("src/app/shared/message-modal/message-modal.component");
var PAGEID = 25; // from pages table in database seeding table
var ProductsReceiptListComponent = /** @class */ (function () {
    //#endregion
    //#region Constructor
    function ProductsReceiptListComponent(productsReceiptService, router, rolesPerimssionsService, sharedServices, alertsService, modalService, translate, route) {
        this.productsReceiptService = productsReceiptService;
        this.router = router;
        this.rolesPerimssionsService = rolesPerimssionsService;
        this.sharedServices = sharedServices;
        this.alertsService = alertsService;
        this.modalService = modalService;
        this.translate = translate;
        this.route = route;
        this.productsReceipt = [];
        this.addUrl = '/control-panel/maintenance/add-products-receipt';
        this.updateUrl = '/control-panel/maintenance/update-products-receipt/';
        this.listUrl = '/control-panel/maintenance/products-receipt-list';
        this.toolbarPathData = {
            listPath: '',
            updatePath: this.updateUrl,
            addPath: this.addUrl,
            componentList: "menu.products-receipts",
            componentAdd: ''
        };
        //#endregion
        //#region Tabulator
        this.panelId = 1;
        this.sortByCols = [];
        this.groupByCols = [];
        this.lang = '';
        this.columnNames = [];
        this.menuOptions = {
            showDelete: true,
            showEdit: true
        };
        this.direction = 'ltr';
        this.subsList = [];
    }
    //#endregion
    //#region ngOnInit
    ProductsReceiptListComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.queryParams = this.route.queryParams.subscribe(function (params) {
            if (params['maintenanceRequestId'] != null) {
                _this.maintenanceRequestId = params['maintenanceRequestId'];
            }
        });
        this.getPagePermissions(PAGEID);
        this.listenToClickedButton();
        this.sharedServices.changeButton({ action: 'List' });
        this.sharedServices.changeToolbarPath(this.toolbarPathData);
        this.defineGridColumn();
        this.getProductsReceipt();
    };
    //#endregion
    //#region ngOnDestroy
    ProductsReceiptListComponent.prototype.ngOnDestroy = function () {
        this.subsList.forEach(function (s) {
            if (s) {
                s.unsubscribe();
            }
        });
    };
    ProductsReceiptListComponent.prototype.getPagePermissions = function (pageId) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.rolesPerimssionsService.getAll("GetPagePermissionById?pageId=" + pageId).subscribe({
                next: function (res) {
                    _this.rolePermission = JSON.parse(JSON.stringify(res.data));
                    _this.userPermissions = JSON.parse(_this.rolePermission.permissionJson);
                    _this.sharedServices.setUserPermissions(_this.userPermissions);
                    resolve();
                },
                error: function (err) {
                    reject(err);
                },
                complete: function () {
                }
            });
        });
        return promise;
    };
    //#endregion
    //#region  State Management
    //#endregion
    //#region Basic Data
    ///Geting form dropdown list data
    //#endregion
    //#region CRUD Operations
    ProductsReceiptListComponent.prototype.getProductsReceipt = function () {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.productsReceiptService.getAll("GetAll").subscribe({
                next: function (res) {
                    _this.productsReceipt = res.data.map(function (res) {
                        return res;
                    });
                    resolve();
                },
                error: function (err) {
                    reject(err);
                },
                complete: function () {
                }
            });
        });
        return promise;
    };
    ProductsReceiptListComponent.prototype["delete"] = function (id) {
        if (this.userPermissions.isDelete) {
            this.showConfirmDeleteMessage(id);
        }
        else {
            this.showResponseMessage(true, enums_1.AlertTypes.warning, this.translate.transform("permissions.permission-denied"));
        }
    };
    //navigatetoupdate
    ProductsReceiptListComponent.prototype.edit = function (id) {
        this.sharedServices.changeButton({ action: "Update" });
        this.router.navigate(['/control-panel/maintenance/update-products-receipt', id]);
    };
    //#endregion
    //#region Helper Functions
    ProductsReceiptListComponent.prototype.showResponseMessage = function (responseStatus, alertType, message) {
        if (responseStatus == true && enums_1.AlertTypes.success == alertType) {
            this.alertsService.showSuccess(message, this.translate.transform('messages.done'));
        }
        else if (responseStatus == true && enums_1.AlertTypes.warning) {
            this.alertsService.showWarning(message, this.translate.transform('messages.alert'));
        }
        else if (responseStatus == true && enums_1.AlertTypes.info) {
            this.alertsService.showInfo(message, this.translate.transform('messages.info'));
        }
        else if (responseStatus == false && enums_1.AlertTypes.error) {
            this.alertsService.showError(message, this.translate.transform('messages.error'));
        }
    };
    ProductsReceiptListComponent.prototype.showConfirmDeleteMessage = function (id) {
        var _this = this;
        var modalRef = this.modalService.open(message_modal_component_1.MessageModalComponent);
        modalRef.componentInstance.message = this.translate.transform('messages.confirm-delete');
        modalRef.componentInstance.title = this.translate.transform('buttons.delete');
        modalRef.componentInstance.isYesNo = true;
        modalRef.result.then(function (rs) {
            if (rs == 'Confirm') {
                _this.productsReceiptService.deleteWithUrl("Delete?id=" + id).subscribe(function (resonse) {
                    _this.getProductsReceipt();
                    if (resonse.success == true) {
                        _this.showResponseMessage(resonse.success, enums_1.AlertTypes.warning, resonse.message);
                    }
                    else if (resonse.success == false) {
                        _this.showResponseMessage(resonse.success, enums_1.AlertTypes.error, resonse.message);
                    }
                });
            }
        });
    };
    ProductsReceiptListComponent.prototype.defineGridColumn = function () {
        var _this = this;
        this.sharedServices.getLanguage().subscribe(function (res) {
            _this.lang = res;
            _this.columnNames = [
                {
                    title: _this.lang == 'ar' ? ' رقم سند الصرف' : 'Number',
                    field: 'id'
                },
                {
                    title: _this.lang == 'ar' ? 'رقم طلب الصيانة' : 'Maintenance Request Number',
                    field: 'maintenanceRequestId'
                },
                {
                    title: _this.lang == 'ar' ? 'تاريخ السند' : 'Products Receipt Date',
                    field: 'date'
                },
                _this.lang == 'ar'
                    ? { title: 'المستأجر', field: 'tenantNameAr' }
                    : { title: 'Tenant', field: 'tenantNameEn' },
                _this.lang == 'ar'
                    ? { title: 'الفنى', field: 'technicianNameAr' }
                    : { title: 'Technician', field: 'technicianNameEn' },
                _this.lang == "ar" ? {
                    title: "حذف",
                    field: "", formatter: _this.deleteFormatIcon,
                    cellClick: function (e, cell) {
                        _this["delete"](cell.getRow().getData().id);
                    }
                } :
                    {
                        title: "Delete",
                        field: "", formatter: _this.deleteFormatIcon,
                        cellClick: function (e, cell) {
                            _this["delete"](cell.getRow().getData().id);
                        }
                    },
                _this.lang == "ar" ? {
                    title: "تعديل",
                    field: "", formatter: _this.editFormatIcon,
                    cellClick: function (e, cell) {
                        _this.edit(cell.getRow().getData().id);
                    }
                }
                    :
                        {
                            title: "Edit",
                            field: "", formatter: _this.editFormatIcon,
                            cellClick: function (e, cell) {
                                _this.edit(cell.getRow().getData().id);
                            }
                        },
            ];
        });
    };
    ProductsReceiptListComponent.prototype.editFormatIcon = function () {
        return "<i class=' fa fa-edit'></i>";
    };
    ;
    ProductsReceiptListComponent.prototype.deleteFormatIcon = function () {
        return "<i class=' fa fa-trash'></i>";
    };
    ;
    ProductsReceiptListComponent.prototype.CheckBoxFormatIcon = function () {
        return "<input id='yourID' type='checkbox' />";
    };
    ;
    ProductsReceiptListComponent.prototype.onSearchTextChange = function (searchTxt) {
        this.searchFilters = [
            [
                { field: 'id', type: 'like', value: searchTxt },
                { field: 'maintenanceRequestId', type: 'like', value: searchTxt },
                { field: 'tenantNameAr', type: 'like', value: searchTxt },
                { field: 'tenantNameEn', type: 'like', value: searchTxt },
                { field: 'technicianNameAr', type: 'like', value: searchTxt },
                { field: 'technicianNameEn', type: 'like', value: searchTxt },
            ],
        ];
    };
    ProductsReceiptListComponent.prototype.openAddProductsReceipt = function () { };
    ProductsReceiptListComponent.prototype.onMenuActionSelected = function (event) {
        if (event != null) {
            if (event.actionName == 'Edit') {
                this.edit(event.item.id);
                this.sharedServices.changeButton({
                    action: 'Update',
                    componentName: 'List'
                });
                this.sharedServices.changeToolbarPath(this.toolbarPathData);
            }
            else if (event.actionName == 'Delete') {
                this["delete"](event.item.id);
            }
        }
    };
    ProductsReceiptListComponent.prototype.listenToClickedButton = function () {
        var _this = this;
        var sub = this.sharedServices.getClickedbutton().subscribe({
            next: function (currentBtn) {
                currentBtn;
                if (currentBtn != null) {
                    if (currentBtn.action == enums_1.ToolbarActions.List) {
                    }
                    else if (currentBtn.action == enums_1.ToolbarActions.New) {
                        if (_this.maintenanceRequestId != '') {
                            _this.router.navigate([_this.addUrl], { queryParams: { maintenanceRequestId: _this.maintenanceRequestId } });
                        }
                        else {
                            _this.router.navigate([_this.addUrl]);
                        }
                    }
                }
            }
        });
        this.subsList.push(sub);
    };
    ProductsReceiptListComponent = __decorate([
        core_1.Component({
            selector: 'app-products-receipt-list',
            templateUrl: './products-receipt-list.component.html',
            styleUrls: ['./products-receipt-list.component.scss']
        })
    ], ProductsReceiptListComponent);
    return ProductsReceiptListComponent;
}());
exports.ProductsReceiptListComponent = ProductsReceiptListComponent;
