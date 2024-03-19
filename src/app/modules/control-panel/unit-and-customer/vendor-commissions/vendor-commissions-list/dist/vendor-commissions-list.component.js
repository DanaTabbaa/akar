"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.VendorCommissionsListComponent = void 0;
var core_1 = require("@angular/core");
var enums_1 = require("src/app/core/constants/enumrators/enums");
var message_modal_component_1 = require("src/app/shared/message-modal/message-modal.component");
var PAGEID = 16; // from pages table in database seeding table
var VendorCommissionsListComponent = /** @class */ (function () {
    //#endregion
    //#region Constructor
    function VendorCommissionsListComponent(VendorCommissionsService, sharedServices, alertsService, modalService, rolesPerimssionsService, translate, router) {
        this.VendorCommissionsService = VendorCommissionsService;
        this.sharedServices = sharedServices;
        this.alertsService = alertsService;
        this.modalService = modalService;
        this.rolesPerimssionsService = rolesPerimssionsService;
        this.translate = translate;
        this.router = router;
        //#region Main Declarations
        this.VendorCommissions = [];
        this.addUrl = '/control-panel/definitions/add-vendor-commission';
        this.updateUrl = '/control-panel/definitions/update-vendor-commission/';
        this.listUrl = '/control-panel/definitions/vendor-commissions-list';
        this.toolbarPathData = {
            listPath: '',
            updatePath: this.updateUrl,
            addPath: this.addUrl,
            componentList: "component-names.list-vendors-commissions",
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
    VendorCommissionsListComponent.prototype.ngOnInit = function () {
        this.getPagePermissions(PAGEID);
        this.listenToClickedButton();
        this.sharedServices.changeButton({ action: 'List' });
        this.sharedServices.changeToolbarPath(this.toolbarPathData);
        this.getVendorCommissions();
        this.defineGridColumn();
    };
    //#endregion
    //#region ngOnDestroy
    VendorCommissionsListComponent.prototype.ngOnDestroy = function () {
        this.subsList.forEach(function (s) {
            if (s) {
                s.unsubscribe();
            }
        });
    };
    VendorCommissionsListComponent.prototype.getPagePermissions = function (pageId) {
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
    //#region  State Management
    //#endregion
    //#region Basic Data
    ///Geting form dropdown list data
    VendorCommissionsListComponent.prototype.getVendorCommissions = function () {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.VendorCommissionsService.getAll("GetAll").subscribe({
                next: function (res) {
                    _this.VendorCommissions = res.data.map(function (res) {
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
    //#endregion
    //#region CRUD Operations
    VendorCommissionsListComponent.prototype["delete"] = function (id) {
        if (this.userPermissions.isDelete) {
            this.showConfirmDeleteMessage(id);
        }
        else {
            this.showResponseMessage(true, enums_1.AlertTypes.warning, this.translate.transform("permissions.permission-denied"));
        }
    };
    VendorCommissionsListComponent.prototype.edit = function (id) {
        this.sharedServices.changeButton({ action: 'Update', submitMode: false });
        this.router.navigate(['/control-panel/definitions/update-vendor-commission', id]);
    };
    //#endregion
    //#region Helper Functions
    VendorCommissionsListComponent.prototype.showResponseMessage = function (responseStatus, alertType, message) {
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
    VendorCommissionsListComponent.prototype.showConfirmDeleteMessage = function (id) {
        var _this = this;
        var modalRef = this.modalService.open(message_modal_component_1.MessageModalComponent);
        modalRef.componentInstance.message = this.translate.transform("messages.confirm-delete");
        modalRef.componentInstance.title = this.translate.transform("messages.delete");
        modalRef.componentInstance.isYesNo = true;
        modalRef.result.then(function (rs) {
            //((rs);
            if (rs == 'Confirm') {
                _this.VendorCommissionsService["delete"](id).subscribe(function (resonse) {
                    //(('delet response', resonse);
                    _this.getVendorCommissions();
                    if (resonse.success == true) {
                        _this.showResponseMessage(resonse.success, enums_1.AlertTypes.success, _this.translate.transform("messages.delete-success"));
                    }
                    else if (resonse.success == false) {
                        _this.showResponseMessage(resonse.success, enums_1.AlertTypes.error, resonse.message);
                    }
                });
            }
        });
    };
    VendorCommissionsListComponent.prototype.defineGridColumn = function () {
        var _this = this;
        this.sharedServices.getLanguage().subscribe(function (res) {
            _this.lang = res;
            _this.columnNames = [
                _this.lang == 'ar'
                    ? { title: ' العمولة', field: 'nameAr' }
                    : { title: ' Commission  ', field: 'nameEn' },
                _this.lang == 'ar'
                    ? { title: ' المندوب', field: 'vendorNameAr' }
                    : { title: ' vendor  ', field: 'vendorNameEn' },
                {
                    title: _this.lang == 'ar' ? 'القيمة ' : ' Value',
                    field: 'value'
                },
                {
                    title: _this.lang == 'ar' ? 'نسبة' : ' Ratio',
                    field: 'ratio'
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
    VendorCommissionsListComponent.prototype.editFormatIcon = function () {
        return "<i class=' fa fa-edit'></i>";
    };
    ;
    VendorCommissionsListComponent.prototype.deleteFormatIcon = function () {
        return "<i class=' fa fa-trash'></i>";
    };
    ;
    VendorCommissionsListComponent.prototype.CheckBoxFormatIcon = function () {
        return "<input id='yourID' type='checkbox' />";
    };
    ;
    VendorCommissionsListComponent.prototype.onSearchTextChange = function (searchTxt) {
        this.searchFilters = [
            [
                { field: 'nameEn', type: 'like', value: searchTxt },
                { field: 'nameAr', type: 'like', value: searchTxt },
                ,
            ],
        ];
    };
    VendorCommissionsListComponent.prototype.openVendorCommissions = function () { };
    VendorCommissionsListComponent.prototype.onMenuActionSelected = function (event) {
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
                this.showConfirmDeleteMessage(event.item.id);
            }
        }
    };
    VendorCommissionsListComponent.prototype.listenToClickedButton = function () {
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
    VendorCommissionsListComponent = __decorate([
        core_1.Component({
            selector: 'app-vendor-commissions-list',
            templateUrl: './vendor-commissions-list.component.html',
            styleUrls: ['./vendor-commissions-list.component.scss']
        })
    ], VendorCommissionsListComponent);
    return VendorCommissionsListComponent;
}());
exports.VendorCommissionsListComponent = VendorCommissionsListComponent;
