"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ElectricityMetersListComponent = void 0;
var core_1 = require("@angular/core");
var enums_1 = require("src/app/core/constants/enumrators/enums");
var message_modal_component_1 = require("src/app/shared/message-modal/message-modal.component");
var PAGEID = 26; // from pages table in database seeding table
var ElectricityMetersListComponent = /** @class */ (function () {
    //#endregion
    //#region Constructor
    function ElectricityMetersListComponent(electricityMetersService, router, sharedServices, rolesPerimssionsService, alertsService, modalService, translate) {
        this.electricityMetersService = electricityMetersService;
        this.router = router;
        this.sharedServices = sharedServices;
        this.rolesPerimssionsService = rolesPerimssionsService;
        this.alertsService = alertsService;
        this.modalService = modalService;
        this.translate = translate;
        this.addUrl = '/control-panel/maintenance/add-electricity-meter';
        this.updateUrl = '/control-panel/maintenance/update-electricity-meter/';
        this.listUrl = '/control-panel/maintenance/electricity-meters-list';
        this.toolbarPathData = {
            listPath: '',
            updatePath: this.updateUrl,
            addPath: this.addUrl,
            componentList: "menu.electricity-meters",
            componentAdd: ''
        };
        this.electricityMeters = [];
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
    ElectricityMetersListComponent.prototype.ngOnInit = function () {
        this.getPagePermissions(PAGEID);
        this.listenToClickedButton();
        this.sharedServices.changeButton({ action: 'List' });
        this.sharedServices.changeToolbarPath(this.toolbarPathData);
        this.getElectricityMeters();
        this.defineGridColumn();
    };
    //#endregion
    //#region ngOnDestroy
    ElectricityMetersListComponent.prototype.ngOnDestroy = function () {
        this.subsList.forEach(function (s) {
            if (s) {
                s.unsubscribe();
            }
        });
    };
    ElectricityMetersListComponent.prototype.getPagePermissions = function (pageId) {
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
    ElectricityMetersListComponent.prototype.getElectricityMeters = function () {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.electricityMetersService.getAll("GetAll").subscribe({
                next: function (res) {
                    _this.electricityMeters = res.data.map(function (res) {
                        return res;
                    });
                    resolve();
                    //(('res', res);
                    //((' this.electricityMeters', this.electricityMeters);
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
    ElectricityMetersListComponent.prototype["delete"] = function (id) {
        if (this.userPermissions.isDelete) {
            this.showConfirmDeleteMessage(id);
        }
        else {
            this.showResponseMessage(true, enums_1.AlertTypes.warning, this.translate.transform("permissions.permission-denied"));
        }
    };
    //navigatetoupdate
    ElectricityMetersListComponent.prototype.edit = function (id) {
        this.router.navigate(['/control-panel/maintenance/update-electricity-meter', id]);
        this.sharedServices.changeButton({
            action: 'Update',
            componentName: 'List'
        });
        this.sharedServices.changeToolbarPath(this.toolbarPathData);
    };
    //#endregion
    //#region Helper Functions
    ElectricityMetersListComponent.prototype.showResponseMessage = function (responseStatus, alertType, message) {
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
    ElectricityMetersListComponent.prototype.showConfirmDeleteMessage = function (id) {
        var _this = this;
        var modalRef = this.modalService.open(message_modal_component_1.MessageModalComponent);
        modalRef.componentInstance.message = this.translate.transform('messages.confirm-delete');
        modalRef.componentInstance.title = this.translate.transform('buttons.delete');
        modalRef.componentInstance.isYesNo = true;
        modalRef.result.then(function (rs) {
            //((rs);
            if (rs == 'Confirm') {
                _this.electricityMetersService["delete"](id).subscribe(function (resonse) {
                    //(('delete response', resonse);
                    _this.getElectricityMeters();
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
    ElectricityMetersListComponent.prototype.defineGridColumn = function () {
        var _this = this;
        this.sharedServices.getLanguage().subscribe(function (res) {
            _this.lang = res;
            _this.columnNames = [
                {
                    title: _this.lang == 'ar' ? 'رقم العداد' : 'Meter Number',
                    field: 'meterNumber'
                },
                _this.lang == 'ar'
                    ? { title: ' نوع العداد', field: 'typeAr' }
                    : { title: 'Mater Type', field: 'typeEn' },
                _this.lang == 'ar'
                    ? { title: 'المبنى', field: 'buildingNameAr' }
                    : { title: 'Building', field: 'buildingNameEn' },
                _this.lang == 'ar'
                    ? { title: 'الوحدة', field: 'unitNameAr' }
                    : { title: 'Unit', field: 'unitNameEn' },
                {
                    title: _this.lang == 'ar' ? 'رقم الحساب' : 'Account Number',
                    field: 'accountNumber'
                },
                {
                    title: _this.lang == 'ar' ? 'رقم الاشتراك' : 'Subscription Number',
                    field: 'subscriptionNumber'
                },
                {
                    title: _this.lang == 'ar' ? 'سعة العداد' : 'Capacity',
                    field: 'capacity'
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
    ElectricityMetersListComponent.prototype.editFormatIcon = function () {
        return "<i class=' fa fa-edit'></i>";
    };
    ;
    ElectricityMetersListComponent.prototype.deleteFormatIcon = function () {
        return "<i class=' fa fa-trash'></i>";
    };
    ;
    ElectricityMetersListComponent.prototype.CheckBoxFormatIcon = function () {
        return "<input id='yourID' type='checkbox' />";
    };
    ;
    ElectricityMetersListComponent.prototype.onSearchTextChange = function (searchTxt) {
        this.searchFilters = [
            [
                { field: 'meterNumber', type: 'like', value: searchTxt },
                { field: 'typeAr', type: 'like', value: searchTxt },
                { field: 'typeEn', type: 'like', value: searchTxt },
                { field: 'accountNumber', type: 'like', value: searchTxt },
                { field: 'subscriptionNumber', type: 'like', value: searchTxt },
                { field: 'buildingNameAr', type: 'like', value: searchTxt },
                { field: 'buildingNameEn', type: 'like', value: searchTxt }
            ],
        ];
    };
    ElectricityMetersListComponent.prototype.openAddElectricityMeters = function () { };
    ElectricityMetersListComponent.prototype.onMenuActionSelected = function (event) {
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
    ElectricityMetersListComponent.prototype.listenToClickedButton = function () {
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
    ElectricityMetersListComponent = __decorate([
        core_1.Component({
            selector: 'app-electricity-meters-list',
            templateUrl: './electricity-meters-list.component.html',
            styleUrls: ['./electricity-meters-list.component.scss']
        })
    ], ElectricityMetersListComponent);
    return ElectricityMetersListComponent;
}());
exports.ElectricityMetersListComponent = ElectricityMetersListComponent;
