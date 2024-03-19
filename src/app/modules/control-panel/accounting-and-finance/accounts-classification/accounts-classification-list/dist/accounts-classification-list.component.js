"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AccountsClassificationListComponent = void 0;
var core_1 = require("@angular/core");
var enums_1 = require("src/app/core/constants/enumrators/enums");
var message_modal_component_1 = require("src/app/shared/message-modal/message-modal.component");
var PAGEID = 62;
var AccountsClassificationListComponent = /** @class */ (function () {
    //#endregion
    //#region Constructor
    function AccountsClassificationListComponent(router, AccountsClassificationService, sharedService, translate, spinner, rolesPerimssionsService, modalService, store, alertsService) {
        this.router = router;
        this.AccountsClassificationService = AccountsClassificationService;
        this.sharedService = sharedService;
        this.translate = translate;
        this.spinner = spinner;
        this.rolesPerimssionsService = rolesPerimssionsService;
        this.modalService = modalService;
        this.store = store;
        this.alertsService = alertsService;
        //#region Main Declarations
        this.accountsClassification = [];
        this.subsList = [];
        this.addUrl = '/control-panel/accounting/add-account-classification';
        this.updateUrl = '/control-panel/accounting/update-account-classification/';
        this.listUrl = '/control-panel/accounting/accounts-classification-list';
        this.toolbarPathData = {
            listPath: '',
            updatePath: this.updateUrl,
            addPath: this.addUrl,
            componentList: "sidebar.accounts-classification",
            componentAdd: "accounts-classification.add-account-classification"
        };
        //#endregion
        //#region Tabulator
        this.panelId = 1;
        this.sortByCols = [];
        this.groupByCols = [];
        this.lang = '';
        this.columnNames = [];
        this.direction = 'ltr';
    }
    //#endregion
    AccountsClassificationListComponent.prototype.ngOnInit = function () {
        this.getPagePermissions(PAGEID);
        this.listenToClickedButton();
        this.sharedService.changeButton({ action: 'List' });
        this.sharedService.changeToolbarPath(this.toolbarPathData);
        this.getAccountsClassification();
        this.defineGridColumn();
    };
    //#region ngOnDestory
    AccountsClassificationListComponent.prototype.ngOnDestroy = function () {
        this.subsList.forEach(function (s) {
            if (s) {
                s.unsubscribe();
            }
        });
    };
    //#endregion
    //#region methods
    AccountsClassificationListComponent.prototype.getAccountsClassification = function () {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.AccountsClassificationService.getAll("GetAll").subscribe({
                next: function (res) {
                    _this.accountsClassification = res.data.map(function (res) {
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
    AccountsClassificationListComponent.prototype["delete"] = function (id) {
        if (this.userPermissions.isDelete) {
            this.showConfirmDeleteMessage(id);
        }
        else {
            this.showResponseMessage(true, enums_1.AlertTypes.warning, this.translate.transform("permissions.permission-denied"));
        }
    };
    AccountsClassificationListComponent.prototype.navigatetoupdate = function (id) {
        this.router.navigate(['/control-panel/accounting/update-account-classification', id]);
    };
    AccountsClassificationListComponent.prototype.navigate = function (urlroute) {
        this.router.navigate([urlroute]);
    };
    AccountsClassificationListComponent.prototype.edit = function (id) {
        this.sharedService.changeButton({ action: 'Update' });
        this.router.navigate([this.updateUrl, id]);
    };
    AccountsClassificationListComponent.prototype.showConfirmDeleteMessage = function (id) {
        var _this = this;
        var modalRef = this.modalService.open(message_modal_component_1.MessageModalComponent);
        modalRef.componentInstance.message = this.translate.transform('messages.confirm-delete');
        modalRef.componentInstance.title =
            this.translate.transform('messages.delete');
        modalRef.componentInstance.isYesNo = true;
        modalRef.result.then(function (rs) {
            //((rs);
            if (rs == 'Confirm') {
                _this.spinner.show();
                ;
                _this.AccountsClassificationService.deleteWithUrl("delete?id=" + id).subscribe(function (resonse) {
                    if (resonse.success == true) {
                        _this.showResponseMessage(resonse.success, enums_1.AlertTypes.success, _this.translate.transform("messages.delete-success"));
                    }
                    else if (resonse.success == false) {
                        _this.showResponseMessage(resonse.success, enums_1.AlertTypes.error, resonse.message);
                    }
                });
                setTimeout(function () {
                    _this.spinner.hide();
                    _this.getAccountsClassification();
                }, 500);
            }
        });
    };
    AccountsClassificationListComponent.prototype.showResponseMessage = function (responseStatus, alertType, message) {
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
    AccountsClassificationListComponent.prototype.getPagePermissions = function (pageId) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.rolesPerimssionsService.getAll("GetPagePermissionById?pageId=" + pageId).subscribe({
                next: function (res) {
                    _this.rolePermission = JSON.parse(JSON.stringify(res.data));
                    _this.userPermissions = JSON.parse(_this.rolePermission.permissionJson);
                    _this.sharedService.setUserPermissions(_this.userPermissions);
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
    AccountsClassificationListComponent.prototype.defineGridColumn = function () {
        var _this = this;
        this.sharedService.getLanguage().subscribe(function (res) {
            _this.lang = res;
            _this.columnNames = [
                { title: _this.lang == 'ar' ? 'أسم تصنيف الحساب' : 'Account classification name', field: _this.lang == 'ar' ? 'classificationArName' : 'classificationEnName' },
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
    AccountsClassificationListComponent.prototype.editFormatIcon = function () {
        return "<i class=' fa fa-edit'></i>";
    };
    ;
    AccountsClassificationListComponent.prototype.deleteFormatIcon = function () {
        return "<i class=' fa fa-trash'></i>";
    };
    ;
    AccountsClassificationListComponent.prototype.CheckBoxFormatIcon = function () {
        return "<input id='yourID' type='checkbox' />";
    };
    ;
    AccountsClassificationListComponent.prototype.openAddAccounts = function () { };
    AccountsClassificationListComponent.prototype.onSearchTextChange = function (searchTxt) {
        this.searchFilters = [
            [
                { field: 'classificationArName', type: 'like', value: searchTxt },
                { field: 'classificationEnName', type: 'like', value: searchTxt }
            ],
        ];
    };
    AccountsClassificationListComponent.prototype.openAddAccountsClassification = function () { };
    AccountsClassificationListComponent.prototype.listenToClickedButton = function () {
        var _this = this;
        var sub = this.sharedService.getClickedbutton().subscribe({
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
    AccountsClassificationListComponent = __decorate([
        core_1.Component({
            selector: 'app-accounts-classification-list',
            templateUrl: './accounts-classification-list.component.html',
            styleUrls: ['./accounts-classification-list.component.scss']
        })
    ], AccountsClassificationListComponent);
    return AccountsClassificationListComponent;
}());
exports.AccountsClassificationListComponent = AccountsClassificationListComponent;
