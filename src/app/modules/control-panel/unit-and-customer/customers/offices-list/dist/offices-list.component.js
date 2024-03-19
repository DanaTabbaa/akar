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
exports.OfficesListComponent = void 0;
var core_1 = require("@angular/core");
var enums_1 = require("src/app/core/constants/enumrators/enums");
var message_modal_component_1 = require("src/app/shared/message-modal/message-modal.component");
var office_actions_1 = require("src/app/core/stores/actions/office.actions");
var PAGEID = 13; // from pages table in database seeding table
var OfficesListComponent = /** @class */ (function () {
    //#endregion
    //#region Constructor
    function OfficesListComponent(officesService, router, sharedServices, alertsService, modalService, translate, rolesPerimssionsService, spinner, store) {
        this.officesService = officesService;
        this.router = router;
        this.sharedServices = sharedServices;
        this.alertsService = alertsService;
        this.modalService = modalService;
        this.translate = translate;
        this.rolesPerimssionsService = rolesPerimssionsService;
        this.spinner = spinner;
        this.store = store;
        this.addUrl = '/control-panel/definitions/add-office';
        this.updateUrl = '/control-panel/definitions/update-office/';
        this.listUrl = '/control-panel/definitions/offices-list';
        this.toolbarPathData = {
            listPath: '',
            updatePath: this.updateUrl,
            addPath: this.addUrl,
            componentList: "component-names.list-offices",
            componentAdd: ''
        };
        this.offices = [];
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
    OfficesListComponent.prototype.ngOnInit = function () {
        this.getPagePermissions(PAGEID);
        this.sharedServices.changeButton({ action: 'List' });
        this.sharedServices.changeToolbarPath(this.toolbarPathData);
        this.listenToClickedButton();
        this.getOffices();
        this.defineGridColumn();
    };
    //#endregion
    //#region ngOnDestroy
    OfficesListComponent.prototype.ngOnDestroy = function () {
        this.subsList.forEach(function (s) {
            if (s) {
                s.unsubscribe();
            }
        });
    };
    OfficesListComponent.prototype.getPagePermissions = function (pageId) {
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
    //#endregion
    //#region CRUD Operations
    OfficesListComponent.prototype.getOffices = function () {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.officesService.getAll("GetAll").subscribe({
                next: function (res) {
                    _this.offices = res.data.map(function (res) {
                        return res;
                    });
                    resolve();
                    //(('res', res);
                    //((' this.offices', this.offices);
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
    OfficesListComponent.prototype["delete"] = function (id) {
        if (this.userPermissions.isDelete) {
            this.showConfirmDeleteMessage(id);
        }
        else {
            this.showResponseMessage(true, enums_1.AlertTypes.warning, this.translate.transform("permissions.permission-denied"));
        }
    };
    //navigatetoupdate
    OfficesListComponent.prototype.edit = function (id) {
        this.sharedServices.changeButton({ action: 'Update', submitMode: false });
        this.router.navigate(['/control-panel/definitions/update-office', id]);
    };
    //#endregion
    //#region Helper Functions
    OfficesListComponent.prototype.showResponseMessage = function (responseStatus, alertType, message) {
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
    OfficesListComponent.prototype.showConfirmDeleteMessage = function (id) {
        var _this = this;
        var modalRef = this.modalService.open(message_modal_component_1.MessageModalComponent);
        modalRef.componentInstance.message = this.translate.transform("messages.confirm-delete");
        modalRef.componentInstance.title = this.translate.transform("messages.delete");
        modalRef.componentInstance.isYesNo = true;
        modalRef.result.then(function (rs) {
            //((rs);
            if (rs == 'Confirm') {
                _this.spinner.show();
                var deletedItem = _this.offices.find(function (x) { return x.id == id; });
                _this.officesService.deleteWithUrl("Delete?id=" + id).subscribe(function (resonse) {
                    _this.getOffices();
                    if (resonse.success == true) {
                        _this.store.dispatch(office_actions_1.OfficeActions.actions["delete"]({
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
                }, 500);
            }
        });
    };
    OfficesListComponent.prototype.defineGridColumn = function () {
        var _this = this;
        this.sharedServices.getLanguage().subscribe(function (res) {
            _this.lang = res;
            _this.columnNames = [
                _this.lang == 'ar'
                    ? { title: ' الاسم', field: 'nameAr' }
                    : { title: ' Name  ', field: 'nameEn' },
                {
                    title: _this.lang == 'ar' ? ' رقم الجوال' : 'Mobile',
                    field: 'mobile'
                },
                {
                    title: _this.lang == 'ar' ? 'رقم الهاتف' : ' phone',
                    field: 'phone'
                },
                {
                    title: _this.lang == 'ar' ? 'رقم الهوية' : ' Identity No',
                    field: 'identityNo'
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
    OfficesListComponent.prototype.editFormatIcon = function () {
        return "<i class=' fa fa-edit'></i>";
    };
    ;
    OfficesListComponent.prototype.deleteFormatIcon = function () {
        return "<i class=' fa fa-trash'></i>";
    };
    ;
    OfficesListComponent.prototype.CheckBoxFormatIcon = function () {
        return "<input id='yourID' type='checkbox' />";
    };
    ;
    OfficesListComponent.prototype.onSearchTextChange = function (searchTxt) {
        this.searchFilters = [
            [
                { field: 'nameEn', type: 'like', value: searchTxt },
                { field: 'nameAr', type: 'like', value: searchTxt },
                ,
            ],
        ];
    };
    OfficesListComponent.prototype.openAddOffices = function () { };
    OfficesListComponent.prototype.onMenuActionSelected = function (event) {
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
    OfficesListComponent.prototype.listenToClickedButton = function () {
        var _this = this;
        var sub = this.sharedServices.getClickedbutton().subscribe({
            next: function (currentBtn) {
                currentBtn;
                if (currentBtn != null) {
                    if (currentBtn.action == enums_1.ToolbarActions.List) {
                        // this.router.navigate(['/control-panel/definitions/buildings']);
                    }
                    else if (currentBtn.action == enums_1.ToolbarActions.New) {
                        _this.router.navigate([_this.addUrl]);
                    }
                }
            }
        });
        this.subsList.push(sub);
    };
    OfficesListComponent = __decorate([
        core_1.Component({
            selector: 'app-offices-list',
            templateUrl: './offices-list.component.html',
            styleUrls: ['./offices-list.component.scss']
        })
    ], OfficesListComponent);
    return OfficesListComponent;
}());
exports.OfficesListComponent = OfficesListComponent;
