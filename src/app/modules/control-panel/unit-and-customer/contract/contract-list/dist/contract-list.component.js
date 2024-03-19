"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ContractListComponent = void 0;
var core_1 = require("@angular/core");
var enums_1 = require("src/app/core/constants/enumrators/enums");
var contracts_settings_1 = require("src/app/core/models/contracts-settings");
var ContractListComponent = /** @class */ (function () {
    function ContractListComponent(router, sharedService, activatedRoute, store, contractSettingService, contractSettingsUserPermisionsService, contractService) {
        this.router = router;
        this.sharedService = sharedService;
        this.activatedRoute = activatedRoute;
        this.store = store;
        this.contractSettingService = contractSettingService;
        this.contractSettingsUserPermisionsService = contractSettingsUserPermisionsService;
        this.contractService = contractService;
        this.addUrl = '/control-panel/definitions/add-contract';
        this.updateUrl = '/control-panel/definitions/update-contract/';
        this.listUrl = '/control-panel/definitions/contracts-list';
        this.contracts = [];
        this.contractSettings = new contracts_settings_1.ContractsSettings();
        this.direction = 'ltr';
        this.panelId = 1;
        this.sortByCols = [];
        this.groupByCols = [];
        this.lang = '';
        this.columnNames = [];
        this.menuOptions = {
            showDelete: true,
            showEdit: true
        };
        this.toolbarPathData = {
            listPath: '',
            updatePath: this.updateUrl,
            addPath: this.addUrl,
            componentList: 'component-names.list-contracts',
            componentAdd: ''
        };
        this.subsList = [];
    }
    ContractListComponent.prototype.defineGridColumn = function () {
        var _this = this;
        this.sharedService.getLanguage().subscribe(function (res) {
            _this.lang = res;
            _this.columnNames = [
                {
                    title: _this.lang == 'ar' ? 'رقم' : 'Id',
                    field: 'id'
                },
                {
                    title: _this.lang == 'ar' ? 'رقم العقد' : 'Contract Number',
                    field: 'contractNumber'
                },
                _this.lang == 'ar'
                    ? { title: 'أسم المالك', field: 'ownerNameAr' }
                    : { title: 'Owner name  ', field: 'ownerNameEn' },
                _this.lang == 'ar'
                    ? { title: 'أسم المسترى', field: 'purchaserNameAr' }
                    : { title: 'Purchaser name  ', field: 'purchaserNameEn' },
                _this.lang == 'ar'
                    ? { title: 'أسم المبنى', field: 'buildingNameAr' }
                    : { title: 'Building name  ', field: 'buildingNameEn' },
                {
                    title: _this.lang == 'ar' ? 'اجمالى المساحة' : 'Total Area',
                    field: 'totalArea'
                },
                {
                    title: _this.lang == 'ar' ? 'الاجمالى بعد الضريبة' : 'Total With Tax',
                    field: 'totalWithTax'
                },
                _this.lang == 'ar'
                    ? {
                        title: 'حذف',
                        field: '',
                        formatter: _this.deleteFormatIcon,
                        cellClick: function (e, cell) {
                            // this.delete(cell.getRow().getData().id);
                        }
                    }
                    : {
                        title: 'Delete',
                        field: '',
                        formatter: _this.deleteFormatIcon,
                        cellClick: function (e, cell) {
                            //  this.delete(cell.getRow().getData().id);
                        }
                    },
                _this.lang == 'ar'
                    ? {
                        title: 'تعديل',
                        field: '',
                        formatter: _this.editFormatIcon,
                        cellClick: function (e, cell) {
                            //  this.edit(cell.getRow().getData().id);
                        }
                    }
                    : {
                        title: 'Edit',
                        field: '',
                        formatter: _this.editFormatIcon,
                        cellClick: function (e, cell) {
                            //  this.edit(cell.getRow().getData().id);
                        }
                    },
            ];
        });
    };
    ContractListComponent.prototype.editFormatIcon = function () {
        //plain text value
        return "<i class=' fa fa-edit'></i>";
    };
    ContractListComponent.prototype.deleteFormatIcon = function () {
        //plain text value
        return "<i class=' fa fa-trash'></i>";
    };
    ContractListComponent.prototype.CheckBoxFormatIcon = function () {
        //plain text value
        return "<input id='yourID' type='checkbox' />";
    };
    ContractListComponent.prototype.ngOnInit = function () {
        var _this = this;
        var sub = this.activatedRoute.queryParams.subscribe({
            next: function (res) {
                _this.settingId = res['settingId'];
                _this.typeId = res['typeId'];
                _this.listenToClickedButton();
                _this.getPagePermissions();
                _this.getLanguage();
                _this.getContractSettings();
                _this.getAllVM();
            }
        });
        this.subsList.push(sub);
        this.defineGridColumn();
    };
    ContractListComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        setTimeout(function () {
            // let contractEnName = localStorage.getItem("contractEnName")!;
            // let contractArName = localStorage.getItem("contractArName")!;
            // this.toolbarPathData.componentList = this.lang == 'ar' ? contractArName : contractEnName
            _this.sharedService.changeButton({ action: 'List' });
            // this.sharedService.changeToolbarPath(this.toolbarPathData);
        }, 300);
    };
    //#region ngOnDestroy
    ContractListComponent.prototype.ngOnDestroy = function () {
        this.subsList.forEach(function (s) {
            if (s) {
                s.unsubscribe();
            }
        });
    };
    //#endregion
    ContractListComponent.prototype.getLanguage = function () {
        var _this = this;
        this.sharedService.getLanguage().subscribe(function (res) {
            _this.lang = res;
        });
    };
    ContractListComponent.prototype.getPagePermissions = function () {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.contractSettingsUserPermisionsService
                .getAll('GetContractSettingsUsersPermissionsOfCurrentUser')
                .subscribe({
                next: function (res) {
                    var _a;
                    var permissions = JSON.parse(JSON.stringify(res.data));
                    _this.pagePermission = permissions.find(function (x) { return x.contractSettingId == Number(_this.settingId); });
                    _this.userPermissions = JSON.parse((_a = _this.pagePermission) === null || _a === void 0 ? void 0 : _a.permissionsJson);
                    _this.sharedService.setUserPermissions(_this.userPermissions);
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
    ContractListComponent.prototype.getContractSettings = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var sub = _this.contractSettingService.getAll('GetAll').subscribe({
                next: function (res) {
                    if (res.success) {
                        _this.contractSettings = JSON.parse(JSON.stringify(res.data.find(function (x) {
                            return x.id == _this.settingId && x.contractTypeId == _this.typeId;
                        })));
                        // localStorage.setItem("contractArName", this.contractSettings.contractArName);
                        // localStorage.setItem("contractEnName", this.contractSettings.contractEnName);
                        // this.toolbarPathData.componentAdd =
                        //   this.lang == 'ar'
                        //     ? 'اضافة' + ' ' + this.contractSettings.contractArName
                        //     : 'Add' + ' ' + this.contractSettings.contractEnName;
                        _this.toolbarPathData.componentList =
                            _this.lang == 'ar'
                                ? _this.contractSettings.contractArName
                                : _this.contractSettings.contractEnName;
                        _this.sharedService.changeToolbarPath(_this.toolbarPathData);
                    }
                    resolve();
                },
                error: function (err) {
                    reject(err);
                },
                complete: function () { }
            });
            _this.subsList.push(sub);
        });
        // return new Promise<void>((resolve, reject) => {
        //   let sub = this.store.select(ContractSettingSelectors.selectors.getListSelector).subscribe({
        //     next: (res: ContractSettingModel) => {
        //      // this.contractSettings = JSON.parse(JSON.stringify(res.list));
        //       resolve();
        //       ;
        //       this.contractSettings = res.list.find(x => x.id == this.settingId && x.contractTypeId==this.typeId) ?? new ContractsSettings();
        //     },
        //     error: (err: any) => {
        //       resolve();
        //     },
        //     complete: () => {
        //       resolve();
        //     },
        //   });
        //   this.subsList.push(sub);
        // });
    };
    ContractListComponent.prototype.getAllVM = function () {
        var _this = this;
        var sub = this.contractService
            .getWithResponse('GetListByFieldNameVM?fieldName=Contract_Setting_Id&fieldValue=' +
            this.settingId)
            .subscribe({
            next: function (res) {
                //(("***************************************************123", res);
                if (res.success) {
                    _this.contracts = JSON.parse(JSON.stringify(res.data));
                }
            },
            error: function (err) { },
            complete: function () { }
        });
        this.subsList.push(sub);
    };
    ContractListComponent.prototype.openAddNewContract = function () { };
    ContractListComponent.prototype.onMenuActionSelected = function (e) { };
    ContractListComponent.prototype.onSearchTextChange = function (searchTxt) {
        this.searchFilters = [
            [
                { field: 'contractNumber', type: 'like', value: searchTxt },
                { field: 'ownerNameAr', type: 'like', value: searchTxt },
                { field: 'ownerNameEn', type: 'like', value: searchTxt },
                { field: 'purchaserNameAr', type: 'like', value: searchTxt },
                { field: 'purchaserNameEn', type: 'like', value: searchTxt },
                { field: 'buildingNameAr', type: 'like', value: searchTxt },
                { field: 'buildingNameEn', type: 'like', value: searchTxt },
            ],
        ];
    };
    ContractListComponent.prototype.setToolbarComponentData = function () {
        var contractArName = localStorage.getItem('contractArName');
        var contractEnName = localStorage.getItem('contractEnName');
        // this.toolbarPathData.componentAdd =
        //   this.lang == 'ar'
        //     ? 'تحديث' + ' ' + contractArName
        //     : 'Update' + ' ' + contractEnName;
        this.toolbarPathData.componentList =
            this.lang == 'ar' ? contractArName : contractEnName;
        this.sharedService.changeToolbarPath(this.toolbarPathData);
    };
    ContractListComponent.prototype.listenToClickedButton = function () {
        var _this = this;
        var sub = this.sharedService.getClickedbutton().subscribe({
            next: function (currentBtn) {
                //currentBtn;
                if (currentBtn != null) {
                    if (currentBtn.action == enums_1.ToolbarActions.List) {
                        _this.setToolbarComponentData();
                    }
                    else if (currentBtn.action == enums_1.ToolbarActions.New) {
                        _this.setToolbarComponentData();
                        _this.router.navigate([_this.addUrl], {
                            queryParams: {
                                settingId: _this.settingId,
                                typeId: _this.typeId
                            }
                        });
                    }
                }
            }
        });
        this.subsList.push(sub);
    };
    ContractListComponent = __decorate([
        core_1.Component({
            selector: 'app-contract-list',
            templateUrl: './contract-list.component.html',
            styleUrls: ['./contract-list.component.scss']
        })
    ], ContractListComponent);
    return ContractListComponent;
}());
exports.ContractListComponent = ContractListComponent;
