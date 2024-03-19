"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.BillListComponent = void 0;
var core_1 = require("@angular/core");
var enums_1 = require("src/app/core/constants/enumrators/enums");
var message_modal_component_1 = require("src/app/shared/message-modal/message-modal.component");
var bill_type_1 = require("src/app/core/models/bill-type");
var BillListComponent = /** @class */ (function () {
    //#endregion
    //#region Constructor
    function BillListComponent(billService, router, sharedServices, alertsService, modalService, translate, store, activatedRoute, billTypeService) {
        this.billService = billService;
        this.router = router;
        this.sharedServices = sharedServices;
        this.alertsService = alertsService;
        this.modalService = modalService;
        this.translate = translate;
        this.store = store;
        this.activatedRoute = activatedRoute;
        this.billTypeService = billTypeService;
        //#region Main Declarations
        this.billsVM = [];
        this.billtype = new bill_type_1.BillType();
        this.addUrl = '/control-panel/accounting/add-bill';
        this.updateUrl = '/control-panel/accounting/update-bill/';
        this.listUrl = '/control-panel/accounting/bill-list';
        this.toolbarPathData = {
            listPath: this.listUrl,
            updatePath: this.updateUrl,
            addPath: this.addUrl,
            componentList: "menu.bills",
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
            showEdit: true,
            showDelete: true
        };
        this.direction = 'ltr';
        this.subsList = [];
    }
    //#endregion
    //#region ngOnInit
    BillListComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.activatedRoute.queryParams.subscribe({
            next: function (res) {
                _this.typeId = res["typeId"];
                //this.listenToClickedButton();
                _this.getLanguage();
                if (res["typeId"]) {
                    _this.getBillTypes();
                    _this.getBills(res["typeId"]);
                }
                localStorage.setItem("typeId", _this.typeId);
            }
        });
        // this.addUrl = '/control-panel/accounting/add-bill?typeId='+this.typeId;
        // this.updateUrl= '/control-panel/accounting/update-bill?typeId='+this.typeId;
        // this.listUrl = '/control-panel/accounting/bill-list?typeId='+this.typeId;
        this.toolbarPathData = {
            listPath: this.listUrl,
            updatePath: this.updateUrl,
            addPath: this.addUrl,
            componentList: "menu.bills",
            componentAdd: ""
        };
        this.defineGridColumn();
        // setTimeout(() => {
        //   this.sharedServices.changeButton({ action: 'List' } as ToolbarData);
        //   this.sharedServices.changeToolbarPath(this.toolbarPathData);
        // }, 300);
    };
    BillListComponent.prototype.openBills = function () { };
    BillListComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.listenToClickedButton();
        setTimeout(function () {
            // let typeNameAr = localStorage.getItem("typeNameAr")!;
            // let typeNameEn = localStorage.getItem("typeNameEn")!;
            // this.toolbarPathData.componentList = this.lang == 'ar' ? typeNameAr : typeNameEn
            _this.sharedServices.changeButton({ action: 'List' });
            // this.sharedServices.changeToolbarPath(this.toolbarPathData);
        }, 300);
    };
    //#endregion
    //#region ngOnDestroy
    BillListComponent.prototype.ngOnDestroy = function () {
        this.subsList.forEach(function (s) {
            if (s) {
                s.unsubscribe();
            }
        });
    };
    //#endregion
    //#region Authentications
    //#endregion
    //#region Permissions
    //#endregion
    //#region  State Management
    //#endregion
    //#region Basic Data
    ///Geting form dropdown list data
    BillListComponent.prototype.getLanguage = function () {
        var _this = this;
        this.sharedServices.getLanguage().subscribe(function (res) {
            _this.lang = res;
        });
    };
    BillListComponent.prototype.getBillTypes = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var sub = _this.billTypeService.getWithResponse("GetAll").subscribe({
                next: function (res) {
                    var _a;
                    if (res.success) {
                        ;
                        _this.billtype = JSON.parse(JSON.stringify((_a = res.data) === null || _a === void 0 ? void 0 : _a.find(function (x) { return x.id == _this.typeId; })));
                        // localStorage.setItem("typeNameAr", this.billtype.typeNameAr);
                        // localStorage.setItem("typeNameEn", this.billtype.typeNameEn);
                        _this.toolbarPathData.componentList = _this.lang == 'ar' ? _this.billtype.typeNameAr : _this.billtype.typeNameEn;
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
        // return new Promise<void>((resolve, reject) => {
        //   let sub = this.store.select(BillTypeSelectors.selectors.getListSelector).subscribe({
        //     next: (res: BillTypeModel) => {
        //       resolve();
        //       this.billtype = res.list.find(x => x.id == this.typeId) ?? new BillType();
        //       localStorage.setItem("typeNameAr", this.billtype.typeNameAr);
        //       localStorage.setItem("typeNameEn", this.billtype.typeNameEn);
        //     },
        //     error: (err: any) => {
        //       resolve();
        //     }
        //   })
        //   this.subsList.push(sub);
        // })
    };
    BillListComponent.prototype.getBills = function (typeId) {
        var _this = this;
        this.billsVM = [];
        return new Promise(function (resolve, reject) {
            var sub = _this.billService.getWithResponse("GetListByFieldNameVM?fieldName=Bill_Type_Id&fieldValue=" + typeId).subscribe({
                next: function (res) {
                    if (res.success) {
                        _this.billsVM = JSON.parse(JSON.stringify(res.data));
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
    BillListComponent.prototype.edit = function (id) {
        // this.router.navigate([
        //   '/control-panel/accounting/update-bill',
        // ],{
        //   queryParams:{
        //     "typeId":this.typeId,
        //     "id":id
        //   }
        // });
        this.sharedServices.changeButton({
            action: 'Update',
            componentName: 'List',
            submitMode: false
        });
        this.sharedServices.changeToolbarPath(this.toolbarPathData);
        this.router.navigate([this.updateUrl + id]);
    };
    //#endregion
    //#region Helper Functions
    BillListComponent.prototype.showResponseMessage = function (responseStatus, alertType) {
        if (responseStatus == true && enums_1.AlertTypes["delete"] == alertType) {
            this.alertsService.showSuccess(this.translate.transform('general.deleted-successfully'), this.translate.transform('messageTitle.done'));
        }
        else if (responseStatus == false && enums_1.AlertTypes.error == alertType) {
            this.alertsService.showSuccess(this.translate.transform('messages.error'), this.translate.transform('messageTitle.error'));
        }
    };
    BillListComponent.prototype.showConfirmDeleteMessage = function (id) {
        var _this = this;
        var modalRef = this.modalService.open(message_modal_component_1.MessageModalComponent);
        modalRef.componentInstance.message = this.translate.transform('messages.confirm-delete');
        modalRef.componentInstance.title = this.translate.transform('buttons.delete');
        modalRef.componentInstance.isYesNo = true;
        modalRef.result.then(function (rs) {
            //((rs);
            if (rs == 'Confirm') {
                var sub = _this.billService.deleteBillAndRelations(id).subscribe(function (resonse) {
                    //reloadPage()
                    if (_this.typeId) {
                        _this.getBills(_this.typeId);
                    }
                    if (resonse.success == true) {
                        _this.showResponseMessage(resonse.success, enums_1.AlertTypes["delete"]);
                    }
                    else if (resonse.success == false) {
                        _this.showResponseMessage(resonse.success, enums_1.AlertTypes.error);
                    }
                });
                _this.subsList.push(sub);
            }
        });
    };
    BillListComponent.prototype.editFormatIcon = function () {
        return "<i class=' fa fa-edit'></i>";
    };
    ;
    BillListComponent.prototype.deleteFormatIcon = function () {
        return "<i class=' fa fa-trash'></i>";
    };
    ;
    BillListComponent.prototype.defineGridColumn = function () {
        var _this = this;
        this.sharedServices.getLanguage().subscribe(function (res) {
            _this.lang = res;
            _this.columnNames = [
                {
                    title: _this.lang == 'ar' ? ' كود ' : 'Code',
                    field: 'code'
                },
                {
                    title: _this.lang == 'ar' ? ' تاريخ الفاتورة ' : 'Bill date',
                    field: 'billDate'
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
                        }
            ];
        });
    };
    BillListComponent.prototype.onSearchTextChange = function (searchTxt) {
        this.searchFilters = [
            [
                { field: 'code', type: 'like', value: searchTxt }
            ],
        ];
    };
    BillListComponent.prototype.onMenuActionSelected = function (event) {
        if (event != null) {
            if (event.actionName == 'Edit') {
                this.edit(event.item.id);
                this.sharedServices.changeButton({
                    action: 'Update',
                    componentName: 'List',
                    submitMode: false
                });
                this.toolbarPathData.componentAdd = this.lang == 'ar' ? 'تحديث' + ' ' + this.billtype.typeNameAr : 'Update' + ' ' + this.billtype.typeNameEn;
                this.sharedServices.changeToolbarPath(this.toolbarPathData);
                this.router.navigate([this.updateUrl + event.item.id]);
            }
            else if (event.actionName == 'Delete') {
                this.showConfirmDeleteMessage(event.item.id);
            }
        }
    };
    BillListComponent.prototype.listenToClickedButton = function () {
        var _this = this;
        var sub = this.sharedServices.getClickedbutton().subscribe({
            next: function (currentBtn) {
                if (currentBtn != null) {
                    if (currentBtn.action == enums_1.ToolbarActions.List) {
                    }
                    else if (currentBtn.action == enums_1.ToolbarActions.New) {
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
    BillListComponent = __decorate([
        core_1.Component({
            selector: 'app-bill-list',
            templateUrl: './bill-list.component.html',
            styleUrls: ['./bill-list.component.scss']
        })
    ], BillListComponent);
    return BillListComponent;
}());
exports.BillListComponent = BillListComponent;
