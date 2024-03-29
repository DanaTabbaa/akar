"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.PurchaseInvoicesListComponent = void 0;
var core_1 = require("@angular/core");
var enums_1 = require("src/app/core/constants/enumrators/enums");
var message_modal_component_1 = require("src/app/shared/message-modal/message-modal.component");
var PAGEID = 31; // from pages table in database seeding table
var PurchaseInvoicesListComponent = /** @class */ (function () {
    function PurchaseInvoicesListComponent(router, modalService, sharedServices, rolesPerimssionsService, alertsService, translate, maintenancePurchaseBillsService) {
        this.router = router;
        this.modalService = modalService;
        this.sharedServices = sharedServices;
        this.rolesPerimssionsService = rolesPerimssionsService;
        this.alertsService = alertsService;
        this.translate = translate;
        this.maintenancePurchaseBillsService = maintenancePurchaseBillsService;
        this.purchaseInvoices = [];
        this.addUrl = '/control-panel/maintenance/add-purchase-invoice';
        this.updateUrl = '/control-panel/maintenance/update-purchase-invoice/';
        this.listUrl = '/control-panel/maintenance/purchase-invoices-list';
        this.toolbarPathData = {
            listPath: '',
            updatePath: this.updateUrl,
            addPath: this.addUrl,
            componentList: "menu.purchase-invoices",
            componentAdd: ''
        };
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
    PurchaseInvoicesListComponent.prototype.ngOnInit = function () {
        this.getPagePermissions(PAGEID);
        this.listenToClickedButton();
        this.sharedServices.changeButton({ action: 'List' });
        this.sharedServices.changeToolbarPath(this.toolbarPathData);
        this.getMaintenancePurchaseInvoices();
        this.defineGridColumn();
    };
    PurchaseInvoicesListComponent.prototype.getPagePermissions = function (pageId) {
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
    PurchaseInvoicesListComponent.prototype.getMaintenancePurchaseInvoices = function () {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.maintenancePurchaseBillsService.getAll("GetAll").subscribe({
                next: function (res) {
                    _this.purchaseInvoices = res.data.map(function (res) {
                        return res;
                    });
                    resolve();
                    //(("res", res);
                    //((" this.purchaseInvoices", this.purchaseInvoices);
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
    PurchaseInvoicesListComponent.prototype["delete"] = function (id) {
        if (this.userPermissions.isDelete) {
            this.showConfirmDeleteMessage(id);
        }
        else {
            this.showResponseMessage(true, enums_1.AlertTypes.warning, this.translate.transform("permissions.permission-denied"));
        }
    };
    //navigatetoupdate
    PurchaseInvoicesListComponent.prototype.edit = function (id) {
        this.sharedServices.changeButton({ action: 'Update' });
        this.router.navigate(['/control-panel/maintenance/update-purchase-invoice', id]);
    };
    PurchaseInvoicesListComponent.prototype.navigate = function (urlroute) {
        this.router.navigate([urlroute]);
    };
    PurchaseInvoicesListComponent.prototype.defineGridColumn = function () {
        var _this = this;
        this.sharedServices.getLanguage().subscribe(function (res) {
            _this.lang = res;
            _this.columnNames = [
                { title: _this.lang == 'ar' ? 'رقم الفاتورة' : 'Bill Number', field: 'id' },
                { title: _this.lang == 'ar' ? 'تاريخ الفاتورة' : 'Bill Date', field: 'date' },
                { title: _this.lang == 'ar' ? 'رقم طلب الشراء' : 'Purchase Order Id', field: 'purchaseOrderId' },
                { title: _this.lang == 'ar' ? 'رقم عرض سعر الصيانة' : 'Maintenance Price Offer Id', field: 'maintenanceOfferId' },
                { title: _this.lang == 'ar' ? 'الاجمالى قبل الضريبة' : 'Total Before Tax', field: 'totalBeforeTax' },
                { title: _this.lang == 'ar' ? 'اجمالى الضريبة' : 'Total Tax', field: 'totalTax' },
                { title: _this.lang == 'ar' ? 'الاجمالى بعد الضريبة' : 'Total After Tax', field: 'totalAfterTax' },
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
    PurchaseInvoicesListComponent.prototype.editFormatIcon = function () {
        return "<i class=' fa fa-edit'></i>";
    };
    ;
    PurchaseInvoicesListComponent.prototype.deleteFormatIcon = function () {
        return "<i class=' fa fa-trash'></i>";
    };
    ;
    PurchaseInvoicesListComponent.prototype.CheckBoxFormatIcon = function () {
        return "<input id='yourID' type='checkbox' />";
    };
    ;
    PurchaseInvoicesListComponent.prototype.onSearchTextChange = function (searchTxt) {
        this.searchFilters = [
            [
                { field: 'id', type: 'like', value: searchTxt },
                { field: 'maintenanceOfferId', type: 'like', value: searchTxt },
                { field: 'purchaseOrderId', type: 'like', value: searchTxt },
                ,
            ],
        ];
    };
    PurchaseInvoicesListComponent.prototype.openPurchaseInvoices = function () { };
    PurchaseInvoicesListComponent.prototype.onMenuActionSelected = function (event) {
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
    PurchaseInvoicesListComponent.prototype.showResponseMessage = function (responseStatus, alertType, message) {
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
    PurchaseInvoicesListComponent.prototype.showConfirmDeleteMessage = function (id) {
        var _this = this;
        var modalRef = this.modalService.open(message_modal_component_1.MessageModalComponent);
        modalRef.componentInstance.message = this.translate.transform("general.confirm-delete");
        modalRef.componentInstance.title = this.translate.transform("buttons.delete");
        modalRef.componentInstance.btnConfirmTxt = this.translate.transform("buttons.delete");
        modalRef.componentInstance.isYesNo = true;
        modalRef.result.then(function (rs) {
            //((rs);
            if (rs == 'Confirm') {
                _this.maintenancePurchaseBillsService["delete"](id).subscribe(function (resonse) {
                    //(('delete response', resonse);
                    _this.getMaintenancePurchaseInvoices();
                    if (resonse.success == true) {
                        _this.showResponseMessage(resonse.success, enums_1.AlertTypes["delete"], resonse.msg);
                    }
                    else if (resonse.success == false) {
                        _this.showResponseMessage(resonse.success, enums_1.AlertTypes.error, resonse.msg);
                    }
                });
            }
        });
    };
    PurchaseInvoicesListComponent.prototype.listenToClickedButton = function () {
        var _this = this;
        var sub = this.sharedServices.getClickedbutton().subscribe({
            next: function (currentBtn) {
                currentBtn;
                if (currentBtn != null) {
                    if (currentBtn.action == enums_1.ToolbarActions.List) {
                    }
                    else if (currentBtn.action == enums_1.ToolbarActions.New) {
                        _this.router.navigate([_this.addUrl]);
                    }
                }
            }
        });
        this.subsList.push(sub);
    };
    PurchaseInvoicesListComponent = __decorate([
        core_1.Component({
            selector: 'app-purchase-invoices-list',
            templateUrl: './purchase-invoices-list.component.html',
            styleUrls: ['./purchase-invoices-list.component.scss']
        })
    ], PurchaseInvoicesListComponent);
    return PurchaseInvoicesListComponent;
}());
exports.PurchaseInvoicesListComponent = PurchaseInvoicesListComponent;
