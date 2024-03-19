"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.UnitServicesListComponent = void 0;
var core_1 = require("@angular/core");
var enums_1 = require("src/app/core/constants/enumrators/enums");
var message_modal_component_1 = require("src/app/shared/message-modal/message-modal.component");
var PAGEID = 36; // from pages table in database seeding table
var UnitServicesListComponent = /** @class */ (function () {
    //#endregion
    //#region Constructor
    function UnitServicesListComponent(router, UnitServicesService, sharedServices, translate, rolesPerimssionsService, spinner, modalService, alertsService) {
        this.router = router;
        this.UnitServicesService = UnitServicesService;
        this.sharedServices = sharedServices;
        this.translate = translate;
        this.rolesPerimssionsService = rolesPerimssionsService;
        this.spinner = spinner;
        this.modalService = modalService;
        this.alertsService = alertsService;
        //#region Main Declarations
        this.UnitServices = [];
        this.addUrl = '/control-panel/settings/add-unit-service';
        this.updateUrl = '/control-panel/settings/update-unit-service/';
        this.listUrl = '/control-panel/settings/unit-services-list';
        this.toolbarPathData = {
            listPath: '',
            updatePath: this.updateUrl,
            addPath: this.addUrl,
            componentList: "menu.unit-services",
            componentAdd: "unit-services.add-unit-service"
        };
        //#region Tabulator
        this.panelId = 1;
        this.sortByCols = [];
        this.groupByCols = [];
        this.lang = '';
        this.columnNames = [];
        this.direction = 'ltr';
        this.subsList = [];
    }
    //#region ngOnDestory
    UnitServicesListComponent.prototype.ngOnDestroy = function () {
        this.subsList.forEach(function (s) {
            if (s) {
                s.unsubscribe();
            }
        });
    };
    //
    //#region ngOnInit
    UnitServicesListComponent.prototype.ngOnInit = function () {
        this.getPagePermissions(PAGEID);
        this.listenToClickedButton();
        this.sharedServices.changeButton({ action: 'List' });
        this.sharedServices.changeToolbarPath(this.toolbarPathData);
        this.defineGridColumn();
        this.getUnitServices();
    };
    UnitServicesListComponent.prototype.getPagePermissions = function (pageId) {
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
    //#endregion
    UnitServicesListComponent.prototype.getUnitServices = function () {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.UnitServicesService.getAll("GetAll").subscribe({
                next: function (res) {
                    _this.UnitServices = res.data.map(function (res) {
                        return res;
                    });
                    resolve();
                    //(("res", res);
                    //((" this.UnitServices", this.UnitServices);
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
    UnitServicesListComponent.prototype["delete"] = function (id) {
        if (this.userPermissions.isDelete) {
            this.showConfirmDeleteMessage(id);
        }
        else {
            this.showResponseMessage(true, enums_1.AlertTypes.warning, this.translate.transform("permissions.permission-denied"));
        }
    };
    UnitServicesListComponent.prototype.navigatetoupdate = function (id) {
        this.router.navigate([this.updateUrl, id]);
    };
    UnitServicesListComponent.prototype.navigate = function (urlroute) {
        this.router.navigate([urlroute]);
    };
    UnitServicesListComponent.prototype.edit = function (id) {
        this.sharedServices.changeButton({ action: 'Update' });
        this.router.navigate([this.updateUrl, id]);
    };
    UnitServicesListComponent.prototype.showConfirmDeleteMessage = function (id) {
        var _this = this;
        var modalRef = this.modalService.open(message_modal_component_1.MessageModalComponent);
        modalRef.componentInstance.message = this.translate.transform("messages.confirm-delete");
        modalRef.componentInstance.title = this.translate.transform("messages.delete");
        modalRef.componentInstance.isYesNo = true;
        modalRef.result.then(function (rs) {
            //((rs);
            if (rs == 'Confirm') {
                _this.spinner.show();
                _this.UnitServicesService.deleteWithUrl("delete?id=" + id).subscribe(function (resonse) {
                    //(('delete response', resonse);
                    if (resonse.success == true) {
                        _this.showResponseMessage(resonse.success, enums_1.AlertTypes.success, _this.translate.transform("messages.delete-success"));
                    }
                    else if (resonse.success == false) {
                        _this.showResponseMessage(resonse.success, enums_1.AlertTypes.success, _this.translate.transform("messages.delete-faild"));
                    }
                    _this.getUnitServices();
                });
                setTimeout(function () {
                    _this.spinner.hide();
                }, 500);
            }
        });
    };
    UnitServicesListComponent.prototype.showResponseMessage = function (responseStatus, alertType, message) {
        if (responseStatus == true && enums_1.AlertTypes.success == alertType) {
            this.alertsService.showSuccess(message, this.translate.transform("messageTitle.done"));
        }
        else if (responseStatus == true && enums_1.AlertTypes.warning) {
            this.alertsService.showWarning(message, this.translate.transform("messageTitle.alert"));
        }
        else if (responseStatus == true && enums_1.AlertTypes.info) {
            this.alertsService.showInfo(message, this.translate.transform("messageTitle.info"));
        }
        else if (responseStatus == false && enums_1.AlertTypes.error) {
            this.alertsService.showError(message, this.translate.transform("messageTitle.error"));
        }
    };
    UnitServicesListComponent.prototype.defineGridColumn = function () {
        var _this = this;
        this.sharedServices.getLanguage().subscribe(function (res) {
            _this.lang = res;
            _this.columnNames = [
                {
                    title: _this.lang == 'ar' ? ' الكود' : 'Id',
                    field: 'id'
                },
                _this.lang == 'ar'
                    ? { title: ' الاسم', field: 'unitServiceArName' }
                    : { title: ' Name  ', field: 'unitServiceEnName' },
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
                    }
            ];
        });
    };
    UnitServicesListComponent.prototype.editFormatIcon = function () {
        return "<i class='fa fa-edit'></i>";
    };
    ;
    UnitServicesListComponent.prototype.deleteFormatIcon = function () {
        return "<i class='fa fa-trash'></i>";
    };
    ;
    UnitServicesListComponent.prototype.CheckBoxFormatIcon = function () {
        return "<input id='yourID' type='checkbox' />";
    };
    ;
    UnitServicesListComponent.prototype.onSearchTextChange = function (searchTxt) {
        this.searchFilters = [
            [
                { field: 'nameAr', type: 'like', value: searchTxt },
                { field: 'nameEn', type: 'like', value: searchTxt },
                ,
            ],
        ];
    };
    UnitServicesListComponent.prototype.openAddUnitServices = function () { };
    UnitServicesListComponent.prototype.listenToClickedButton = function () {
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
    UnitServicesListComponent = __decorate([
        core_1.Component({
            selector: 'app-unit-services-list',
            templateUrl: './unit-services-list.component.html',
            styleUrls: ['./unit-services-list.component.scss']
        })
    ], UnitServicesListComponent);
    return UnitServicesListComponent;
}());
exports.UnitServicesListComponent = UnitServicesListComponent;
