"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ContractsSettingsListComponent = void 0;
var core_1 = require("@angular/core");
var enums_1 = require("src/app/core/constants/enumrators/enums");
var message_modal_component_1 = require("src/app/shared/message-modal/message-modal.component");
var PAGEID = 34; // from pages table in database seeding table
var ContractsSettingsListComponent = /** @class */ (function () {
    //
    //constructor
    function ContractsSettingsListComponent(router, sharedServices, alertsService, modalService, translate, rolesPerimssionsService, contractsSettingsService, rentContractsSettingsDetailsService, spinner, store) {
        this.router = router;
        this.sharedServices = sharedServices;
        this.alertsService = alertsService;
        this.modalService = modalService;
        this.translate = translate;
        this.rolesPerimssionsService = rolesPerimssionsService;
        this.contractsSettingsService = contractsSettingsService;
        this.rentContractsSettingsDetailsService = rentContractsSettingsDetailsService;
        this.spinner = spinner;
        this.store = store;
        //properties
        this.contractsSettings = [];
        this.addUrl = '/control-panel/settings/add-contract-setting';
        this.updateUrl = '/control-panel/settings/update-contract-setting/';
        this.listUrl = '/control-panel/settings/contracts-settings-list';
        this.toolbarPathData = {
            listPath: '',
            updatePath: this.updateUrl,
            addPath: this.addUrl,
            componentList: "sidebar.contract-types",
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
    //
    //oninit
    ContractsSettingsListComponent.prototype.ngOnInit = function () {
        this.getPagePermissions(PAGEID);
        this.defineGridColumn();
    };
    //#region ngOnDestroy
    ContractsSettingsListComponent.prototype.ngOnDestroy = function () {
        this.subsList.forEach(function (s) {
            if (s) {
                s.unsubscribe();
            }
        });
    };
    //#endregion
    ContractsSettingsListComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.listenToClickedButton();
        this.getContractsSettings();
        setTimeout(function () {
            _this.sharedServices.changeButton({ action: 'List' });
            _this.sharedServices.changeToolbarPath(_this.toolbarPathData);
        }, 300);
    };
    ContractsSettingsListComponent.prototype.getPagePermissions = function (pageId) {
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
    //Methods
    // getContractsSettings() {
    //   return new Promise<void>((resolve, reject) => {
    //     let sub = this.store.select(ContractSettingSelectors.selectors.getListSelector).subscribe({
    //       next: (res: ContractSettingModel) => {
    //         this.contractsSettings = JSON.parse(JSON.stringify(res.list))
    //         resolve();
    //       },
    //       error: (err: any) => {
    //         reject(err);
    //       },
    //       complete: () => {
    //
    //         this.spinner.hide();
    //       },
    //     });
    //     this.subsList.push(sub);
    //   });
    ContractsSettingsListComponent.prototype.getContractsSettings = function () {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.contractsSettingsService.getAll("GetAll").subscribe({
                next: function (res) {
                    _this.contractsSettings = res.data.map(function (res) {
                        return res;
                    });
                    resolve();
                    //(("res", res);
                    //((" this.contractsSettings", this.contractsSettings);
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
    ContractsSettingsListComponent.prototype["delete"] = function (id) {
        if (this.userPermissions.isDelete) {
            this.showConfirmDeleteMessage(id);
        }
        else {
            this.showResponseMessage(true, enums_1.AlertTypes.warning, this.translate.transform("permissions.permission-denied"));
        }
    };
    ContractsSettingsListComponent.prototype.goToAdd = function (typeOfComponent) {
        this.router.navigate(['/control-panel/settings/add-contract-setting'], { queryParams: { typeOfComponent: typeOfComponent } });
    };
    ContractsSettingsListComponent.prototype.edit = function (id) {
        this.sharedServices.changeButton({ action: 'Update', submitMode: false });
        this.router.navigate(['/control-panel/settings/update-contract-setting', id]);
    };
    ContractsSettingsListComponent.prototype.navigate = function (urlroute) {
        this.router.navigate([urlroute]);
    };
    //
    //#region Helper Functions
    ContractsSettingsListComponent.prototype.showResponseMessage = function (responseStatus, alertType, message) {
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
    ContractsSettingsListComponent.prototype.showConfirmDeleteMessage = function (id) {
        var _this = this;
        var modalRef = this.modalService.open(message_modal_component_1.MessageModalComponent);
        modalRef.componentInstance.message = this.translate.transform('messages.confirm-delete');
        modalRef.componentInstance.title = this.translate.transform('buttons.delete');
        modalRef.componentInstance.isYesNo = true;
        modalRef.result.then(function (rs) {
            //((rs);
            if (rs == 'Confirm') {
                _this.spinner.show();
                var sub = _this.contractsSettingsService.deleteWithResponse("Delete?Id=" + id).subscribe(function (resonse) {
                    //reloadPage()
                    _this.getContractsSettings();
                    if (resonse.success == true) {
                        _this.showResponseMessage(resonse.success, enums_1.AlertTypes.success, _this.translate.transform("messages.delete-success"));
                        _this.spinner.hide();
                    }
                    else if (resonse.success == false) {
                        _this.showResponseMessage(resonse.success, enums_1.AlertTypes.error, resonse.message);
                        _this.spinner.hide();
                    }
                });
                _this.subsList.push(sub);
                setTimeout(function () {
                    _this.spinner.hide();
                },500);
            }
        });
    };
    ContractsSettingsListComponent.prototype.onSearchTextChange = function (searchTxt) {
        this.searchFilters = [
            [
                { field: 'contractArName', type: 'like', value: searchTxt },
                { field: 'contractEnName', type: 'like', value: searchTxt },
                ,
            ],
        ];
    };
    ContractsSettingsListComponent.prototype.defineGridColumn = function () {
        var _this = this;
        this.sharedServices.getLanguage().subscribe(function (res) {
            _this.lang = res;
            _this.columnNames = [
                { title: _this.lang === 'ar' ? ' اسم العقد' : 'Contract Name', field: _this.lang === 'en' ? 'contractArName' : 'contractArName' },
                { title: _this.lang === 'ar' ? ' اسم العقد بالانجليزى' : 'Contract Name in Latin', field: _this.lang === 'ar' ? 'contractEnName' : 'contractEnName' },
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
    ContractsSettingsListComponent.prototype.editFormatIcon = function () {
        return "<i class=' fa fa-edit'></i>";
    };
    ;
    ContractsSettingsListComponent.prototype.deleteFormatIcon = function () {
        return "<i class=' fa fa-trash'></i>";
    };
    ;
    ContractsSettingsListComponent.prototype.CheckBoxFormatIcon = function () {
        return "<input id='yourID' type='checkbox' />";
    };
    ;
    ContractsSettingsListComponent.prototype.openContractsSettings = function () { };
    ContractsSettingsListComponent.prototype.onMenuActionSelected = function (event) {
        if (event != null) {
            if (event.actionName == 'Edit') {
                this.edit(event.item.id);
                this.sharedServices.changeButton({
                    action: 'Update',
                    componentName: 'List',
                    submitMode: false
                });
                this.sharedServices.changeToolbarPath(this.toolbarPathData);
                this.router.navigate(['control-panel/settings/update-contract-setting/' + event.item.id]);
            }
            else if (event.actionName == 'Delete') {
                this["delete"](event.item.id);
            }
        }
    };
    ContractsSettingsListComponent.prototype.listenToClickedButton = function () {
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
    ContractsSettingsListComponent = __decorate([
        core_1.Component({
            selector: 'app-contracts-settings-list',
            templateUrl: './contracts-settings-list.component.html',
            styleUrls: ['./contracts-settings-list.component.scss']
        })
    ], ContractsSettingsListComponent);
    return ContractsSettingsListComponent;
}());
exports.ContractsSettingsListComponent = ContractsSettingsListComponent;
