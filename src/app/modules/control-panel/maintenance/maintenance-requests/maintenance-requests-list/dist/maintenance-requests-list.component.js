"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.MaintenanceRequestsListComponent = void 0;
var core_1 = require("@angular/core");
var enums_1 = require("src/app/core/constants/enumrators/enums");
var message_modal_component_1 = require("src/app/shared/message-modal/message-modal.component");
var maintenancerequests_actions_1 = require("src/app/core/stores/actions/maintenancerequests.actions");
var PAGEID = 24; // from pages table in database seeding table
var MaintenanceRequestsListComponent = /** @class */ (function () {
    //#endregion
    //#region Constructor
    function MaintenanceRequestsListComponent(maintenanceRequestsService, router, sharedServices, rolesPerimssionsService, alertsService, modalService, translate, spinner, store) {
        this.maintenanceRequestsService = maintenanceRequestsService;
        this.router = router;
        this.sharedServices = sharedServices;
        this.rolesPerimssionsService = rolesPerimssionsService;
        this.alertsService = alertsService;
        this.modalService = modalService;
        this.translate = translate;
        this.spinner = spinner;
        this.store = store;
        this.addUrl = '/control-panel/maintenance/add-maintenance-request';
        this.updateUrl = '/control-panel/maintenance/update-maintenance-request/';
        this.listUrl = '/control-panel/maintenance/maintenance-requests-list';
        this.toolbarPathData = {
            listPath: '',
            updatePath: this.updateUrl,
            addPath: this.addUrl,
            componentList: "menu.maintenance-requests",
            componentAdd: ''
        };
        this.maintenanceRequests = [];
        //#endregion
        //#region Tabulator
        this.panelId = 1;
        this.sortByCols = [];
        this.groupByCols = [];
        this.lang = '';
        this.columnNames = [];
        this.menuOptions = {
            showDelete: true,
            showEdit: true,
            showDetermineTheTechnician: true,
            showRequestDetails: true,
            showProductReceipt: true,
            showPriceRequest: true,
            showCloseRequest: true
        };
        this.direction = 'ltr';
        this.subsList = [];
    }
    //#endregion
    //#region ngOnInit
    MaintenanceRequestsListComponent.prototype.ngOnInit = function () {
        this.getPagePermissions(PAGEID);
        this.listenToClickedButton();
        this.sharedServices.changeButton({ action: 'List' });
        this.sharedServices.changeToolbarPath(this.toolbarPathData);
        this.defineGridColumn();
        this.getMaintenanceRequests();
    };
    //#endregion
    //#region ngOnDestroy
    MaintenanceRequestsListComponent.prototype.ngOnDestroy = function () {
        this.subsList.forEach(function (s) {
            if (s) {
                s.unsubscribe();
            }
        });
    };
    MaintenanceRequestsListComponent.prototype.getPagePermissions = function (pageId) {
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
    MaintenanceRequestsListComponent.prototype.getMaintenanceRequests = function () {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.maintenanceRequestsService.getAll("GetAll").subscribe({
                next: function (res) {
                    console.log("getMaintenanceRequests", res);
                    _this.maintenanceRequests = res.data.map(function (res) {
                        return res;
                    });
                    resolve();
                    //(('res', res);
                    //((' this.maintenanceRequests', this.maintenanceRequests);
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
    MaintenanceRequestsListComponent.prototype["delete"] = function (id) {
        if (this.userPermissions.isDelete) {
            this.showConfirmDeleteMessage(id);
        }
        else {
            this.showResponseMessage(true, enums_1.AlertTypes.warning, this.translate.transform("permissions.permission-denied"));
        }
    };
    //navigatetoupdate
    MaintenanceRequestsListComponent.prototype.edit = function (id) {
        // this.sharedServices.changeButton({ action: 'Update' } as ToolbarData);
        this.router.navigate(['/control-panel/maintenance/update-maintenance-request', id]);
        this.sharedServices.changeButton({
            action: 'Update',
            componentName: 'List'
        });
        this.sharedServices.changeToolbarPath(this.toolbarPathData);
    };
    //navigatetodetails
    MaintenanceRequestsListComponent.prototype.details = function (id) {
        this.router.navigate(['/control-panel/maintenance/maintenance-request-details', id]);
    };
    //#endregion
    //navigatetoproductsreceipt
    MaintenanceRequestsListComponent.prototype.productsReceipt = function (id) {
        this.router.navigate(['/control-panel/maintenance/products-receipt-list'], { queryParams: { maintenanceRequestId: id } });
    };
    //#endregion
    //navigatetopriceRequest
    MaintenanceRequestsListComponent.prototype.priceRequest = function (id) {
        this.router.navigate(['/control-panel/maintenance/add-price-request'], { queryParams: { maintenanceRequestId: id } });
    };
    //#endregion
    //#region Helper Functions
    MaintenanceRequestsListComponent.prototype.showResponseMessage = function (responseStatus, alertType, message) {
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
    MaintenanceRequestsListComponent.prototype.showConfirmDeleteMessage = function (id) {
        var _this = this;
        var modalRef = this.modalService.open(message_modal_component_1.MessageModalComponent);
        modalRef.componentInstance.message = this.translate.transform('messages.confirm-delete');
        modalRef.componentInstance.title = this.translate.transform('buttons.delete');
        modalRef.componentInstance.isYesNo = true;
        modalRef.result.then(function (rs) {
            if (rs == 'Confirm') {
                _this.spinner.show();
                var deletedItem = _this.maintenanceRequests.find(function (x) { return x.id == id; });
                _this.maintenanceRequestsService["delete"](id).subscribe(function (resonse) {
                    _this.getMaintenanceRequests();
                    if (resonse.success == true) {
                        _this.store.dispatch(maintenancerequests_actions_1.MaintenanceRequestsActions.actions["delete"]({
                            data: JSON.parse(JSON.stringify(__assign({}, deletedItem)))
                        }));
                        _this.showResponseMessage(resonse.success, enums_1.AlertTypes.success, resonse.message);
                    }
                    else if (resonse.success == false) {
                        _this.showResponseMessage(resonse.success, enums_1.AlertTypes.error, resonse.message);
                    }
                });
                setTimeout(function () {
                    _this.spinner.hide();
                },500);
            }
        });
    };
    MaintenanceRequestsListComponent.prototype.showConfirmCloseRequestMessage = function (model) {
        var _this = this;
        var modalRef = this.modalService.open(message_modal_component_1.MessageModalComponent);
        modalRef.componentInstance.message = this.translate.transform('maintenance-requests.confirm-close-request');
        modalRef.componentInstance.title = this.translate.transform('maintenance-requests.close-request');
        modalRef.componentInstance.btnConfirmTxt = this.translate.transform('maintenance-requests.close-request');
        modalRef.componentInstance.isYesNo = true;
        modalRef.result.then(function (rs) {
            //((rs);
            if (rs == 'Confirm') {
                model.requestStatus = 8;
                _this.maintenanceRequestsService.update(model).subscribe(function (resonse) {
                    _this.getMaintenanceRequests();
                    if (resonse.success == true) {
                        _this.store.dispatch(maintenancerequests_actions_1.MaintenanceRequestsActions.actions.update({
                            data: JSON.parse(JSON.stringify(__assign({}, resonse.data)))
                        }));
                        _this.showResponseMessage(resonse.success, enums_1.AlertTypes.success, resonse.message);
                    }
                    else if (resonse.success == false) {
                        _this.showResponseMessage(resonse.success, enums_1.AlertTypes.error, resonse.message);
                    }
                });
            }
        });
    };
    MaintenanceRequestsListComponent.prototype.defineGridColumn = function () {
        var _this = this;
        this.sharedServices.getLanguage().subscribe(function (res) {
            _this.lang = res;
            _this.columnNames = [
                {
                    title: _this.lang == 'ar' ? ' رقم الطلب' : 'Request Id',
                    field: 'id'
                },
                _this.lang == 'ar'
                    ? { title: ' المستأجر', field: 'tenantNameAr' }
                    : { title: ' Tenant  ', field: 'tenantNameEn' },
                _this.lang == 'ar'
                    ? { title: ' الوحدة  ', field: 'unitNameAr' }
                    : { title: ' Unit  ', field: 'unitNameEn' },
                _this.lang == 'ar'
                    ? { title: ' خدمة الصيانة  ', field: 'serviceNameAr' }
                    : { title: 'Maintenance Service  ', field: 'serviceNameEn' },
                _this.lang == 'ar'
                    ? { title: 'الفنى', field: 'technicianNameAr' }
                    : { title: 'Technician', field: 'technicianNameEn' },
                _this.lang == 'ar'
                    ? { title: 'نوع الطلب', field: 'requestTypeAr' }
                    : { title: 'Request Type', field: 'requestTypeEn' },
                _this.lang == 'ar'
                    ? { title: 'حالة الطلب', field: 'requestStatusAr' }
                    : { title: 'Request Status', field: 'requestStatusEn' },
                {
                    title: _this.lang == 'ar' ? ' تاريخ انشاء الطلب' : 'Request Creation Date',
                    field: 'createDate'
                },
                {
                    title: _this.lang == 'ar' ? ' تاريخ أخر تعديل للطلب' : 'Last Modification Date',
                    field: 'modificationDate'
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
    MaintenanceRequestsListComponent.prototype.editFormatIcon = function () {
        return "<i class='fa fa-edit'></i>";
    };
    ;
    MaintenanceRequestsListComponent.prototype.deleteFormatIcon = function () {
        return "<i class=' fa fa-trash'></i>";
    };
    ;
    MaintenanceRequestsListComponent.prototype.CheckBoxFormatIcon = function () {
        return "<input id='yourID' type='checkbox' />";
    };
    ;
    MaintenanceRequestsListComponent.prototype.onSearchTextChange = function (searchTxt) {
        this.searchFilters = [
            [
                { field: 'id', type: 'like', value: searchTxt },
                { field: 'tenantNameAr', type: 'like', value: searchTxt },
                { field: 'tenantNameEn', type: 'like', value: searchTxt },
                { field: 'unitNameAr', type: 'like', value: searchTxt },
                { field: 'unitNameEn', type: 'like', value: searchTxt },
                { field: 'serviceNameAr', type: 'like', value: searchTxt },
                { field: 'serviceNameEn', type: 'like', value: searchTxt },
                { field: 'technicianNameAr', type: 'like', value: searchTxt },
                { field: 'technicianNameEn', type: 'like', value: searchTxt },
                ,
            ],
        ];
    };
    MaintenanceRequestsListComponent.prototype.openAddMaintenanceRequests = function () { };
    MaintenanceRequestsListComponent.prototype.onMenuActionSelected = function (event) {
        if (event != null) {
            if (event.actionName == 'Edit' || event.actionName == 'DetermineTheTechnician') {
                this.edit(event.item.id);
                this.sharedServices.changeButton({
                    action: 'Update',
                    componentName: 'List'
                });
                this.sharedServices.changeToolbarPath(this.toolbarPathData);
            }
            else if (event.actionName == 'RequestDetails') {
                this.details(event.item.id);
            }
            else if (event.actionName == 'ProductReceipt') {
                this.productsReceipt(event.item.id);
            }
            else if (event.actionName == 'PriceRequest') {
                this.priceRequest(event.item.id);
            }
            else if (event.actionName == 'Delete') {
                this["delete"](event.item.id);
            }
            else if (event.actionName == 'CloseRequest') {
                this.showConfirmCloseRequestMessage(event.item);
            }
        }
    };
    MaintenanceRequestsListComponent.prototype.listenToClickedButton = function () {
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
    MaintenanceRequestsListComponent = __decorate([
        core_1.Component({
            selector: 'app-maintenance-requests-list',
            templateUrl: './maintenance-requests-list.component.html',
            styleUrls: ['./maintenance-requests-list.component.scss']
        })
    ], MaintenanceRequestsListComponent);
    return MaintenanceRequestsListComponent;
}());
exports.MaintenanceRequestsListComponent = MaintenanceRequestsListComponent;
