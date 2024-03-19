"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CurrenciesListComponent = void 0;
var core_1 = require("@angular/core");
var enums_1 = require("src/app/core/constants/enumrators/enums");
var message_modal_component_1 = require("src/app/shared/message-modal/message-modal.component");
var PAGEID = 43; // from pages table in database seeding table
var CurrenciesListComponent = /** @class */ (function () {
    function CurrenciesListComponent(router, modalService, rolesPerimssionsService, sharedServices, alertsService, translate, spinner, CurrenciesService) {
        this.router = router;
        this.modalService = modalService;
        this.rolesPerimssionsService = rolesPerimssionsService;
        this.sharedServices = sharedServices;
        this.alertsService = alertsService;
        this.translate = translate;
        this.spinner = spinner;
        this.CurrenciesService = CurrenciesService;
        this.lang = "";
        //#endregion
        this.currencies = [];
        this.addUrl = '/control-panel/settings/add-currency';
        this.updateUrl = '/control-panel/settings/update-currency/';
        this.listUrl = '/control-panel/settings/currencies-list';
        this.toolbarPathData = {
            listPath: '',
            updatePath: this.updateUrl,
            addPath: this.addUrl,
            componentList: "component-names.list-currencies",
            componentAdd: ''
        };
        //#region Tabulator
        this.panelId = 1;
        this.sortByCols = [];
        this.groupByCols = [];
        this.columnNames = [];
        this.menuOptions = {
            showDelete: true,
            showEdit: true
        };
        this.direction = 'ltr';
        this.subsList = [];
    }
    CurrenciesListComponent.prototype.ngOnInit = function () {
        this.getPagePermissions(PAGEID);
        this.listenToClickedButton();
        this.sharedServices.changeButton({ action: 'List' });
        this.sharedServices.changeToolbarPath(this.toolbarPathData);
        this.getCurrencies();
        this.defineGridColumn();
    };
    //#region ngOnDestroy
    CurrenciesListComponent.prototype.ngOnDestroy = function () {
        this.subsList.forEach(function (s) {
            if (s) {
                s.unsubscribe();
            }
        });
    };
    CurrenciesListComponent.prototype.getPagePermissions = function (pageId) {
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
    CurrenciesListComponent.prototype.getCurrencies = function () {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.CurrenciesService.getAll("GetAll").subscribe({
                next: function (res) {
                    _this.currencies = res.data.map(function (res) {
                        return res;
                    });
                    resolve();
                    //(("res", res);
                    //((" this.currencies", this.currencies);
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
    CurrenciesListComponent.prototype["delete"] = function (id) {
        if (this.userPermissions.isDelete) {
            this.showConfirmDeleteMessage(id);
        }
        else {
            this.showResponseMessage(true, enums_1.AlertTypes.warning, this.translate.transform("permissions.permission-denied"));
        }
    };
    //navigatetoupdate
    CurrenciesListComponent.prototype.edit = function (id) {
        this.sharedServices.changeButton({ action: 'Update', submitMode: false });
        this.router.navigate(['/control-panel/settings/update-currency', id]);
    };
    CurrenciesListComponent.prototype.defineGridColumn = function () {
        var _this = this;
        this.sharedServices.getLanguage().subscribe(function (res) {
            _this.lang = res;
            _this.columnNames = [
                { title: _this.lang == 'ar' ? 'رقم' : 'Id', field: 'id' },
                _this.lang == "ar"
                    ? { title: ' العملة', field: 'currencyNameAr' }
                    : { title: ' Currency  ', field: 'currencyNameEn' },
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
    CurrenciesListComponent.prototype.editFormatIcon = function () {
        return "<i class=' fa fa-edit'></i>";
    };
    ;
    CurrenciesListComponent.prototype.deleteFormatIcon = function () {
        return "<i class=' fa fa-trash'></i>";
    };
    ;
    CurrenciesListComponent.prototype.CheckBoxFormatIcon = function () {
        return "<input id='yourID' type='checkbox' />";
    };
    ;
    CurrenciesListComponent.prototype.onSearchTextChange = function (searchTxt) {
        this.searchFilters = [
            [
                { field: 'currencyNameAr', type: 'like', value: searchTxt },
                { field: 'currencyNameEn', type: 'like', value: searchTxt },
                ,
            ],
        ];
    };
    CurrenciesListComponent.prototype.openCurrencies = function () { };
    CurrenciesListComponent.prototype.onMenuActionSelected = function (event) {
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
    CurrenciesListComponent.prototype.showResponseMessage = function (responseStatus, alertType, message) {
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
    CurrenciesListComponent.prototype.showConfirmDeleteMessage = function (id) {
        var _this = this;
        var modalRef = this.modalService.open(message_modal_component_1.MessageModalComponent);
        modalRef.componentInstance.message = this.translate.transform("messages.confirm-delete");
        modalRef.componentInstance.title = this.translate.transform("messages.delete");
        modalRef.componentInstance.btnConfirmTxt = this.translate.transform("buttons.delete");
        modalRef.componentInstance.isYesNo = true;
        modalRef.result.then(function (rs) {
            //((rs);
            if (rs == 'Confirm') {
                _this.spinner.show();
                _this.CurrenciesService.deleteWithUrl("Delete?id=" + id).subscribe(function (resonse) {
                    //(('delet response', resonse);
                    _this.getCurrencies();
                    setTimeout(function () {
                        if (resonse.success == true) {
                            _this.showResponseMessage(resonse.success, enums_1.AlertTypes.success, _this.translate.transform("messages.delete-success"));
                        }
                        else if (resonse.success == false) {
                            _this.showResponseMessage(resonse.success, enums_1.AlertTypes.error, _this.translate.transform("messages.delete-faild"));
                        }
                        _this.spinner.hide();
                    },500);
                });
            }
        });
    };
    CurrenciesListComponent.prototype.listenToClickedButton = function () {
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
    CurrenciesListComponent = __decorate([
        core_1.Component({
            selector: 'app-currencies-list',
            templateUrl: './currencies-list.component.html',
            styleUrls: ['./currencies-list.component.scss']
        })
    ], CurrenciesListComponent);
    return CurrenciesListComponent;
}());
exports.CurrenciesListComponent = CurrenciesListComponent;
