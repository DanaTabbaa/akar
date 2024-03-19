"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.MaintenanceOffersListComponent = void 0;
var core_1 = require("@angular/core");
var enums_1 = require("src/app/core/constants/enumrators/enums");
var message_modal_component_1 = require("src/app/shared/message-modal/message-modal.component");
var PAGEID = 30; // from pages table in database seeding table
var MaintenanceOffersListComponent = /** @class */ (function () {
    //#endregion
    //#region Constructor
    function MaintenanceOffersListComponent(maintenanceOffersService, sharedServices, router, translate, rolesPerimssionsService, fb, modalService, alertsService) {
        this.maintenanceOffersService = maintenanceOffersService;
        this.sharedServices = sharedServices;
        this.router = router;
        this.translate = translate;
        this.rolesPerimssionsService = rolesPerimssionsService;
        this.fb = fb;
        this.modalService = modalService;
        this.alertsService = alertsService;
        this.addUrl = '/control-panel/maintenance/add-maintenance-offer';
        this.updateUrl = '/control-panel/maintenance/update-maintenance-offer/';
        this.listUrl = '/control-panel/maintenance/maintenance-offers-list';
        this.toolbarPathData = {
            listPath: '',
            updatePath: this.updateUrl,
            addPath: this.addUrl,
            componentList: "menu.maintenance-offers",
            componentAdd: "maintenance-offers.add-maintenance-offer"
        };
        this.maintenanceOffers = [];
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
    MaintenanceOffersListComponent.prototype.ngOnInit = function () {
        this.getPagePermissions(PAGEID);
        this.listenToClickedButton();
        this.sharedServices.changeButton({ action: 'List' });
        this.sharedServices.changeToolbarPath(this.toolbarPathData);
        this.getMaintenanceOffers();
        this.defineGridColumn();
    };
    //#endregion
    //#region ngOnDestory
    MaintenanceOffersListComponent.prototype.ngOnDestroy = function () {
        this.subsList.forEach(function (s) {
            if (s) {
                s.unsubscribe();
            }
        });
    };
    MaintenanceOffersListComponent.prototype.getPagePermissions = function (pageId) {
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
    MaintenanceOffersListComponent.prototype.getMaintenanceOffers = function () {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.maintenanceOffersService.getAll("GetAll").subscribe({
                next: function (res) {
                    _this.maintenanceOffers = res.data.map(function (res) {
                        return res;
                    });
                    resolve();
                    //(('res', res);
                    //((' this.maintenanceOffers', this.maintenanceOffers);
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
    //#region CRUD Operations
    MaintenanceOffersListComponent.prototype["delete"] = function (id) {
        if (this.userPermissions.isDelete) {
            this.showConfirmDeleteMessage(id);
        }
        else {
            this.showResponseMessage(true, enums_1.AlertTypes.warning, this.translate.transform("permissions.permission-denied"));
        }
    };
    //#endregion
    //#region Helper Functions
    MaintenanceOffersListComponent.prototype.goToAdd = function (typeOfComponent) {
        this.router.navigate(['/control-panel/maintenance/add-maintenance-offer'], {
            queryParams: { typeOfComponent: typeOfComponent }
        });
    };
    MaintenanceOffersListComponent.prototype.edit = function (id) {
        this.sharedServices.changeButton({ action: 'Update' });
        this.router.navigate(['/control-panel/maintenance/update-maintenance-offer', id]);
    };
    MaintenanceOffersListComponent.prototype.showConfirmDeleteMessage = function (id) {
        var _this = this;
        var modalRef = this.modalService.open(message_modal_component_1.MessageModalComponent);
        modalRef.componentInstance.message = this.translate.transform("messages.confirm-delete");
        modalRef.componentInstance.title = this.translate.transform("messages.delete");
        modalRef.componentInstance.isYesNo = true;
        modalRef.result.then(function (rs) {
            //((rs);
            if (rs == 'Confirm') {
                _this.maintenanceOffersService["delete"](id).subscribe(function (resonse) {
                    //(('delete response', resonse);
                    if (resonse.success == true) {
                        _this.showResponseMessage(true, enums_1.AlertTypes["delete"], resonse.message);
                    }
                    else if (resonse.success == false) {
                        _this.showResponseMessage(resonse.success, enums_1.AlertTypes.error, resonse.message);
                    }
                    _this.getMaintenanceOffers();
                });
            }
        });
    };
    MaintenanceOffersListComponent.prototype.defineGridColumn = function () {
        var _this = this;
        this.sharedServices.getLanguage().subscribe(function (res) {
            _this.lang = res;
            _this.columnNames = [
                {
                    title: _this.lang == 'ar' ? 'رقم العرض' : 'Offer Price Number',
                    field: 'id'
                },
                {
                    title: _this.lang == 'ar' ? 'تاريخ العرض' : 'Offer Date',
                    field: 'date'
                },
                {
                    title: _this.lang == 'ar' ? 'رقم طلب الشراء' : 'Purchase Order Number',
                    field: 'purchaseOrderId'
                },
                _this.lang == 'ar'
                    ? { title: ' المورد', field: 'supplierNameAr' }
                    : { title: ' Supplier  ', field: 'supplierNameEn' },
                {
                    title: _this.lang == 'ar' ? ' مدة العرض' : 'Offer Duration',
                    field: 'offerDuration'
                },
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
    MaintenanceOffersListComponent.prototype.editFormatIcon = function () {
        return "<i class=' fa fa-edit'></i>";
    };
    ;
    MaintenanceOffersListComponent.prototype.deleteFormatIcon = function () {
        return "<i class=' fa fa-trash'></i>";
    };
    ;
    MaintenanceOffersListComponent.prototype.CheckBoxFormatIcon = function () {
        return "<input id='yourID' type='checkbox' />";
    };
    ;
    MaintenanceOffersListComponent.prototype.onSearchTextChange = function (searchTxt) {
        this.searchFilters = [
            [
                { field: 'id', type: 'like', value: searchTxt },
                { field: 'purchaseOrderId', type: 'like', value: searchTxt },
                { field: 'supplierNameAr', type: 'like', value: searchTxt },
                { field: 'supplierNameEn', type: 'like', value: searchTxt },
                { field: 'offerDuration', type: 'like', value: searchTxt }
            ],
        ];
    };
    MaintenanceOffersListComponent.prototype.openAddMaintenanceOffers = function () { };
    MaintenanceOffersListComponent.prototype.onMenuActionSelected = function (event) {
        if (event != null) {
            if (event.actionName == 'Edit') {
                this.edit(event.item.id);
                this.sharedServices.changeButton({ action: 'Update', componentName: 'List' });
                this.sharedServices.changeToolbarPath(this.toolbarPathData);
            }
            else if (event.actionName == 'Delete') {
                this["delete"](event.item.id);
            }
        }
    };
    MaintenanceOffersListComponent.prototype.listenToClickedButton = function () {
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
    //#endregion
    //#region Helper Functions
    MaintenanceOffersListComponent.prototype.showResponseMessage = function (responseStatus, alertType, message) {
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
    MaintenanceOffersListComponent = __decorate([
        core_1.Component({
            selector: 'app-maintenance-offers-list',
            templateUrl: './maintenance-offers-list.component.html',
            styleUrls: ['./maintenance-offers-list.component.scss']
        })
    ], MaintenanceOffersListComponent);
    return MaintenanceOffersListComponent;
}());
exports.MaintenanceOffersListComponent = MaintenanceOffersListComponent;
