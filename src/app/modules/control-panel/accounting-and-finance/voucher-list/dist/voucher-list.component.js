"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.VoucherListComponent = void 0;
var core_1 = require("@angular/core");
var enums_1 = require("src/app/core/constants/enumrators/enums");
var message_modal_component_1 = require("src/app/shared/message-modal/message-modal.component");
var entry_type_1 = require("src/app/core/models/entry-type");
var VoucherListComponent = /** @class */ (function () {
    //#endregion
    //#region Constructor
    function VoucherListComponent(voucherService, router, sharedServices, alertsService, modalService, translate, store, activatedRoute, entryTypeUserPermisionsService, entryTypeService) {
        this.voucherService = voucherService;
        this.router = router;
        this.sharedServices = sharedServices;
        this.alertsService = alertsService;
        this.modalService = modalService;
        this.translate = translate;
        this.store = store;
        this.activatedRoute = activatedRoute;
        this.entryTypeUserPermisionsService = entryTypeUserPermisionsService;
        this.entryTypeService = entryTypeService;
        //#region Main Declarations
        this.vouchers = [];
        this.entryType = new entry_type_1.EntryType();
        this.addUrl = '/control-panel/accounting/add-voucher';
        this.updateUrl = '/control-panel/accounting/update-voucher/';
        this.listUrl = '/control-panel/accounting/voucher-list';
        this.toolbarPathData = {
            listPath: '',
            updatePath: this.updateUrl,
            addPath: this.addUrl,
            componentList: '',
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
    VoucherListComponent.prototype.ngOnInit = function () {
    };
    VoucherListComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.activatedRoute.queryParams.subscribe({
            next: function (res) {
                _this.typeId = res["typeId"];
                _this.listenToClickedButton();
                _this.getPagePermissions();
                _this.getLanguage();
                if (res["typeId"]) {
                    _this.getEntryTypes();
                    _this.getVouchers(res["typeId"]);
                    _this.defineGridColumn();
                }
            }
        });
        setTimeout(function () {
            // let entryNameAr = localStorage.getItem("entryNameAr")!;
            // let entryNameEn = localStorage.getItem("entryNameEn")!;
            // this.toolbarPathData.componentList = this.lang == 'ar' ? entryNameAr : entryNameEn
            _this.sharedServices.changeButton({ action: 'List' });
            // this.sharedServices.changeToolbarPath(this.toolbarPathData);
        }, 300);
    };
    //#endregion
    //#region ngOnDestroy
    VoucherListComponent.prototype.ngOnDestroy = function () {
        this.subsList.forEach(function (s) {
            if (s) {
                s.unsubscribe();
            }
        });
    };
    VoucherListComponent.prototype.getPagePermissions = function () {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.entryTypeUserPermisionsService.getAll("GetEntryTypeUsersPermissionsOfCurrentUser").subscribe({
                next: function (res) {
                    var _a;
                    ;
                    console.log("getPagePermissions res", res);
                    var permissions = JSON.parse(JSON.stringify(res.data));
                    _this.pagePermission = permissions.find(function (x) { return x.entryTypeId == Number(_this.typeId); });
                    _this.userPermissions = JSON.parse((_a = _this.pagePermission) === null || _a === void 0 ? void 0 : _a.permissionsJson);
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
    //#region  State Management
    //#endregion
    //#region Basic Data
    ///Geting form dropdown list data
    VoucherListComponent.prototype.getLanguage = function () {
        var _this = this;
        this.sharedServices.getLanguage().subscribe(function (res) {
            _this.lang = res;
        });
    };
    VoucherListComponent.prototype.getEntryTypes = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var sub = _this.entryTypeService.getWithResponse("GetAll").subscribe({
                next: function (res) {
                    var _a;
                    if (res.success) {
                        _this.entryType = JSON.parse(JSON.stringify((_a = res.data) === null || _a === void 0 ? void 0 : _a.find(function (x) { return x.id == _this.typeId; })));
                        console.log("this.entryType", _this.entryType);
                        _this.toolbarPathData.componentList = _this.lang == 'ar' ? _this.entryType.entryNameAr : _this.entryType.entryNameEn;
                        //  this.toolbarPathData.componentAdd = this.lang == 'ar' ? 'تحديث' + ' ' + this.entryType.entryNameAr : 'Update' + ' ' + this.entryType.entryNameEn
                        _this.sharedServices.changeToolbarPath(_this.toolbarPathData);
                    }
                    resolve();
                },
                error: function (err) {
                    resolve();
                },
                complete: function () {
                    resolve();
                }
            });
            _this.subsList.push(sub);
        });
    };
    VoucherListComponent.prototype.getVouchers = function (typeId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var sub = _this.voucherService.getWithResponse("GetListByFieldNameVM?fieldName=Type_Id&fieldValue=" + typeId).subscribe({
                next: function (res) {
                    if (res.success) {
                        _this.vouchers = JSON.parse(JSON.stringify(res.data));
                    }
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
    VoucherListComponent.prototype.edit = function (id) {
        //this.sharedServices.changeButton({ action: 'Update' } as ToolbarData);
        ;
        // this.router.navigate(['/control-panel/accounting/update-voucher?typeId='+Number(this.typeId)+'&'+'id='+id]
        // );
        this.router.navigate(['/control-panel/accounting/update-voucher', id], { queryParams: { typeId: this.typeId } });
        this.sharedServices.changeButton({ action: 'Update', componentName: "List" });
        this.sharedServices.changeToolbarPath(this.toolbarPathData);
    };
    //#endregion
    //#region Helper Functions
    VoucherListComponent.prototype.showResponseMessage = function (alertType) {
        if (enums_1.AlertTypes.success == alertType) {
            this.alertsService.showSuccess("Deleted", this.translate.transform('messages.done'));
        }
        else if (enums_1.AlertTypes.error) {
            this.alertsService.showError("error", this.translate.transform('messages.error'));
        }
    };
    VoucherListComponent.prototype.showConfirmDeleteMessage = function (id) {
        var _this = this;
        var modalRef = this.modalService.open(message_modal_component_1.MessageModalComponent);
        modalRef.componentInstance.message = this.translate.transform('messages.confirm-delete');
        modalRef.componentInstance.title = this.translate.transform('buttons.delete');
        modalRef.componentInstance.isYesNo = true;
        modalRef.result.then(function (rs) {
            if (rs == 'Confirm') {
                _this.voucherService.deleteVoucherAndRealtives(id).subscribe(function (response) {
                    ;
                    if (_this.typeId) {
                        _this.vouchers = [];
                        _this.getVouchers(_this.typeId);
                    }
                    if (response == "Success") {
                        _this.showResponseMessage(enums_1.AlertTypes.success);
                    }
                    else if (response == "Failed") {
                        _this.showResponseMessage(enums_1.AlertTypes.error);
                    }
                });
                // let sub = this.voucherService.deleteWithResponse("Delete?Id=" + id).subscribe(
                //   (resonse) => {
                //     if (this.typeId) {
                //       this.vouchers=[];
                //       this.getVouchers(this.typeId);
                //     }
                //     if (resonse.success == true) {
                //       this.showResponseMessage(
                //         resonse.success,
                //         AlertTypes.success,
                //         resonse.message
                //       );
                //     } else if (resonse.success == false) {
                //       this.showResponseMessage(
                //         resonse.success,
                //         AlertTypes.error,
                //         resonse.message
                //       );
                //     }
                // });
                //this.subsList.push(sub);
            }
        });
    };
    VoucherListComponent.prototype.defineGridColumn = function () {
        var _this = this;
        this.sharedServices.getLanguage().subscribe(function (res) {
            _this.lang = res;
            _this.columnNames = [
                {
                    title: _this.lang == 'ar' ? ' كود' : 'Code',
                    field: 'code'
                },
                // this.lang == 'ar'
                //   ? { title: 'المالك', field: 'ownerNameAr' }
                //   : { title: 'Owner', field: 'ownerNameEn' },
                // this.lang == 'ar'
                //   ? { title: 'المستأجر', field: 'tenantNameAr' }
                //   : { title: 'Tenant', field: 'tenantNameEn' },
                {
                    title: _this.lang == 'ar' ? 'المبلغ' : 'Amount',
                    field: 'amount'
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
    VoucherListComponent.prototype.editFormatIcon = function () {
        return "<i class=' fa fa-edit'></i>";
    };
    ;
    VoucherListComponent.prototype.deleteFormatIcon = function () {
        return "<i class=' fa fa-trash'></i>";
    };
    ;
    VoucherListComponent.prototype.onSearchTextChange = function (searchTxt) {
        this.searchFilters = [
            [
                { field: 'code', type: 'like', value: searchTxt },
                { field: 'ownerNameAr', type: 'like', value: searchTxt },
                { field: 'ownerNameEn', type: 'like', value: searchTxt },
                { field: 'tenantNameAr', type: 'like', value: searchTxt },
                { field: 'tenantNameEn', type: 'like', value: searchTxt },
                { field: 'amount', type: 'like', value: searchTxt },
                ,
            ],
        ];
    };
    VoucherListComponent.prototype.openVouchers = function () { };
    VoucherListComponent.prototype.onMenuActionSelected = function (event) {
        if (event != null) {
            if (event.actionName == 'Edit') {
                this.edit(event.item.id);
                // this.sharedServices.changeButton({
                //   action: 'Update',
                //   componentName: 'List',
                //   submitMode: false
                // } as ToolbarData);
                // this.toolbarPathData.componentAdd = this.lang == 'ar' ? 'تحديث' + ' ' + this.entryType.entryNameAr : 'Update' + ' ' + this.entryType.entryNameEn
                // this.sharedServices.changeToolbarPath(this.toolbarPathData);
                // this.router.navigate(['control-panel/accounting/update-voucher/' + event.item.id+'/'+this.typeId])
            }
            else if (event.actionName == 'Delete') {
                this.showConfirmDeleteMessage(event.item.id);
            }
        }
    };
    //#endregion
    VoucherListComponent.prototype.setToolbarComponentData = function () {
        var entryTypeAr = localStorage.getItem("entryNameAr");
        var entryTypeEn = localStorage.getItem("entryNameEn");
        this.toolbarPathData.componentList = this.lang == 'ar' ? entryTypeAr : entryTypeEn;
        //  this.toolbarPathData.componentAdd = this.lang == 'ar' ? 'تحديث' + ' ' + entryTypeAr : 'Update' + ' ' + entryTypeEn
        this.sharedServices.changeToolbarPath(this.toolbarPathData);
    };
    VoucherListComponent.prototype.listenToClickedButton = function () {
        var _this = this;
        var sub = this.sharedServices.getClickedbutton().subscribe({
            next: function (currentBtn) {
                if (currentBtn != null) {
                    if (currentBtn.action == enums_1.ToolbarActions.List) {
                        _this.setToolbarComponentData();
                    }
                    else if (currentBtn.action == enums_1.ToolbarActions.New) {
                        _this.setToolbarComponentData();
                        _this.router.navigate([_this.addUrl], {
                            queryParams: {
                                "typeId": _this.typeId
                            }
                        });
                    }
                }
            }
        });
        this.subsList.push(sub);
    };
    VoucherListComponent = __decorate([
        core_1.Component({
            selector: 'app-voucher-list',
            templateUrl: './voucher-list.component.html',
            styleUrls: ['./voucher-list.component.scss']
        })
    ], VoucherListComponent);
    return VoucherListComponent;
}());
exports.VoucherListComponent = VoucherListComponent;
