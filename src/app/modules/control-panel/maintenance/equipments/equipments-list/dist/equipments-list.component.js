"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.EquipmentsListComponent = void 0;
var core_1 = require("@angular/core");
var enums_1 = require("src/app/core/constants/enumrators/enums");
var message_modal_component_1 = require("src/app/shared/message-modal/message-modal.component");
var PAGEID = 28; // from pages table in database seeding table
var EquipmentsListComponent = /** @class */ (function () {
    //#endregion
    //#region Constructor
    function EquipmentsListComponent(equipmentsService, router, rolesPerimssionsService, sharedServices, alertsService, modalService, translate) {
        this.equipmentsService = equipmentsService;
        this.router = router;
        this.rolesPerimssionsService = rolesPerimssionsService;
        this.sharedServices = sharedServices;
        this.alertsService = alertsService;
        this.modalService = modalService;
        this.translate = translate;
        this.addUrl = '/control-panel/maintenance/add-equipment';
        this.updateUrl = '/control-panel/maintenance/update-equipment/';
        this.listUrl = '/control-panel/maintenance/equipments-list';
        this.toolbarPathData = {
            listPath: '',
            updatePath: this.updateUrl,
            addPath: this.addUrl,
            componentList: "menu.equipments",
            componentAdd: ''
        };
        this.equipments = [];
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
    EquipmentsListComponent.prototype.ngOnInit = function () {
        this.getPagePermissions(PAGEID);
        this.listenToClickedButton();
        this.sharedServices.changeButton({ action: 'List' });
        this.sharedServices.changeToolbarPath(this.toolbarPathData);
        this.getEquipments();
        this.defineGridColumn();
    };
    //#endregion
    //#region ngOnDestroy
    EquipmentsListComponent.prototype.ngOnDestroy = function () {
        this.subsList.forEach(function (s) {
            if (s) {
                s.unsubscribe();
            }
        });
    };
    EquipmentsListComponent.prototype.getPagePermissions = function (pageId) {
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
    //#region  State Management
    //#endregion
    //#region Basic Data
    ///Geting form dropdown list data
    //#endregion
    //#region CRUD Operations
    EquipmentsListComponent.prototype.getEquipments = function () {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.equipmentsService.getAll("GetAll").subscribe({
                next: function (res) {
                    _this.equipments = res.data.map(function (res) {
                        return res;
                    });
                    resolve();
                    //(('res', res);
                    //((' this.equipments', this.equipments);
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
    EquipmentsListComponent.prototype["delete"] = function (id) {
        if (this.userPermissions.isDelete) {
            this.showConfirmDeleteMessage(id);
        }
        else {
            this.showResponseMessage(true, enums_1.AlertTypes.warning, this.translate.transform("permissions.permission-denied"));
        }
    };
    //navigatetoupdate
    EquipmentsListComponent.prototype.edit = function (id) {
        this.sharedServices.changeButton({ action: 'Update' });
        this.router.navigate(['/control-panel/maintenance/update-equipment', id]);
    };
    //#endregion
    //#region Helper Functions
    EquipmentsListComponent.prototype.showResponseMessage = function (responseStatus, alertType, message) {
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
    EquipmentsListComponent.prototype.showConfirmDeleteMessage = function (id) {
        var _this = this;
        var modalRef = this.modalService.open(message_modal_component_1.MessageModalComponent);
        modalRef.componentInstance.message = this.translate.transform('messages.confirm-delete');
        modalRef.componentInstance.title = this.translate.transform('buttons.delete');
        modalRef.componentInstance.isYesNo = true;
        modalRef.result.then(function (rs) {
            //((rs);
            if (rs == 'Confirm') {
                _this.equipmentsService["delete"](id).subscribe(function (resonse) {
                    //(('delete response', resonse);
                    _this.getEquipments();
                    if (resonse.success == true) {
                        _this.showResponseMessage(resonse.success, enums_1.AlertTypes.warning, resonse.message);
                    }
                    else if (resonse.success == false) {
                        _this.showResponseMessage(resonse.success, enums_1.AlertTypes.error, resonse.message);
                    }
                });
            }
        });
    };
    EquipmentsListComponent.prototype.defineGridColumn = function () {
        var _this = this;
        this.sharedServices.getLanguage().subscribe(function (res) {
            _this.lang = res;
            _this.columnNames = [
                {
                    title: _this.lang == 'ar' ? ' رقم المعدة' : 'Equipment Number',
                    field: 'equipmentNumber'
                },
                _this.lang == 'ar'
                    ? { title: ' أسم المعدة', field: 'equipmentNameAr' }
                    : { title: ' Equipment Name  ', field: 'equipmentNameEn' },
                _this.lang == 'ar'
                    ? { title: 'المالك', field: 'ownerNameAr' }
                    : { title: ' Owner', field: 'ownerNameEn' },
                {
                    title: _this.lang == 'ar' ? ' سنة الصنع' : 'Manufacture Year',
                    field: 'manufactureYear'
                },
                {
                    title: _this.lang == 'ar' ? 'موديل' : ' Model',
                    field: 'model'
                },
                {
                    title: _this.lang == 'ar' ? 'الشركة المصنعة' : 'Manufacturing Company',
                    field: 'manufacturingCompany'
                },
                {
                    title: _this.lang == 'ar' ? 'الشركة الموردة' : 'Supplying Company',
                    field: 'supplyingCompany'
                },
                {
                    title: _this.lang == 'ar' ? 'تاريخ التركيب' : 'Installation Date',
                    field: 'installationDate'
                },
                {
                    title: _this.lang == 'ar' ? 'مكان التركيب' : 'Installation Place',
                    field: 'installationPlace'
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
    EquipmentsListComponent.prototype.editFormatIcon = function () {
        return "<i class=' fa fa-edit'></i>";
    };
    ;
    EquipmentsListComponent.prototype.deleteFormatIcon = function () {
        return "<i class=' fa fa-trash'></i>";
    };
    ;
    EquipmentsListComponent.prototype.CheckBoxFormatIcon = function () {
        return "<input id='yourID' type='checkbox' />";
    };
    ;
    EquipmentsListComponent.prototype.onSearchTextChange = function (searchTxt) {
        this.searchFilters = [
            [
                { field: 'equipmentNumber', type: 'like', value: searchTxt },
                { field: 'equipmentNameAr', type: 'like', value: searchTxt },
                { field: 'equipmentNameEn', type: 'like', value: searchTxt },
                { field: 'ownerNameAr', type: 'like', value: searchTxt },
                { field: 'ownerNameEn', type: 'like', value: searchTxt },
                { field: 'manufactureYear', type: 'like', value: searchTxt },
                { field: 'model', type: 'like', value: searchTxt },
                ,
            ],
        ];
    };
    EquipmentsListComponent.prototype.openAddEquipments = function () { };
    EquipmentsListComponent.prototype.onMenuActionSelected = function (event) {
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
    EquipmentsListComponent.prototype.listenToClickedButton = function () {
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
    EquipmentsListComponent = __decorate([
        core_1.Component({
            selector: 'app-equipments-list',
            templateUrl: './equipments-list.component.html',
            styleUrls: ['./equipments-list.component.scss']
        })
    ], EquipmentsListComponent);
    return EquipmentsListComponent;
}());
exports.EquipmentsListComponent = EquipmentsListComponent;
