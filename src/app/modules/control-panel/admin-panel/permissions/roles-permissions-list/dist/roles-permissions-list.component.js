"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.RolesPermissionsListComponent = void 0;
var core_1 = require("@angular/core");
var enums_1 = require("src/app/core/constants/enumrators/enums");
var message_modal_component_1 = require("src/app/shared/message-modal/message-modal.component");
var PAGEID = 3;
var RolesPermissionsListComponent = /** @class */ (function () {
    //#endregion
    //#region Constructor
    function RolesPermissionsListComponent(router, sharedServices, modalService, translate, alertsService, spinner, rolesPermissionsService, rolesService, rolesPerimssionsService) {
        this.router = router;
        this.sharedServices = sharedServices;
        this.modalService = modalService;
        this.translate = translate;
        this.alertsService = alertsService;
        this.spinner = spinner;
        this.rolesPermissionsService = rolesPermissionsService;
        this.rolesService = rolesService;
        this.rolesPerimssionsService = rolesPerimssionsService;
        //#region Main Declarations
        this.roles = [];
        this.subsList = [];
        this.addUrl = '/control-panel/admin-panel/add-role-permissions';
        this.updateUrl = '/control-panel/admin-panel/update-role-permissions/';
        this.listUrl = '/control-panel/admin-panel/roles-permissions';
        this.toolbarPathData = {
            pageId: 3,
            listPath: this.listUrl,
            addPath: '',
            updatePath: this.updateUrl,
            componentList: 'component-names.list-roles-permissions',
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
    }
    //#endregion
    //#region ngOnInit
    RolesPermissionsListComponent.prototype.ngOnInit = function () {
        this.getPagePermissions(PAGEID);
        this.sharedServices.changeButton({ action: 'List' });
        this.sharedServices.changeToolbarPath(this.toolbarPathData);
        this.defineGridColumn();
        this.GetAllRolesPermissions();
        this.listenToClickedButton();
    };
    //#endregion
    //#region ngOnDestroy
    RolesPermissionsListComponent.prototype.ngOnDestroy = function () {
        this.subsList.forEach(function (s) {
            if (s) {
                s.unsubscribe();
            }
        });
    };
    RolesPermissionsListComponent.prototype.getPagePermissions = function (pageId) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.rolesPerimssionsService.getAll("GetPagePermissionById?pageId=" + pageId).subscribe({
                next: function (res) {
                    _this.rolePermission = JSON.parse(JSON.stringify(res.data));
                    var userPermissions = JSON.parse(_this.rolePermission.permissionJson);
                    _this.sharedServices.setUserPermissions(userPermissions);
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
    RolesPermissionsListComponent.prototype.GetAllRolesPermissions = function () {
        var _this = this;
        this.spinner.show();
        var promise = new Promise(function (resolve, reject) {
            _this.rolesService.getAll("GetAll").subscribe({
                next: function (res) {
                    _this.roles = JSON.parse(JSON.stringify(res.data));
                    resolve();
                    //(("res", res);
                    //((" this.roles", this.roles);
                    setTimeout(function () {
                        _this.spinner.hide();
                    },500);
                },
                error: function (err) {
                    reject(err);
                    _this.spinner.hide();
                },
                complete: function () {
                    _this.spinner.hide();
                }
            });
        });
        return promise;
    };
    //#endregion
    //#region CRUD Operations
    RolesPermissionsListComponent.prototype.edit = function (id) {
        this.sharedServices.changeButton({ action: 'Update', submitMode: false });
        this.router.navigate(['/control-panel/admin-panel/update-role-permissions/', id]);
    }; //#region Toolbar Service
    RolesPermissionsListComponent.prototype.listenToClickedButton = function () {
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
    RolesPermissionsListComponent.prototype.defineGridColumn = function () {
        var _this = this;
        this.sharedServices.getLanguage().subscribe(function (res) {
            _this.lang = res;
            _this.columnNames = [
                {
                    title: _this.lang == 'ar' ? 'الرقم' : ' Code ',
                    field: 'id'
                },
                _this.lang == 'ar'
                    ? { title: ' الدور ', field: 'roleNameAr' }
                    : { title: 'Role  ', field: 'roleNameEn' },
                {
                    title: _this.lang == 'ar' ? 'ملاحظات' : ' Remarks ',
                    field: 'remark'
                },
                _this.lang == "ar" ? {
                    title: "حذف",
                    field: "", formatter: _this.deleteFormatIcon,
                    cellClick: function (e, cell) {
                        _this.showConfirmDeleteMessage(cell.getRow().getData().id);
                    }
                } :
                    {
                        title: "Delete",
                        field: "", formatter: _this.deleteFormatIcon,
                        cellClick: function (e, cell) {
                            _this.showConfirmDeleteMessage(cell.getRow().getData().id);
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
    RolesPermissionsListComponent.prototype.editFormatIcon = function () {
        return "<i class=' fa fa-edit'></i>";
    };
    ;
    RolesPermissionsListComponent.prototype.deleteFormatIcon = function () {
        return "<i class=' fa fa-trash'></i>";
    };
    ;
    RolesPermissionsListComponent.prototype.CheckBoxFormatIcon = function () {
        return "<input id='yourID' type='checkbox' />";
    };
    ;
    RolesPermissionsListComponent.prototype.onSearchTextChange = function (searchTxt) {
        this.searchFilters = [
            [
                { field: 'buildingNameAr', type: 'like', value: searchTxt },
                { field: 'buildingNameEn', type: 'like', value: searchTxt },
                ,
            ],
        ];
    };
    RolesPermissionsListComponent.prototype.openAddRoles = function () { };
    RolesPermissionsListComponent.prototype.onMenuActionSelected = function (event) {
        if (event != null) {
            if (event.actionName == 'Edit') {
                this.edit(event.item.id);
                this.sharedServices.changeButton({ action: 'Update' });
                this.sharedServices.changeToolbarPath(this.toolbarPathData);
            }
            else if (event.actionName == 'Delete') {
                this.showConfirmDeleteMessage(event.item.id);
            }
        }
    };
    //#endregion
    //#region Helper
    //#region Helper Functions
    RolesPermissionsListComponent.prototype.showConfirmDeleteMessage = function (id) {
        var _this = this;
        var modalRef = this.modalService.open(message_modal_component_1.MessageModalComponent);
        modalRef.componentInstance.message = this.translate.transform('messages.confirm-delete');
        modalRef.componentInstance.title = this.translate.transform('buttons.delete');
        modalRef.componentInstance.isYesNo = true;
        modalRef.result.then(function (rs) {
            //((rs);
            if (rs == 'Confirm') {
                var sub = _this.rolesService.deleteWithResponse("Delete?Id=" + id).subscribe(function (resonse) {
                    //reloadPage()
                    _this.GetAllRolesPermissions();
                    if (resonse.success == true) {
                        _this.spinner.show();
                        _this.showResponseMessage(resonse.success, enums_1.AlertTypes.success, _this.translate.transform("messages.delete-success"));
                    }
                    else if (resonse.success == false) {
                        _this.showResponseMessage(resonse.success, enums_1.AlertTypes.error, resonse.message);
                    }
                });
                setTimeout(function () {
                    _this.spinner.hide();
                },500);
                _this.subsList.push(sub);
            }
        });
    };
    RolesPermissionsListComponent.prototype.showResponseMessage = function (responseStatus, alertType, message) {
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
    RolesPermissionsListComponent = __decorate([
        core_1.Component({
            selector: 'app-roles-permissions-list',
            templateUrl: './roles-permissions-list.component.html',
            styleUrls: ['./roles-permissions-list.component.scss']
        })
    ], RolesPermissionsListComponent);
    return RolesPermissionsListComponent;
}());
exports.RolesPermissionsListComponent = RolesPermissionsListComponent;
