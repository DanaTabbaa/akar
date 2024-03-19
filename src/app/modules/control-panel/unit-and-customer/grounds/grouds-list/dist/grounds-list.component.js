"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.GroundsListComponent = void 0;
var core_1 = require("@angular/core");
var enums_1 = require("src/app/core/constants/enumrators/enums");
var message_modal_component_1 = require("src/app/shared/message-modal/message-modal.component");
var PAGEID = 9; // from pages table in database seeding table
var GroundsListComponent = /** @class */ (function () {
    function GroundsListComponent(GroundsService, router, sharedServices, modalService, rolesPerimssionsService, translate, alertsService, spinner) {
        this.GroundsService = GroundsService;
        this.router = router;
        this.sharedServices = sharedServices;
        this.modalService = modalService;
        this.rolesPerimssionsService = rolesPerimssionsService;
        this.translate = translate;
        this.alertsService = alertsService;
        this.spinner = spinner;
        this.addUrl = '/control-panel/definitions/add-ground';
        this.updateUrl = '/control-panel/definitions/update-ground/';
        this.listUrl = '/control-panel/definitions/grounds-list';
        this.toolbarPathData = {
            listPath: this.listUrl,
            addPath: '',
            updatePath: this.updateUrl,
            componentList: this.translate.transform("component-names.list-grounds"),
            componentAdd: ''
        };
        //Properties
        this.grounds = [];
        this.subsList = [];
        //#endregion
        //#region Tabulator
        this.buildings = [];
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
    //
    //#region ngOnInit
    GroundsListComponent.prototype.ngOnInit = function () {
        this.getPagePermissions(PAGEID);
        this.defineGridColumn();
        this.getGrounds();
        this.listenToClickedButton();
        this.sharedServices.changeButton({ action: 'List' });
        this.sharedServices.changeToolbarPath(this.toolbarPathData);
    };
    //
    //#region ngOnDestory
    GroundsListComponent.prototype.ngOnDestroy = function () {
        this.subsList.forEach(function (s) {
            if (s) {
                s.unsubscribe();
            }
        });
    };
    GroundsListComponent.prototype.getPagePermissions = function (pageId) {
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
    //#region Basic Data
    GroundsListComponent.prototype.getGrounds = function () {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.GroundsService.getAll("GetAll").subscribe({
                next: function (res) {
                    _this.grounds = res.data.map(function (res) {
                        return res;
                    });
                    resolve();
                    //(("res", res);
                    //((" this.grounds", this.grounds);
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
    GroundsListComponent.prototype["delete"] = function (id) {
        if (this.userPermissions.isDelete) {
            this.showConfirmDeleteMessage(id);
        }
        else {
            this.showResponseMessage(true, enums_1.AlertTypes.warning, this.translate.transform("permissions.permission-denied"));
        }
    };
    GroundsListComponent.prototype.edit = function (id) {
        this.router.navigate(['/control-panel/definitions/update-ground', id]);
    }; //#region Toolbar Service
    GroundsListComponent.prototype.listenToClickedButton = function () {
        var _this = this;
        var sub = this.sharedServices.getClickedbutton().subscribe({
            next: function (currentBtn) {
                currentBtn;
                if (currentBtn != null) {
                    if (currentBtn.action == enums_1.ToolbarActions.List) {
                    }
                    else if (currentBtn.action == enums_1.ToolbarActions.New) {
                        _this.router.navigate(['/control-panel/definitions/add-ground']);
                    }
                }
            }
        });
        this.subsList.push(sub);
    };
    GroundsListComponent.prototype.defineGridColumn = function () {
        var _this = this;
        this.sharedServices.getLanguage().subscribe(function (res) {
            _this.lang = res;
            _this.columnNames = [
                _this.lang == 'ar'
                    ? { title: 'أسم الأرض', field: 'groundNameAr' }
                    : { title: 'Ground', field: 'groundNameEn' },
                _this.lang == 'ar'
                    ? { title: ' المالك السابق ', field: 'previousOwnerNameAr' }
                    : { title: ' Previous Owner  ', field: 'previousOwnerNameEn' },
                _this.lang == 'ar'
                    ? { title: ' المالك ', field: 'ownerNameAr' }
                    : { title: ' Owner  ', field: 'ownerNameEn' },
                {
                    title: _this.lang == 'ar' ? ' المساحة' : ' Area Size  ',
                    field: 'areaSize'
                },
                {
                    title: _this.lang == 'ar' ? 'سعر المتر' : 'Meter Price ',
                    field: 'meterPrice'
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
    GroundsListComponent.prototype.editFormatIcon = function () {
        return "<i class=' fa fa-edit'></i>";
    };
    ;
    GroundsListComponent.prototype.deleteFormatIcon = function () {
        return "<i class=' fa fa-trash'></i>";
    };
    ;
    GroundsListComponent.prototype.CheckBoxFormatIcon = function () {
        return "<input id='yourID' type='checkbox' />";
    };
    ;
    GroundsListComponent.prototype.onSearchTextChange = function (searchTxt) {
        this.searchFilters = [
            [
                { field: 'groundNameAr', type: 'like', value: searchTxt },
                { field: 'groundNameEn', type: 'like', value: searchTxt },
                ,
            ],
        ];
    };
    GroundsListComponent.prototype.openAddGround = function () { };
    GroundsListComponent.prototype.onMenuActionSelected = function (event) {
        if (event != null) {
            if (event.actionName == 'Edit') {
                this.edit(event.item.id);
                this.sharedServices.changeButton({ action: 'Update' });
                this.sharedServices.changeToolbarPath(this.toolbarPathData);
            }
            else if (event.actionName == 'Delete') {
                this["delete"](event.item.id);
            }
        }
    };
    //#endregion
    //#region Helper
    //#region Helper Functions
    GroundsListComponent.prototype.showConfirmDeleteMessage = function (id) {
        var _this = this;
        var modalRef = this.modalService.open(message_modal_component_1.MessageModalComponent);
        modalRef.componentInstance.message = this.translate.transform('messages.confirm-delete');
        modalRef.componentInstance.title = this.translate.transform('buttons.delete');
        modalRef.componentInstance.isYesNo = true;
        modalRef.result.then(function (rs) {
            //((rs);
            if (rs == 'Confirm') {
                var sub = _this.GroundsService.deleteWithResponse("Delete?Id=" + id).subscribe(function (resonse) {
                    //reloadPage()
                    _this.getGrounds();
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
    GroundsListComponent.prototype.showResponseMessage = function (responseStatus, alertType, message) {
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
    GroundsListComponent = __decorate([
        core_1.Component({
            selector: 'app-grounds-list',
            templateUrl: './grounds-list.component.html',
            styleUrls: ['./grounds-list.component.scss']
        })
    ], GroundsListComponent);
    return GroundsListComponent;
}());
exports.GroundsListComponent = GroundsListComponent;
