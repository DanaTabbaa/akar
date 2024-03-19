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
exports.DistrictsListComponent = void 0;
var core_1 = require("@angular/core");
var enums_1 = require("src/app/core/constants/enumrators/enums");
var message_modal_component_1 = require("src/app/shared/message-modal/message-modal.component");
var district_actions_1 = require("src/app/core/stores/actions/district.actions");
var PAGEID = 40;
var DistrictsListComponent = /** @class */ (function () {
    function DistrictsListComponent(router, modalService, sharedServices, alertsService, translate, spinner, store, rolesPerimssionsService, districtsService) {
        this.router = router;
        this.modalService = modalService;
        this.sharedServices = sharedServices;
        this.alertsService = alertsService;
        this.translate = translate;
        this.spinner = spinner;
        this.store = store;
        this.rolesPerimssionsService = rolesPerimssionsService;
        this.districtsService = districtsService;
        //#endregion
        this.districts = [];
        this.addUrl = '/control-panel/settings/add-district';
        this.updateUrl = '/control-panel/settings/update-district/';
        this.listUrl = '/control-panel/settings/districts-list';
        this.toolbarPathData = {
            listPath: '',
            updatePath: this.updateUrl,
            addPath: this.addUrl,
            componentList: "component-names.list-districts",
            componentAdd: ''
        };
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
    DistrictsListComponent.prototype.ngOnInit = function () {
        this.getPagePermissions(PAGEID);
        this.listenToClickedButton();
        this.sharedServices.changeButton({ action: 'List' });
        this.sharedServices.changeToolbarPath(this.toolbarPathData);
        this.getDistricts();
        this.defineGridColumn();
    };
    //#region ngOnDestory
    DistrictsListComponent.prototype.ngOnDestroy = function () {
        this.subsList.forEach(function (s) {
            if (s) {
                s.unsubscribe();
            }
        });
    };
    DistrictsListComponent.prototype.getDistricts = function () {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.districtsService.getAll("GetAll").subscribe({
                next: function (res) {
                    _this.districts = res.data.map(function (res) {
                        return res;
                    });
                    resolve();
                    //(("res", res);
                    //((" this.districts", this.districts);
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
    DistrictsListComponent.prototype.getPagePermissions = function (pageId) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.rolesPerimssionsService
                .getAll('GetPagePermissionById?pageId=' + pageId)
                .subscribe({
                next: function (res) {
                    _this.rolePermission = JSON.parse(JSON.stringify(res.data));
                    _this.userPermissions = JSON.parse(_this.rolePermission.permissionJson);
                    _this.sharedServices.setUserPermissions(_this.userPermissions);
                    resolve();
                },
                error: function (err) {
                    reject(err);
                },
                complete: function () { }
            });
        });
        return promise;
    };
    //#endregion
    //navigatetoupdate
    DistrictsListComponent.prototype.edit = function (id) {
        this.sharedServices.changeButton({ action: 'Update' });
        this.router.navigate(['/control-panel/settings/update-district', id]);
    };
    DistrictsListComponent.prototype.navigate = function (urlroute) {
        this.router.navigate([urlroute]);
    };
    DistrictsListComponent.prototype["delete"] = function (id) {
        if (this.userPermissions.isDelete) {
            this.showConfirmDeleteMessage(id);
        }
        else {
            this.showResponseMessage(true, enums_1.AlertTypes.warning, this.translate.transform("permissions.permission-denied"));
        }
    };
    DistrictsListComponent.prototype.defineGridColumn = function () {
        var _this = this;
        this.sharedServices.getLanguage().subscribe(function (res) {
            _this.lang = res;
            _this.columnNames = [
                { title: _this.lang == 'ar' ? 'رقم' : 'Id', field: 'id' },
                _this.lang == "ar"
                    ? { title: ' المدن', field: 'cityNameAr' }
                    : { title: ' City  ', field: 'cityNameEn' },
                _this.lang == "ar"
                    ? { title: ' الحي', field: 'districtNameAr' }
                    : { title: ' District  ', field: 'districtNameEn' },
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
    DistrictsListComponent.prototype.editFormatIcon = function () {
        return "<i class=' fa fa-edit'></i>";
    };
    ;
    DistrictsListComponent.prototype.deleteFormatIcon = function () {
        return "<i class=' fa fa-trash'></i>";
    };
    ;
    DistrictsListComponent.prototype.CheckBoxFormatIcon = function () {
        return "<input id='yourID' type='checkbox' />";
    };
    ;
    DistrictsListComponent.prototype.onSearchTextChange = function (searchTxt) {
        this.searchFilters = [
            [
                { field: 'cityNameAr', type: 'like', value: searchTxt },
                { field: 'cityNameEn', type: 'like', value: searchTxt },
                { field: 'cityNameAr', type: 'like', value: searchTxt },
                { field: 'cityNameEn', type: 'like', value: searchTxt },
                ,
            ],
        ];
    };
    DistrictsListComponent.prototype.openDistricts = function () { };
    DistrictsListComponent.prototype.onMenuActionSelected = function (event) {
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
    DistrictsListComponent.prototype.showResponseMessage = function (responseStatus, alertType, message) {
        if (responseStatus == true && enums_1.AlertTypes.success == alertType) {
            this.alertsService.showSuccess(message, 'Done');
        }
        else if (responseStatus == true && enums_1.AlertTypes.warning) {
            this.alertsService.showWarning(message, 'Alert');
        }
        else if (responseStatus == true && enums_1.AlertTypes.info) {
            this.alertsService.showInfo(message, 'info');
        }
        else if (responseStatus == false && enums_1.AlertTypes.error) {
            this.alertsService.showError(message, 'error');
        }
    };
    DistrictsListComponent.prototype.showConfirmDeleteMessage = function (id) {
        var _this = this;
        var modalRef = this.modalService.open(message_modal_component_1.MessageModalComponent);
        modalRef.componentInstance.message = this.translate.transform("messages.confirm-delete");
        modalRef.componentInstance.title = this.translate.transform("messages.delete");
        modalRef.componentInstance.btnConfirmTxt = this.translate.transform("buttons.delete");
        modalRef.componentInstance.isYesNo = true;
        modalRef.result.then(function (rs) {
            if (rs == 'Confirm') {
                _this.spinner.show();
                var deletedItem = _this.districts.find(function (x) { return x.id == id; });
                _this.districtsService.deleteWithUrl("Delete?id=" + id).subscribe(function (resonse) {
                    _this.getDistricts();
                    if (resonse.success == true) {
                        _this.store.dispatch(district_actions_1.DistrictActions.actions["delete"]({
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
    DistrictsListComponent.prototype.listenToClickedButton = function () {
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
    DistrictsListComponent = __decorate([
        core_1.Component({
            selector: 'app-districts-list',
            templateUrl: './districts-list.component.html',
            styleUrls: ['./districts-list.component.scss']
        })
    ], DistrictsListComponent);
    return DistrictsListComponent;
}());
exports.DistrictsListComponent = DistrictsListComponent;
