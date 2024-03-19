"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.MaintenanceBillsListComponent = void 0;
var core_1 = require("@angular/core");
var enums_1 = require("src/app/core/constants/enumrators/enums");
var message_modal_component_1 = require("src/app/shared/message-modal/message-modal.component");
var PAGEID = 32; // from pages table in database seeding table
var MaintenanceBillsListComponent = /** @class */ (function () {
    //#endregion
    //#region Constructor
    function MaintenanceBillsListComponent(maintenanceBillsService, router, sharedServices, alertsService, rolesPerimssionsService, modalService, translate) {
        this.maintenanceBillsService = maintenanceBillsService;
        this.router = router;
        this.sharedServices = sharedServices;
        this.alertsService = alertsService;
        this.rolesPerimssionsService = rolesPerimssionsService;
        this.modalService = modalService;
        this.translate = translate;
        //#region Main Declarations
        this.maintenanceBills = [];
        this.addUrl = '/control-panel/maintenance/add-maintenance-bill';
        this.updateUrl = '/control-panel/maintenance/update-maintenance-bill/';
        this.listUrl = '/control-panel/maintenance/maintenance-bills-list';
        this.toolbarPathData = {
            listPath: '',
            updatePath: this.updateUrl,
            addPath: this.addUrl,
            componentList: "menu.maintenance-bills",
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
    MaintenanceBillsListComponent.prototype.ngOnInit = function () {
        this.getPagePermissions(PAGEID);
        this.defineGridColumn();
    };
    MaintenanceBillsListComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.listenToClickedButton();
        this.getMaintenanceBills();
        setTimeout(function () {
            _this.sharedServices.changeButton({ action: 'List' });
            _this.sharedServices.changeToolbarPath(_this.toolbarPathData);
        }, 300);
    };
    //#endregion
    //#region ngOnDestroy
    MaintenanceBillsListComponent.prototype.ngOnDestroy = function () {
        this.subsList.forEach(function (s) {
            if (s) {
                s.unsubscribe();
            }
        });
    };
    MaintenanceBillsListComponent.prototype.getPagePermissions = function (pageId) {
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
    MaintenanceBillsListComponent.prototype.getMaintenanceBills = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var sub = _this.maintenanceBillsService.getWithResponse("GetAllVM").subscribe({
                next: function (res) {
                    //((res);
                    //let data =
                    //   res.data.map((res: PeopleOfBenefitsVM[]) => {
                    //   return res;
                    // });
                    if (res.success) {
                        _this.maintenanceBills = JSON.parse(JSON.stringify(res.data));
                    }
                    resolve();
                },
                error: function (err) {
                    reject(err);
                },
                complete: function () {
                }
            });
            _this.subsList.push(sub);
        });
    };
    //#endregion
    //#region CRUD Operations
    MaintenanceBillsListComponent.prototype["delete"] = function (id) {
        if (this.userPermissions.isDelete) {
            this.showConfirmDeleteMessage(id);
        }
        else {
            this.showResponseMessage(true, enums_1.AlertTypes.warning, this.translate.transform("permissions.permission-denied"));
        }
    };
    MaintenanceBillsListComponent.prototype.edit = function (id) {
        this.sharedServices.changeButton({ action: 'Update' });
        this.router.navigate(['/control-panel/maintenance/update-maintenance-bill', id]);
    };
    //#endregion
    //#region Helper Functions
    MaintenanceBillsListComponent.prototype.showResponseMessage = function (responseStatus, alertType, message) {
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
    MaintenanceBillsListComponent.prototype.openMaintenanceBills = function () { };
    MaintenanceBillsListComponent.prototype.showConfirmDeleteMessage = function (id) {
        var _this = this;
        var modalRef = this.modalService.open(message_modal_component_1.MessageModalComponent);
        modalRef.componentInstance.message = this.translate.transform('messages.confirm-delete');
        modalRef.componentInstance.title = this.translate.transform('buttons.delete');
        modalRef.componentInstance.isYesNo = true;
        modalRef.result.then(function (rs) {
            //((rs);
            if (rs == 'Confirm') {
                var sub = _this.maintenanceBillsService.deleteWithResponse("Delete?Id=" + id).subscribe(function (resonse) {
                    //reloadPage()
                    _this.getMaintenanceBills();
                    if (resonse.success == true) {
                        _this.showResponseMessage(resonse.success, enums_1.AlertTypes.warning, resonse.message);
                    }
                    else if (resonse.success == false) {
                        _this.showResponseMessage(resonse.success, enums_1.AlertTypes.error, resonse.message);
                    }
                });
                _this.subsList.push(sub);
            }
        });
    };
    MaintenanceBillsListComponent.prototype.defineGridColumn = function () {
        var _this = this;
        this.sharedServices.getLanguage().subscribe(function (res) {
            _this.lang = res;
            _this.columnNames = [
                {
                    title: _this.lang == 'ar' ? ' رقم ' : 'Number',
                    field: 'id'
                },
                {
                    title: _this.lang == 'ar' ? ' تاريخ الفاتورة ' : 'Bill Date',
                    field: 'date'
                },
                {
                    title: _this.lang == 'ar' ? 'رقم طلب الصيانة' : 'Maintenance Request Id',
                    field: 'maintenanceRequestId'
                },
                _this.lang == 'ar'
                    ? { title: 'المستأجر', field: 'tenantNameAr' }
                    : { title: 'Tenant', field: 'tenantNameEn' },
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
    MaintenanceBillsListComponent.prototype.editFormatIcon = function () {
        return "<i class=' fa fa-edit'></i>";
    };
    ;
    MaintenanceBillsListComponent.prototype.deleteFormatIcon = function () {
        return "<i class=' fa fa-trash'></i>";
    };
    ;
    MaintenanceBillsListComponent.prototype.CheckBoxFormatIcon = function () {
        return "<input id='yourID' type='checkbox' />";
    };
    ;
    MaintenanceBillsListComponent.prototype.onSearchTextChange = function (searchTxt) {
        this.searchFilters = [
            [
                { field: 'id', type: 'like', value: searchTxt },
                { field: 'maintenanceRequestId', type: 'like', value: searchTxt },
                { field: 'tenantNameAr', type: 'like', value: searchTxt },
                { field: 'tenantNameEn', type: 'like', value: searchTxt },
            ],
        ];
    };
    MaintenanceBillsListComponent.prototype.openPeopleOfBenefits = function () { };
    MaintenanceBillsListComponent.prototype.onMenuActionSelected = function (event) {
        if (event != null) {
            if (event.actionName == 'Edit') {
                ;
                this.edit(event.item.id);
                this.sharedServices.changeButton({
                    action: 'Update',
                    componentName: 'List',
                    submitMode: false
                });
                this.sharedServices.changeToolbarPath(this.toolbarPathData);
                // this.router.navigate(['control-panel/maintenance/update-maintenance-bill/'+event.item.id])
            }
            else if (event.actionName == 'Delete') {
                this["delete"](event.item.id);
            }
        }
    };
    MaintenanceBillsListComponent.prototype.listenToClickedButton = function () {
        var _this = this;
        var sub = this.sharedServices.getClickedbutton().subscribe({
            next: function (currentBtn) {
                //currentBtn;
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
    MaintenanceBillsListComponent = __decorate([
        core_1.Component({
            selector: 'app-maintenance-bills-list',
            templateUrl: './maintenance-bills-list.component.html',
            styleUrls: ['./maintenance-bills-list.component.scss']
        })
    ], MaintenanceBillsListComponent);
    return MaintenanceBillsListComponent;
}());
exports.MaintenanceBillsListComponent = MaintenanceBillsListComponent;
