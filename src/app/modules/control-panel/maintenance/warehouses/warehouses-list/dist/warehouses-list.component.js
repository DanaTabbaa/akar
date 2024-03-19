"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.WarehousesListComponent = void 0;
var core_1 = require("@angular/core");
var message_modal_component_1 = require("src/app/shared/message-modal/message-modal.component");
var enums_1 = require("src/app/core/constants/enumrators/enums");
var PAGEID = 19; // from pages table in database seeding table
var WarehousesListComponent = /** @class */ (function () {
    function WarehousesListComponent(MaintenanceWarehousesService, modalService, alertsService, rolesPerimssionsService, sharedServices, translate, router, fb) {
        this.MaintenanceWarehousesService = MaintenanceWarehousesService;
        this.modalService = modalService;
        this.alertsService = alertsService;
        this.rolesPerimssionsService = rolesPerimssionsService;
        this.sharedServices = sharedServices;
        this.translate = translate;
        this.router = router;
        this.fb = fb;
        this.maintenanceWarehouses = [];
        this.addUrl = '/control-panel/maintenance/add-maintenance-warehouse';
        this.updateUrl = '/control-panel/maintenance/update-maintenance-warehouse/';
        this.listUrl = '/control-panel/maintenance/maintenance-warehouses-list';
        this.toolbarPathData = {
            listPath: this.listUrl,
            addPath: '',
            updatePath: this.updateUrl,
            componentList: "menu.warehouses",
            componentAdd: ''
        };
        this.subsList = [];
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
        this.maintenanceWarehouseSearchForm = this.fb.group({
            _search: ''
        });
    }
    //#region ngOnDestory
    WarehousesListComponent.prototype.ngOnDestroy = function () {
        this.subsList.forEach(function (s) {
            if (s) {
                s.unsubscribe();
            }
        });
    };
    //#endregion
    WarehousesListComponent.prototype.ngOnInit = function () {
        this.getPagePermissions(PAGEID);
        this.listenToClickedButton();
        this.sharedServices.changeButton({ action: 'List' });
        this.sharedServices.changeToolbarPath(this.toolbarPathData);
        this.defineGridColumn();
        this.getMaintenanceWarehouses();
    };
    WarehousesListComponent.prototype.getMaintenanceWarehouses = function () {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.MaintenanceWarehousesService.getAll("GetAll").subscribe({
                next: function (res) {
                    _this.maintenanceWarehouses = res.data.map(function (res) {
                        return res;
                    });
                    resolve();
                    //(("res", res);
                    //((" this.maintenanceWarehouses", this.maintenanceWarehouses);
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
    WarehousesListComponent.prototype.getPagePermissions = function (pageId) {
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
    WarehousesListComponent.prototype["delete"] = function (id) {
        if (this.userPermissions.isDelete) {
            this.showConfirmDeleteMessage(id);
        }
        else {
            this.showResponseMessage(true, enums_1.AlertTypes.warning, this.translate.transform("permissions.permission-denied"));
        }
    };
    //#region Helper Functions
    WarehousesListComponent.prototype.showConfirmDeleteMessage = function (id) {
        var _this = this;
        var modalRef = this.modalService.open(message_modal_component_1.MessageModalComponent);
        modalRef.componentInstance.message = this.translate.transform('messages.confirm-delete');
        modalRef.componentInstance.title = this.translate.transform('buttons.delete');
        modalRef.componentInstance.isYesNo = true;
        modalRef.result.then(function (rs) {
            //((rs);
            if (rs == 'Confirm') {
                _this.MaintenanceWarehousesService["delete"](id).subscribe(function (resonse) {
                    //(('delete response', resonse);
                    _this.getMaintenanceWarehouses();
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
    WarehousesListComponent.prototype.goToAdd = function (typeOfComponent) {
        this.router.navigate(['/control-panel/maintenance/add-maintenance-warehouse'], { queryParams: { typeOfComponent: typeOfComponent } });
    };
    //navigatetoupdate
    WarehousesListComponent.prototype.edit = function (id) {
        this.router.navigate(['/control-panel/maintenance/update-maintenance-warehouse', id]);
        this.sharedServices.changeButton({ action: 'Update', componentName: "List" });
        this.sharedServices.changeToolbarPath(this.toolbarPathData);
    };
    WarehousesListComponent.prototype.navigate = function (urlroute) {
        this.router.navigate([urlroute]);
    };
    WarehousesListComponent.prototype.showResponseMessage = function (responseStatus, alertType, message) {
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
    WarehousesListComponent.prototype.listenToClickedButton = function () {
        var _this = this;
        var sub = this.sharedServices.getClickedbutton().subscribe({
            next: function (currentBtn) {
                currentBtn;
                if (currentBtn != null) {
                    if (currentBtn.action == enums_1.ToolbarActions.List) {
                        // this.router.navigate(['/control-panel/definitions/buildings']);
                    }
                    else if (currentBtn.action == enums_1.ToolbarActions.New) {
                        _this.router.navigate([_this.addUrl]);
                    }
                }
            }
        });
        this.subsList.push(sub);
    };
    WarehousesListComponent.prototype.defineGridColumn = function () {
        var _this = this;
        this.sharedServices.getLanguage().subscribe(function (res) {
            _this.lang = res;
            _this.columnNames = [
                {
                    title: _this.lang == 'ar' ? 'رقم' : 'Id',
                    field: 'id'
                },
                {
                    title: _this.lang == 'ar' ? 'أسم المستودع باللغة العربية' : ' Warehouse Name In Arabic',
                    field: 'warehouseNameAr'
                },
                {
                    title: _this.lang == 'ar' ? 'أسم المستودع باللغة الانجليزية' : ' Warehouse Name In English',
                    field: 'warehouseNameEn'
                },
                {
                    title: _this.lang == 'ar' ? 'أسم المالك باللغة العربية' : 'Owner Name In Arabic',
                    field: 'ownerNameAr'
                },
                {
                    title: _this.lang == 'ar' ? 'أسم المالك باللغة الانجليزية' : 'Owner Name In English',
                    field: 'ownerNameEn'
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
    WarehousesListComponent.prototype.editFormatIcon = function () {
        return "<i class='fa fa-edit'></i>";
    };
    ;
    WarehousesListComponent.prototype.deleteFormatIcon = function () {
        return "<i class=' fa fa-trash'></i>";
    };
    ;
    WarehousesListComponent.prototype.CheckBoxFormatIcon = function () {
        return "<input id='yourID' type='checkbox' />";
    };
    ;
    WarehousesListComponent.prototype.onSearchTextChange = function (searchTxt) {
        this.searchFilters = [
            [
                { field: 'warehouseNameAr', type: 'like', value: searchTxt },
                { field: 'warehouseNameEn', type: 'like', value: searchTxt },
                { field: 'ownerNameAr', type: 'like', value: searchTxt },
                { field: 'ownerNameEn', type: 'like', value: searchTxt },
                ,
            ],
        ];
    };
    WarehousesListComponent.prototype.openAddMaintenanceWarehouse = function () { };
    WarehousesListComponent.prototype.onMenuActionSelected = function (event) {
        if (event != null) {
            if (event.actionName == 'Edit') {
                this.edit(event.item.id);
                this.sharedServices.changeButton({ action: 'Update', componentName: "List" });
                this.sharedServices.changeToolbarPath(this.toolbarPathData);
            }
            else if (event.actionName == 'Delete') {
                this["delete"](event.item.id);
            }
        }
    };
    WarehousesListComponent = __decorate([
        core_1.Component({
            selector: 'app-warehouses-list',
            templateUrl: './warehouses-list.component.html',
            styleUrls: ['./warehouses-list.component.scss']
        })
    ], WarehousesListComponent);
    return WarehousesListComponent;
}());
exports.WarehousesListComponent = WarehousesListComponent;
