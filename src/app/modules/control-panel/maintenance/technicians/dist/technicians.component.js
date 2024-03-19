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
exports.TechniciansComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var enums_1 = require("src/app/core/constants/enumrators/enums");
var maintenance_services_1 = require("src/app/core/models/maintenance-services");
var input_validators_1 = require("src/app/core/constants/input-validators");
var PAGEID = 22; // from pages table in database seeding table
var TechniciansComponent = /** @class */ (function () {
    //#endregion
    //#region Constructor
    function TechniciansComponent(NationalityService, MaintenanceServicesService, TechniciansMaintenanceServicesService, CountriesService, RegionsService, CitiesService, rolesPerimssionsService, DistrictsService, TechniciansService, alertsService, sharedServices, dateService, spinner, router, fb, route, translate, searchDialog) {
        this.NationalityService = NationalityService;
        this.MaintenanceServicesService = MaintenanceServicesService;
        this.TechniciansMaintenanceServicesService = TechniciansMaintenanceServicesService;
        this.CountriesService = CountriesService;
        this.RegionsService = RegionsService;
        this.CitiesService = CitiesService;
        this.rolesPerimssionsService = rolesPerimssionsService;
        this.DistrictsService = DistrictsService;
        this.TechniciansService = TechniciansService;
        this.alertsService = alertsService;
        this.sharedServices = sharedServices;
        this.dateService = dateService;
        this.spinner = spinner;
        this.router = router;
        this.fb = fb;
        this.route = route;
        this.translate = translate;
        this.searchDialog = searchDialog;
        this.nationalities = [];
        this.technicians = [];
        this.countries = [];
        this.cities = [];
        this.regions = [];
        this.districts = [];
        this.technicianTypes = [];
        this.maintenanceServices = [];
        this.selectedTechniciansMaintenanceServices = [];
        this.id = 0;
        this.errorMessage = '';
        this.errorClass = '';
        this.emailRegEx = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
        this.addUrl = '/control-panel/maintenance/add-technician';
        this.updateUrl = '/control-panel/maintenance/update-technician/';
        this.listUrl = '/control-panel/maintenance/technicians-list';
        this.toolbarPathData = {
            listPath: '',
            updatePath: this.updateUrl,
            addPath: this.addUrl,
            componentList: 'menu.technicians',
            componentAdd: 'technicians.add-technician'
        };
        this.submited = false;
        // hashed by mohamed kandil 10-4-2023
        // addMaintenanceServices() {
        //
        //   if (this.technicianMaintenanceServicesForm.valid) {
        //     var maintenanceService: any = ''
        //     if (this.technicianMaintenanceServicesForm.value.maintenanceServiceId != '') {
        //       this.maintenanceServices.forEach(element => {
        //         if (element.id == this.technicianMaintenanceServicesForm.value.maintenanceServiceId) {
        //           ;
        //           maintenanceService = element;
        //         }
        //       })
        //     }
        //     this.selectedTechniciansMaintenanceServices.push(
        //       {
        //         maintenanceServiceId: this.technicianMaintenanceServicesForm.value.maintenanceServiceId ? this.technicianMaintenanceServicesForm.value.maintenanceServiceId : '',
        //         serviceNameAr: this.technicianMaintenanceServicesForm.value.maintenanceServiceId ? maintenanceService.serviceNameAr : '',
        //         serviceNameEn: this.technicianMaintenanceServicesForm.value.maintenanceServiceId ? maintenanceService.serviceNameEn : '',
        //         id: 0,
        //         technicianId: undefined,
        //         technicianNameAr: '',
        //         technicianNameEn: ''
        //       }
        //     )
        //     this.technicianMaintenanceServicesForm = this.fb.group({
        //       id: 0,
        //       maintenanceServiceId: ['', Validators.compose([Validators.required])],
        //       technicianId:''
        //     })
        //   }
        //   else {
        //     return this.technicianMaintenanceServicesForm.markAllAsTouched();
        //   }
        //   this.defineGridColumn();
        // }
        this.selectedMaintainanceServices = new maintenance_services_1.MaintenanceServices();
        this.isEmptyInput = false;
        //#endregion
        //#region Tabulator
        this.subsList = [];
        //#endregion
        //#region Tabulator
        this.panelId = 1;
        this.sortByCols = [];
        this.groupByCols = [];
        this.lang = '';
        this.columnNames = [];
        this.menuOptions = {
            showDelete: true
        };
        this.direction = 'ltr';
        // editItem(index) {
        //   ;
        //   console.log("------------",this.selectedMaintenanceServices)
        //   let item = this.selectedTechniciansMaintenanceServices[index];
        //   if(item??null)
        //   {
        //     this.selectedTechniciansMaintenanceServices[index].maintenanceServiceId=this.selectedMaintainanceServices.id;
        //     this.selectedTechniciansMaintenanceServices[index].serviceNameAr=this.selectedMaintainanceServices.serviceNameAr;
        //     this.selectedTechniciansMaintenanceServices[index].serviceNameEn=this.selectedMaintainanceServices.serviceNameEn;
        //   }
        // }
        this.selectedMaintenanceServices = new maintenance_services_1.MaintenanceServices();
        this.maintenanceService = new maintenance_services_1.MaintenanceServices();
        this.createTechnicianForm();
    }
    //#endregion
    //#region ngOnInit
    TechniciansComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.loadData();
        //this.sharedServices.changeButton({action:"New"}as ToolbarData);
        this.sharedServices.changeToolbarPath(this.toolbarPathData);
        this.sub = this.route.params.subscribe(function (params) {
            if (params['id'] != null) {
                _this.id = +params['id'];
                if (_this.id > 0) {
                    _this.sharedServices.changeButton({ action: "Update", submitMode: false });
                    _this.toolbarPathData.componentAdd = 'technicians.update-technician';
                    _this.getTechnicianById(_this.id);
                    _this.getTechnicianMaintenanceServicesByTechnicianId(_this.id);
                }
            }
            else {
            }
        });
    };
    //#endregion
    //#region ngOnDestroy
    TechniciansComponent.prototype.ngOnDestroy = function () {
        this.subsList.forEach(function (s) {
            if (s) {
                s.unsubscribe();
            }
        });
    };
    TechniciansComponent.prototype.getPagePermissions = function (pageId) {
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
    //#region  State Management
    //#endregion
    //#region Basic Data
    ///Geting form dropdown list data
    TechniciansComponent.prototype.createTechnicianForm = function () {
        this.technicianForm = this.fb.group({
            id: 0,
            technicianNameAr: input_validators_1.NAME_REQUIRED_VALIDATORS,
            technicianNameEn: input_validators_1.NAME_REQUIRED_VALIDATORS,
            technicianType: ['', forms_1.Validators.compose([forms_1.Validators.required])],
            phone: input_validators_1.PHONE_VALIDATORS,
            mobile: input_validators_1.MOBILE_VALIDATORS,
            fax: input_validators_1.FAX_VALIDATORS,
            email: input_validators_1.EMAIL_REQUIRED_VALIDATORS,
            identityNumber: '',
            identityIssuanceDate: '',
            identityIssuancePlace: '',
            identityExpireDate: '',
            nationalityId: '',
            job: '',
            countryId: '',
            regionId: '',
            cityId: '',
            districtId: '',
            blockNumber: '',
            apartmentNumber: '',
            postalCode: '',
            additionalCode: '',
            detailedAddress: ''
        });
        this.identityIssuanceDate = this.dateService.getCurrentDate();
        this.identityExpireDate = this.dateService.getCurrentDate();
        this.technicianMaintenanceServicesForm = this.fb.group({
            id: 0,
            technicianId: '',
            maintenanceServiceId: ['', forms_1.Validators.compose([forms_1.Validators.required])]
        });
    };
    TechniciansComponent.prototype.loadData = function () {
        var _this = this;
        this.getPagePermissions(PAGEID);
        this.currnetUrl = this.router.url;
        this.listenToClickedButton();
        this.changePath();
        this.getLanguage();
        this.getTechnicianTypes();
        this.spinner.show();
        Promise.all([
            this.getNationalities(),
            this.getCountries(),
            this.getRegions(),
            this.getCities(),
            this.getDistricts(),
            this.getMaintenanceServices(),
        ]).then(function (a) {
            _this.spinner.hide();
        });
    };
    TechniciansComponent.prototype.getLanguage = function () {
        var _this = this;
        this.sharedServices.getLanguage().subscribe(function (res) {
            _this.lang = res;
        });
    };
    TechniciansComponent.prototype.getCountries = function () {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.CountriesService.getAll('GetAll').subscribe({
                next: function (res) {
                    _this.countries = res.data.map(function (res) {
                        return res;
                    });
                    resolve();
                    //(("res", res);
                    //((" this.countries", this.countries);
                },
                error: function (err) {
                    reject(err);
                },
                complete: function () { }
            });
        });
        return promise;
    };
    TechniciansComponent.prototype.getRegions = function (countryId) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.RegionsService.getAll('GetAll').subscribe({
                next: function (res) {
                    if (res != null) {
                        _this.regions = res.data
                            .filter(function (x) { return x.countryId == countryId; })
                            .map(function (res) {
                            return res;
                        });
                    }
                    else {
                        _this.regions = res.data.map(function (res) {
                            return res;
                        });
                    }
                    resolve();
                    //(("res", res);
                    //((" this.regions", this.regions);
                },
                error: function (err) {
                    reject(err);
                },
                complete: function () { }
            });
        });
        return promise;
    };
    TechniciansComponent.prototype.getCities = function (regionId) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.CitiesService.getAll('GetAll').subscribe({
                next: function (res) {
                    if (res != null) {
                        _this.cities = res.data
                            .filter(function (x) { return x.regionId == regionId; })
                            .map(function (res) {
                            return res;
                        });
                    }
                    else {
                        _this.cities = res.data.map(function (res) {
                            return res;
                        });
                    }
                    resolve();
                    //(("res", res);
                    //((" this.cities", this.cities);
                },
                error: function (err) {
                    reject(err);
                },
                complete: function () { }
            });
        });
        return promise;
    };
    TechniciansComponent.prototype.getDistricts = function (cityId) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.DistrictsService.getAll('GetAll').subscribe({
                next: function (res) {
                    if (res != null) {
                        _this.districts = res.data
                            .filter(function (x) { return x.cityId == cityId; })
                            .map(function (res) {
                            return res;
                        });
                    }
                    else {
                        _this.districts = res.data.map(function (res) {
                            return res;
                        });
                    }
                    resolve();
                    //(("res", res);
                    //((" this.districts", this.districts);
                },
                error: function (err) {
                    reject(err);
                },
                complete: function () { }
            });
        });
        return promise;
    };
    TechniciansComponent.prototype.getNationalities = function () {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.NationalityService.getAll('GetAll').subscribe({
                next: function (res) {
                    _this.nationalities = res.data.map(function (res) {
                        return res;
                    });
                    resolve();
                    //(("res", res);
                    //((" this.nationalities", this.nationalities);
                },
                error: function (err) {
                    reject(err);
                },
                complete: function () { }
            });
        });
        return promise;
    };
    TechniciansComponent.prototype.getMaintenanceServices = function () {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.MaintenanceServicesService.getAll('GetAll').subscribe({
                next: function (res) {
                    _this.maintenanceServices = res.data.map(function (res) {
                        return res;
                    });
                    resolve();
                    console.log('this.maintenanceServices ', _this.maintenanceServices);
                    //(("res", res);
                    //((" this.maintenanceServices", this.maintenanceServices);
                },
                error: function (err) {
                    reject(err);
                },
                complete: function () { }
            });
        });
        return promise;
    };
    TechniciansComponent.prototype.getTechnicianTypes = function () {
        if (this.lang == 'en') {
            this.technicianTypes = enums_1.convertEnumToArray(enums_1.TechnicianTypeEnum);
        }
        else {
            this.technicianTypes = enums_1.convertEnumToArray(enums_1.TechnicianTypeArEnum);
        }
    };
    //#endregion
    //#region CRUD Operations
    TechniciansComponent.prototype.getTechnicianById = function (id) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.TechniciansService.getById(id).subscribe({
                next: function (res) {
                    //(("result data getbyid", res.data);
                    _this.technicianForm.setValue({
                        id: _this.id,
                        technicianNameAr: res.data.technicianNameAr,
                        technicianNameEn: res.data.technicianNameEn,
                        technicianType: res.data.technicianType,
                        phone: res.data.phone,
                        mobile: res.data.mobile,
                        fax: res.data.fax,
                        email: res.data.email,
                        identityNumber: res.data.identityNumber,
                        identityIssuanceDate: res.data.identityIssuanceDate,
                        identityIssuancePlace: res.data.identityIssuancePlace,
                        identityExpireDate: res.data.identityExpireDate,
                        nationalityId: res.data.nationalityId,
                        job: res.data.job,
                        blockNumber: res.data.blockNumber,
                        apartmentNumber: res.data.apartmentNumber,
                        postalCode: res.data.postalCode,
                        additionalCode: res.data.additionalCode,
                        detailedAddress: res.data.detailedAddress,
                        countryId: res.data.countryId,
                        regionId: res.data.regionId,
                        cityId: res.data.cityId,
                        districtId: res.data.districtId
                    });
                    _this.getRegions(res.data.countryId);
                    _this.getCities(res.data.regionId);
                    _this.getDistricts(res.data.cityId);
                    _this.identityIssuanceDate = _this.dateService.getDateForCalender(res.data.identityIssuanceDate);
                    _this.identityExpireDate = _this.dateService.getDateForCalender(res.data.identityExpireDate);
                },
                error: function (err) {
                    reject(err);
                },
                complete: function () { }
            });
        });
        return promise;
    };
    TechniciansComponent.prototype.getTechnicianMaintenanceServicesByTechnicianId = function (id) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.TechniciansMaintenanceServicesService.getById(id).subscribe({
                next: function (res) {
                    if (res.data != null && res.data.length > 0) {
                        res.data.forEach(function (element) {
                            _this.selectedTechniciansMaintenanceServices.push({
                                id: element.id,
                                technicianId: element.technicianId,
                                maintenanceServiceId: element.maintenanceServiceId,
                                serviceNameAr: element.serviceNameAr,
                                serviceNameEn: element.serviceNameEn,
                                technicianNameAr: '',
                                technicianNameEn: ''
                            });
                        });
                        console.log('selectedTechniciansMaintenanceServices', _this.selectedTechniciansMaintenanceServices);
                        _this.defineGridColumn();
                    }
                },
                error: function (err) {
                    reject(err);
                },
                complete: function () { }
            });
        });
        return promise;
    };
    TechniciansComponent.prototype.onSave = function () {
        var _this = this;
        this.submited = true;
        if (this.technicianForm.valid) {
            this.technicianForm.value.id = this.id;
            this.technicianForm.value.identityIssuanceDate =
                this.dateService.getDateForInsertISO_Format(this.identityIssuanceDate);
            this.technicianForm.value.identityExpireDate =
                this.dateService.getDateForInsertISO_Format(this.identityExpireDate);
            var promise = new Promise(function (resolve, reject) {
                _this.TechniciansService.addData('insert', _this.technicianForm.value).subscribe({
                    next: function (result) {
                        _this.spinner.show();
                        //(("result:", result);
                        _this.Response = __assign({}, result.response);
                        var technicianId = result.response.data.id;
                        if (_this.selectedTechniciansMaintenanceServices.length > 0) {
                            _this.selectedTechniciansMaintenanceServices.forEach(function (element) {
                                element.technicianId = technicianId;
                                // this.TechniciansMaintenanceServicesService.addRequest(element).subscribe(
                                //   _result => {
                                //   }
                                // )
                            });
                            _this.TechniciansMaintenanceServicesService.addAllWithUrl('insert', _this.selectedTechniciansMaintenanceServices).subscribe(function (_result) { });
                        }
                        console.log(" this.selectedTechniciansMaintenanceServices", _this.selectedTechniciansMaintenanceServices);
                        _this.createTechnicianForm();
                        _this.submited = false;
                        setTimeout(function () {
                            _this.spinner.hide();
                            // this.showResponseMessage(this.Response.success, AlertTypes.success, this.Response.message);
                            _this.showResponseMessage(true, enums_1.AlertTypes.success, _this.translate.transform('messages.add-success'));
                            _this.navigateUrl(_this.listUrl);
                        }, 500);
                    },
                    error: function (err) {
                        reject(err);
                    },
                    complete: function () { }
                });
            });
            return promise;
        }
        else {
            // this.errorMessage = "Please enter valid data";
            // this.errorClass = 'errorMessage';
            // this.alertsService.showError(this.errorMessage, "خطأ")
            return this.technicianForm.markAllAsTouched();
        }
    };
    TechniciansComponent.prototype.onUpdate = function () {
        var _this = this;
        this.submited = true;
        if (this.technicianForm.value != null) {
            this.technicianForm.value.identityIssuanceDate =
                this.dateService.getDateForInsertISO_Format(this.identityIssuanceDate);
            this.technicianForm.value.identityExpireDate =
                this.dateService.getDateForInsertISO_Format(this.identityExpireDate);
            //(("this.technicianForm.value on update", this.technicianForm.value);
            var promise = new Promise(function (resolve, reject) {
                _this.TechniciansService.update(_this.technicianForm.value).subscribe({
                    next: function (result) {
                        _this.spinner.show();
                        //(("result update ", result);
                        _this.Response = __assign({}, result.response);
                        var technicianId = result.data.id;
                        if (_this.selectedTechniciansMaintenanceServices.length > 0) {
                            _this.selectedTechniciansMaintenanceServices.forEach(function (element) {
                                element.technicianId = technicianId;
                                // this.TechniciansMaintenanceServicesService.addRequest(element).subscribe(
                                //   _result => {
                                //   }
                                // )
                            });
                        }
                        _this.TechniciansMaintenanceServicesService.updateAllWithUrl('update', _this.selectedTechniciansMaintenanceServices).subscribe(function (_result) { });
                        _this.createTechnicianForm();
                        _this.submited = false;
                        setTimeout(function () {
                            _this.spinner.hide();
                            // this.showResponseMessage(result.success, AlertTypes.success, result.message);
                            _this.showResponseMessage(true, enums_1.AlertTypes.success, _this.translate.transform('messages.update-success'));
                            _this.navigateUrl(_this.listUrl);
                        },500);
                    },
                    error: function (err) {
                        reject(err);
                    },
                    complete: function () { }
                });
            });
            return promise;
        }
        else {
            //this.errorMessage = "Please enter valid data";
            //    this.errorClass = 'errorMessage';
            // this.alertsService.showError(this.errorMessage, "خطأ")
            return this.technicianForm.markAllAsTouched();
        }
    };
    TechniciansComponent.prototype.addMaintenanceService = function () {
        var _this = this;
        var _a, _b, _c, _d, _e, _f, _g;
        if ((_a = this.selectedMaintainanceServices.serviceNameEn) !== null && _a !== void 0 ? _a : null) {
            this.isEmptyInput = false;
            var maintenanceService = '';
            if (this.technicianMaintenanceServicesForm.value.maintenanceServiceId != '') {
                this.maintenanceServices.forEach(function (element) {
                    if (element.id == _this.technicianMaintenanceServicesForm.value.maintenanceServiceId) {
                        ;
                        maintenanceService = element;
                    }
                });
            }
            this.selectedTechniciansMaintenanceServices.push({
                maintenanceServiceId: (_c = (_b = this.selectedMaintainanceServices) === null || _b === void 0 ? void 0 : _b.id) !== null && _c !== void 0 ? _c : 0,
                serviceNameAr: (_e = (_d = this.selectedMaintainanceServices) === null || _d === void 0 ? void 0 : _d.serviceNameAr) !== null && _e !== void 0 ? _e : '',
                serviceNameEn: (_g = (_f = this.selectedMaintainanceServices) === null || _f === void 0 ? void 0 : _f.serviceNameEn) !== null && _g !== void 0 ? _g : '',
                id: 0,
                technicianId: undefined,
                technicianNameAr: '',
                technicianNameEn: ''
            });
            this.clearSelectedItemData();
        }
        else {
            this.isEmptyInput = true;
        }
    };
    TechniciansComponent.prototype.deleteTechniciansMaintenanceServices = function (item) {
        if (item != null) {
            var removedItem = this.selectedTechniciansMaintenanceServices.find(function (x) { return x.maintenanceServiceId == item.maintenanceServiceId; });
            var index = this.selectedTechniciansMaintenanceServices.indexOf(removedItem);
            if (index !== -1) {
                this.selectedTechniciansMaintenanceServices.splice(index, 1);
                this.defineGridColumn();
            }
        }
    };
    //#endregion
    //#region Helper Functions
    TechniciansComponent.prototype.showResponseMessage = function (responseStatus, alertType, message) {
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
    Object.defineProperty(TechniciansComponent.prototype, "f", {
        get: function () {
            return this.technicianForm.controls;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TechniciansComponent.prototype, "tms", {
        get: function () {
            return this.technicianMaintenanceServicesForm.controls;
        },
        enumerable: false,
        configurable: true
    });
    TechniciansComponent.prototype.listenToClickedButton = function () {
        var _this = this;
        var sub = this.sharedServices.getClickedbutton().subscribe({
            next: function (currentBtn) {
                currentBtn;
                if (currentBtn != null) {
                    if (currentBtn.action == enums_1.ToolbarActions.List) {
                        _this.sharedServices.changeToolbarPath({
                            listPath: _this.listUrl
                        });
                        _this.router.navigate([_this.listUrl]);
                    }
                    else if (currentBtn.action == enums_1.ToolbarActions.Save &&
                        currentBtn.submitMode) {
                        _this.onSave();
                    }
                    else if (currentBtn.action == enums_1.ToolbarActions.New) {
                        _this.toolbarPathData.componentAdd = 'technicians.add-technician';
                        _this.router.navigate([_this.addUrl]);
                        _this.createTechnicianForm();
                        _this.sharedServices.changeToolbarPath(_this.toolbarPathData);
                        _this.navigateUrl(_this.addUrl);
                    }
                    else if (currentBtn.action == enums_1.ToolbarActions.Update &&
                        currentBtn.submitMode) {
                        _this.onUpdate();
                    }
                }
            }
        });
        this.subsList.push(sub);
    };
    TechniciansComponent.prototype.changePath = function () {
        this.sharedServices.changeToolbarPath(this.toolbarPathData);
    };
    TechniciansComponent.prototype.navigateUrl = function (urlroute) {
        this.router.navigate([urlroute]);
    };
    TechniciansComponent.prototype.getIdentityExpireDate = function (selectedDate) {
        this.identityExpireDate = selectedDate;
    };
    TechniciansComponent.prototype.getIdentityIssuanceDate = function (selectedDate) {
        this.identityIssuanceDate = selectedDate;
    };
    TechniciansComponent.prototype.defineGridColumn = function () {
        var _this = this;
        this.sharedServices.getLanguage().subscribe(function (res) {
            _this.lang = res;
            _this.columnNames = [
                _this.lang == 'ar'
                    ? { title: 'الخدمة', field: 'serviceNameAr' }
                    : { title: ' Service  ', field: 'serviceNameEn' },
                _this.lang == 'ar'
                    ? {
                        title: 'حذف',
                        field: 'maintenanceServiceId',
                        formatter: _this.deleteFormatIcon,
                        cellClick: function (e, cell) {
                            _this.deleteTechniciansMaintenanceServices(cell.getRow().getData());
                        }
                    }
                    : {
                        title: 'Delete',
                        field: 'maintenanceServiceId',
                        formatter: _this.deleteFormatIcon,
                        cellClick: function (e, cell) {
                            _this.deleteTechniciansMaintenanceServices(cell.getRow().getData());
                        }
                    },
            ];
        });
    };
    TechniciansComponent.prototype.editFormatIcon = function () {
        //plain text value
        return "<i class=' fa fa-edit'></i>";
    };
    TechniciansComponent.prototype.deleteFormatIcon = function () {
        //plain text value
        return "<i class=' fa fa-trash'></i>";
    };
    TechniciansComponent.prototype.CheckBoxFormatIcon = function () {
        //plain text value
        return "<input id='yourID' type='checkbox' />";
    };
    TechniciansComponent.prototype.onSearchTextChange = function (searchTxt) {
        this.searchFilters = [
            [
                { field: 'serviceNameAr', type: 'like', value: searchTxt },
                { field: 'serviceNameEn', type: 'like', value: searchTxt },
                ,
            ],
        ];
    };
    TechniciansComponent.prototype.openAddSelectedTechniciansMaintenanceServices = function () { };
    TechniciansComponent.prototype.onMenuActionSelected = function (event) {
        if (event != null) {
            if (event.actionName == 'Delete') {
                this.deleteTechniciansMaintenanceServices(event.item);
            }
        }
    };
    //#endregion
    TechniciansComponent.prototype.deleteItem = function (index) {
        if (this.selectedTechniciansMaintenanceServices.length) {
            if (this.selectedTechniciansMaintenanceServices.length == 1) {
                this.selectedTechniciansMaintenanceServices = [];
            }
            else {
                this.selectedTechniciansMaintenanceServices.splice(index, 1);
            }
        }
    };
    TechniciansComponent.prototype.openSerivcesSearchDialog = function (i) {
        var _this = this;
        var _a, _b;
        if (i === void 0) { i = -1; }
        ;
        var searchTxt = '';
        if (i == -1) {
            searchTxt = (_b = (_a = this.selectedMaintainanceServices) === null || _a === void 0 ? void 0 : _a.serviceNameEn) !== null && _b !== void 0 ? _b : '';
        }
        else {
            searchTxt = this.selectedTechniciansMaintenanceServices[i].serviceNameEn;
        }
        var data = this.maintenanceServices.filter(function (x) {
            return ((x.serviceNameEn + ' ' + x.serviceNameEn)
                .toLowerCase()
                .includes(searchTxt) ||
                (x.serviceNameAr + ' ' + x.serviceNameAr)
                    .toUpperCase()
                    .includes(searchTxt));
        });
        if (data.length == 1) {
            if (i == -1) {
                this.selectedMaintainanceServices.serviceNameAr =
                    data[0].serviceNameEn;
                this.selectedMaintainanceServices.id = data[0].id;
            }
            else {
                this.selectedTechniciansMaintenanceServices[i].serviceNameEn = data[0].serviceNameEn;
                this.selectedTechniciansMaintenanceServices[i].maintenanceServiceId = data[0].id;
            }
        }
        else {
            var lables = ['الكود', 'الاسم', 'الاسم اللاتيني'];
            var names = ['id', 'serviceNameAr', 'serviceNameEn'];
            var title = this.lang == 'ar' ? 'بحث عن الوحدة' : 'Search Units';
            var sub = this.searchDialog
                .showDialog(lables, names, this.maintenanceServices, title, searchTxt)
                .subscribe(function (d) {
                if (d) {
                    if (i == -1) {
                        _this.selectedMaintainanceServices.serviceNameEn =
                            d.serviceNameEn;
                        _this.selectedMaintainanceServices.id = d.id;
                    }
                    else {
                        _this.selectedTechniciansMaintenanceServices[i].serviceNameEn = d.serviceNameEn;
                        _this.selectedTechniciansMaintenanceServices[i].maintenanceServiceId = d.id;
                    }
                }
            });
            this.subsList.push(sub);
        }
        // this.onVoucherDetailsChange.emit(this.voucherDetails);
    };
    TechniciansComponent.prototype.clearSelectedItemData = function () {
        this.selectedMaintainanceServices = {
            serviceNameAr: '',
            serviceNameEn: '',
            id: 0
        };
    };
    TechniciansComponent = __decorate([
        core_1.Component({
            selector: 'app-technicians',
            templateUrl: './technicians.component.html',
            styleUrls: ['./technicians.component.scss']
        })
    ], TechniciansComponent);
    return TechniciansComponent;
}());
exports.TechniciansComponent = TechniciansComponent;
