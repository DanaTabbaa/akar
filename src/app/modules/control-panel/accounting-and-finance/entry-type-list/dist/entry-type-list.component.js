"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.EntryTypeListComponent = void 0;
var core_1 = require("@angular/core");
var enums_1 = require("src/app/core/constants/enumrators/enums");
var message_modal_component_1 = require("src/app/shared/message-modal/message-modal.component");
var entry_type_selectors_1 = require("src/app/core/stores/selectors/entry-type.selectors");
var PAGEID = 17; // from pages table in database seeding table
var EntryTypeListComponent = /** @class */ (function () {
    //#endregion
    //#region Constructor
    function EntryTypeListComponent(entryTypeService, vouchersService, router, sharedServices, rolesPerimssionsService, alertsService, modalService, translate, store) {
        this.entryTypeService = entryTypeService;
        this.vouchersService = vouchersService;
        this.router = router;
        this.sharedServices = sharedServices;
        this.rolesPerimssionsService = rolesPerimssionsService;
        this.alertsService = alertsService;
        this.modalService = modalService;
        this.translate = translate;
        this.store = store;
        //#region Main Declarations
        this.entryTypes = [];
        this.voucher = [];
        this.errorMessage = '';
        this.errorClass = '';
        this.addUrl = '/control-panel/accounting/add-entry-type';
        this.updateUrl = '/control-panel/accounting/update-entry-type/';
        this.listUrl = '/control-panel/accounting/entry-type-list';
        this.toolbarPathData = {
            listPath: '',
            updatePath: this.updateUrl,
            addPath: this.addUrl,
            componentList: "menu.entry-types",
            componentAdd: ''
        };
        //#endregion
        //#region Tabulator
        this.panelId = 1;
        this.sortByCols = [];
        this.groupByCols = [];
        this.lang = '';
        // columnNames = [
        //   { title: ' الاسم', field: 'entryNameAr' },
        //   { title: ' الاسم الانجليزي  ', field: 'entryNameEn' },
        // ];
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
    EntryTypeListComponent.prototype.ngOnInit = function () {
        this.getPagePermissions(PAGEID);
    };
    EntryTypeListComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.defineGridColumn();
        this.listenToClickedButton();
        this.getEntryTypes();
        setTimeout(function () {
            _this.sharedServices.changeButton({ action: 'List' });
            _this.sharedServices.changeToolbarPath(_this.toolbarPathData);
        }, 300);
    };
    //#endregion
    //#region ngOnDestroy
    EntryTypeListComponent.prototype.ngOnDestroy = function () {
        this.subsList.forEach(function (s) {
            if (s) {
                s.unsubscribe();
            }
        });
    };
    EntryTypeListComponent.prototype.getPagePermissions = function (pageId) {
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
    EntryTypeListComponent.prototype.getEntryTypes = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var sub = _this.store.select(entry_type_selectors_1.EntryTypeSelectors.selectors.getListSelector).subscribe({
                next: function (res) {
                    _this.entryTypes = JSON.parse(JSON.stringify(res.list));
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
    // delete(id: any) {
    //   this.entryTypeService.delete(id).subscribe((resonse) => {
    //     //(('delet response', resonse);
    //     this.getEntryTypes();
    //   });
    // }
    EntryTypeListComponent.prototype["delete"] = function (id) {
        if (this.userPermissions.isDelete) {
            this.showConfirmDeleteMessage(id);
        }
        else {
            this.showResponseMessage(true, enums_1.AlertTypes.warning, this.translate.transform("permissions.permission-denied"));
        }
    };
    EntryTypeListComponent.prototype.edit = function (id) {
        this.sharedServices.changeButton({ action: 'Update' });
        this.router.navigate([
            '/control-panel/accounting/update-entry-type',
            id,
        ]);
    };
    //#endregion
    //#region Helper Functions
    EntryTypeListComponent.prototype.showResponseMessage = function (responseStatus, alertType, message) {
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
    EntryTypeListComponent.prototype.showConfirmDeleteMessage = function (id) {
        var _this = this;
        var modalRef = this.modalService.open(message_modal_component_1.MessageModalComponent);
        modalRef.componentInstance.message = this.translate.transform('messages.confirm-delete');
        modalRef.componentInstance.title = this.translate.transform('buttons.delete');
        modalRef.componentInstance.isYesNo = true;
        modalRef.result.then(function (rs) {
            //((rs);
            if (rs == 'Confirm') {
                var sub = _this.entryTypeService.deleteWithResponse("Delete?Id=" + id).subscribe(function (resonse) {
                    //reloadPage()
                    _this.getEntryTypes();
                    if (resonse.success == true) {
                        _this.showResponseMessage(resonse.success, enums_1.AlertTypes.success, _this.translate.transform("messages.delete-success"));
                    }
                    else if (resonse.success == false) {
                        _this.showResponseMessage(resonse.success, enums_1.AlertTypes.error, _this.translate.transform("messages.delete-faild"));
                    }
                });
                _this.subsList.push(sub);
            }
        });
    };
    EntryTypeListComponent.prototype.defineGridColumn = function () {
        var _this = this;
        this.sharedServices.getLanguage().subscribe(function (res) {
            _this.lang = res;
            _this.columnNames = [
                { title: _this.lang == 'ar' ? 'الاسم' : 'Name', field: 'entryNameAr' },
                { title: _this.lang == 'ar' ? ' الاسم الانجليزي  ' : 'Name in latin', field: 'entryNameEn' },
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
    EntryTypeListComponent.prototype.editFormatIcon = function () {
        return "<i class=' fa fa-edit'></i>";
    };
    ;
    EntryTypeListComponent.prototype.deleteFormatIcon = function () {
        return "<i class=' fa fa-trash'></i>";
    };
    ;
    EntryTypeListComponent.prototype.CheckBoxFormatIcon = function () {
        return "<input id='yourID' type='checkbox' />";
    };
    ;
    EntryTypeListComponent.prototype.onSearchTextChange = function (searchTxt) {
        this.searchFilters = [
            [
                { field: 'entryNameAr', type: 'like', value: searchTxt },
                { field: 'entryNameEn', type: 'like', value: searchTxt },
                ,
            ],
        ];
    };
    EntryTypeListComponent.prototype.openEntryTypes = function () { };
    EntryTypeListComponent.prototype.onMenuActionSelected = function (event) {
        var _this = this;
        if (event != null) {
            if (event.actionName == 'Edit') {
                this.edit(event.item.id);
                this.sharedServices.changeButton({
                    action: 'Update',
                    componentName: 'List',
                    submitMode: false
                });
                this.sharedServices.changeToolbarPath(this.toolbarPathData);
                this.router.navigate(['control-panel/accounting/update-entry-type/' + event.item.id]);
            }
            else if (event.actionName == 'Delete') {
                new Promise(function (resolve, reject) {
                    var sub = _this.vouchersService.getWithResponse("GetByFieldName?fieldName=Type_Id&fieldValue=" + event.item.id).subscribe({
                        next: function (res) {
                            //(("result data getbyid", res.data);
                            _this.voucher = res.data;
                            if (_this.voucher != null) {
                                _this.errorMessage = _this.translate.transform('entry-type.vouchers-added-with-entry-type-no-delete');
                                _this.errorClass = _this.translate.transform('general.warning');
                                _this.alertsService.showWarning(_this.errorMessage, _this.translate.transform('general.warning'));
                                return;
                            }
                            else {
                                _this["delete"](event.item.id);
                            }
                        },
                        error: function (err) {
                            reject(err);
                        },
                        complete: function () {
                        }
                    });
                    _this.subsList.push(sub);
                });
                //   this.store.select(VoucherSelectors.selectors.getListSelector).subscribe({
                //     next: (res: VoucherModel) => {
                //
                //       //(('data',res);
                //       this.voucher = JSON.parse(JSON.stringify(res.list)).filter(x=>x.typeId==event.item.id);
                //       if(this.voucher!=null&&this.voucher.length>0)
                //       {
                //
                //         this.errorMessage = this.translate.transform('entry-type.vouchers-added-with-entry-type-no-delete');
                //         this.errorClass = this.translate.transform('general.warning');
                //         this.alertsService.showWarning(this.errorMessage, this.translate.transform('general.warning'))
                //         return
                //       }
                //       else
                //       {
                //         this.showConfirmDeleteMessage(event.item.id);
                //       }
                //     }
                // })
            }
        }
    };
    EntryTypeListComponent.prototype.listenToClickedButton = function () {
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
    EntryTypeListComponent = __decorate([
        core_1.Component({
            selector: 'app-entry-type-list',
            templateUrl: './entry-type-list.component.html',
            styleUrls: ['./entry-type-list.component.scss']
        })
    ], EntryTypeListComponent);
    return EntryTypeListComponent;
}());
exports.EntryTypeListComponent = EntryTypeListComponent;
