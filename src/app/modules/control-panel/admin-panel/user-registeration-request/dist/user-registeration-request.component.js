"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.UserRegisterationRequestComponent = void 0;
var core_1 = require("@angular/core");
var user_registerations_1 = require("src/app/core/models/user-registerations");
var message_modal_component_1 = require("src/app/shared/message-modal/message-modal.component");
var enums_1 = require("src/app/core/constants/enumrators/enums");
var PAGEID = 1; // from pages table in database seeding table
var UserRegisterationRequestComponent = /** @class */ (function () {
    //#endregion
    //#region Constructor
    function UserRegisterationRequestComponent(UserRegisterationsService, authenticationService, modalService, alertsService, rolesPerimssionsService, spinner, sharedService, translate, router) {
        this.UserRegisterationsService = UserRegisterationsService;
        this.authenticationService = authenticationService;
        this.modalService = modalService;
        this.alertsService = alertsService;
        this.rolesPerimssionsService = rolesPerimssionsService;
        this.spinner = spinner;
        this.sharedService = sharedService;
        this.translate = translate;
        this.router = router;
        //#region Main Declarations
        this.userRegisterationList = [];
        this.userRegisteration = new user_registerations_1.UserRegisterations();
        this.subsList = [];
        //#endregion
        //#region Tabulator
        this.panelId = 1;
        this.sortByCols = [];
        this.groupByCols = [];
        this.lang = '';
        this.columnNames = [];
        this.direction = 'ltr';
    }
    //#endregion
    //#region ngOnInit
    UserRegisterationRequestComponent.prototype.ngOnInit = function () {
        this.getPagePermissions(PAGEID);
        this.sharedService.changeButton({ action: 'Disactive', submitMode: false });
        this.getAllRegisterationsRequests();
        this.defineGridColumn();
    };
    //#endregion
    //#region ngOnDestroy
    UserRegisterationRequestComponent.prototype.ngOnDestroy = function () {
    };
    UserRegisterationRequestComponent.prototype.getPagePermissions = function (pageId) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.rolesPerimssionsService.getAll("GetPagePermissionById?pageId=" + pageId).subscribe({
                next: function (res) {
                    _this.rolePermission = JSON.parse(JSON.stringify(res.data));
                    _this.userPermissions = JSON.parse(_this.rolePermission.permissionJson);
                    _this.sharedService.setUserPermissions(_this.userPermissions);
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
    //#region Basic Data
    //Get all registeration requests
    UserRegisterationRequestComponent.prototype.getAllRegisterationsRequests = function () {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.UserRegisterationsService.getAll("GetAll").subscribe({
                next: function (res) {
                    _this.userRegisterationList = res.data.map(function (res) {
                        return res;
                    });
                    resolve();
                    //(("res", res);
                    //((" this.userRegisterationList", this.userRegisterationList);
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
    UserRegisterationRequestComponent.prototype.createUser = function (item) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.authenticationService.createUser(item).subscribe({
                next: function (res) {
                    var response = JSON.parse(JSON.stringify(res));
                    //(("createUser response  createUser ", response)
                    if (response.success) {
                        _this.showResponseMessage(response.success, enums_1.AlertTypes.success, _this.translate.transform("messages.create-user-success"));
                    }
                    else if (response.success == false) {
                        _this.showResponseMessage(response.success, enums_1.AlertTypes.warning, _this.translate.transform("messages.existing-user"));
                    }
                    resolve();
                },
                error: function (err) {
                    reject(err);
                },
                complete: function () {
                }
            });
        });
        return promise.then(function (a) {
            _this.getAllRegisterationsRequests();
        });
    };
    //#region CRUD Operations
    //Appove user request / create user profile
    // updateRequestStatus(item: UserRegisterations) {
    //
    //   if (item != null) {
    //     ;
    //     this.authenticationService.createUser(item).subscribe(result => {
    //       if (result != null) {
    //         //(("result createUser ", result)
    //         item.requestStatus = 1;
    //         this.UserRegisterationsService.activateRequest(item).subscribe(response => {
    //           //(("response updaet ", response)
    //         });
    //       }
    //     });
    //   }
    // }
    UserRegisterationRequestComponent.prototype.updateRequestStatus = function (item) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.authenticationService.createUser(item).subscribe({
                next: function (res) {
                    var response = JSON.parse(JSON.stringify(res));
                    //(("createUser response  createUser ", response)
                    if (response.success) {
                        _this.showResponseMessage(response.success, enums_1.AlertTypes.success, _this.translate.transform("messages.create-user-success"));
                        _this.activateUser(item);
                    }
                    else if (response.success == false) {
                        _this.showResponseMessage(response.success, enums_1.AlertTypes.warning, _this.translate.transform("messages.existing-user"));
                    }
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
    // activateUser(item: UserRegisterations) {
    //   item.requestStatus = 1;
    //   this.UserRegisterationsService.activateRequest(item).subscribe(response => {
    //     //(("response update status", response)
    //   });
    // }
    UserRegisterationRequestComponent.prototype.activateUser = function (item) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.UserRegisterationsService.activateRequest(item).subscribe({
                next: function (res) {
                    var response = JSON.parse(JSON.stringify(res));
                    //(("activateUser response   ", response)
                    if (response.success) {
                        _this.showResponseMessage(response.success, enums_1.AlertTypes.info, _this.translate.transform("messages.activate-user-success"));
                    }
                    else if (response.success == false) {
                        _this.showResponseMessage(response.success, enums_1.AlertTypes.warning, _this.translate.transform("messages.existing-user"));
                    }
                    resolve();
                },
                error: function (err) {
                    reject(err);
                },
                complete: function () {
                }
            });
        });
        return promise.then(function (a) {
            _this.getAllRegisterationsRequests();
        });
    };
    UserRegisterationRequestComponent.prototype.cancelRequset = function (item) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.UserRegisterationsService.cancelRequset(item).subscribe({
                next: function (res) {
                    var response = JSON.parse(JSON.stringify(res));
                    //(("cancelRequset response   ", response)
                    if (response.success) {
                        _this.showResponseMessage(response.success, enums_1.AlertTypes.success, _this.translate.transform("messages.deactivate-user-success"));
                    }
                    else if (response.success == false) {
                        _this.showResponseMessage(response.success, enums_1.AlertTypes.warning, _this.translate.transform("messages.existing-user"));
                    }
                    resolve();
                },
                error: function (err) {
                    reject(err);
                },
                complete: function () {
                }
            });
        });
        return promise.then(function (a) {
            _this.getAllRegisterationsRequests();
        });
    };
    //Cancel user request
    // cancelRequset(item: UserRegisterations) {
    //   this.UserRegisterationsService.cancelRequset(item).subscribe(response => {
    //     //(("response Cancel Requset", response);
    //   });
    // }
    //Delete user request
    UserRegisterationRequestComponent.prototype.deleteRequset = function (id) {
        this.showConfirmDeleteMessage(id);
    };
    //#endregion
    //
    //#region Helper Functions
    UserRegisterationRequestComponent.prototype.showResponseMessage = function (responseStatus, alertType, message) {
        if (responseStatus == true && enums_1.AlertTypes.success == alertType) {
            this.alertsService.showSuccess(message, this.translate.transform("messageTitle.done"));
        }
        else if (responseStatus == false && enums_1.AlertTypes.warning) {
            this.alertsService.showWarning(message, this.translate.transform("messageTitle.alert"));
        }
        else if (responseStatus == true && enums_1.AlertTypes.info) {
            this.alertsService.showInfo(message, this.translate.transform("messageTitle.info"));
        }
        else if (responseStatus == false && enums_1.AlertTypes.error) {
            this.alertsService.showError(message, this.translate.transform("messageTitle.error"));
        }
    };
    UserRegisterationRequestComponent.prototype.showConfirmDeleteMessage = function (id) {
        var _this = this;
        var modalRef = this.modalService.open(message_modal_component_1.MessageModalComponent);
        modalRef.componentInstance.message = this.translate.transform("messages.confirm-delete");
        modalRef.componentInstance.title = this.translate.transform("messages.delete");
        modalRef.componentInstance.btnConfirmTxt = this.translate.transform("buttons.delete");
        modalRef.componentInstance.isYesNo = true;
        modalRef.result.then(function (rs) {
            //((rs);
            if (rs == 'Confirm') {
                _this.UserRegisterationsService.deleteWithUrl("Delete?id=" + id).subscribe(function (resonse) {
                    //(('delet response', resonse);
                    _this.spinner.show();
                    setTimeout(function () {
                        _this.spinner.hide();
                    }, 500);
                    _this.getAllRegisterationsRequests();
                    if (resonse.success == true) {
                        _this.showResponseMessage(resonse.success, enums_1.AlertTypes.success, _this.translate.transform("messages.delete-success"));
                    }
                    else if (resonse.success == false) {
                        _this.showResponseMessage(resonse.success, enums_1.AlertTypes.error, _this.translate.transform("messages.delete-faild"));
                    }
                });
            }
        });
    };
    UserRegisterationRequestComponent.prototype.defineGridColumn = function () {
        var _this = this;
        this.sharedService.getLanguage().subscribe(function (res) {
            _this.lang = res;
            _this.columnNames = [
                _this.lang == 'ar'
                    ? { title: ' الاسم', field: 'nameAr' }
                    : { title: ' Name  ', field: 'nameEn' },
                {
                    title: _this.lang == 'ar' ? 'أسم المستخدم' : 'Username',
                    field: 'userName'
                },
                {
                    title: _this.lang == 'ar' ? 'البريد الالكترونى' : 'Email',
                    field: 'email'
                },
                {
                    title: _this.lang == 'ar' ? 'رقم الهاتف' : ' Mobile No',
                    field: 'mobile'
                },
                {
                    title: _this.lang == 'ar' ? 'حالة الطلب' : 'Request Status',
                    field: 'requestStatus', formatter: _this.requestStatusFormatter
                },
                _this.lang == "ar" ? {
                    title: "الموافقة و انشاء المستخدم",
                    field: "", formatter: _this.approveFormatIcon,
                    cellClick: function (e, cell) {
                        _this.updateRequestStatus(cell.getRow().getData());
                    }
                }
                    :
                        {
                            title: "Approve & Create user",
                            field: "", formatter: _this.approveFormatIcon,
                            cellClick: function (e, cell) {
                                _this.updateRequestStatus(cell.getRow().getData());
                            }
                        },
                _this.lang == "ar" ? {
                    title: "تنشيط ",
                    field: "", formatter: _this.activateUserFormatIcon,
                    cellClick: function (e, cell) {
                        _this.activateUser(cell.getRow().getData());
                    }
                }
                    :
                        {
                            title: "Activate",
                            field: "", formatter: _this.activateUserFormatIcon,
                            cellClick: function (e, cell) {
                                _this.activateUser(cell.getRow().getData());
                            }
                        },
                _this.lang == "ar" ? {
                    title: "الغاء",
                    field: "", formatter: _this.cancelFormatIcon,
                    cellClick: function (e, cell) {
                        _this.cancelRequset(cell.getRow().getData());
                    }
                } :
                    {
                        title: "Cancel User Activation",
                        field: "", formatter: _this.cancelFormatIcon,
                        cellClick: function (e, cell) {
                            _this.cancelRequset(cell.getRow().getData());
                        }
                    },
                _this.lang == "ar" ? {
                    title: "حذف",
                    field: "", formatter: _this.deleteFormatIcon,
                    cellClick: function (e, cell) {
                        _this.deleteRequset(cell.getRow().getData().id);
                    }
                } :
                    {
                        title: "Delete",
                        field: "", formatter: _this.deleteFormatIcon,
                        cellClick: function (e, cell) {
                            _this.deleteRequset(cell.getRow().getData().id);
                        }
                    },
            ];
        });
    };
    UserRegisterationRequestComponent.prototype.requestStatusFormatter = function (cell, formatterParams, onRendered) {
        console.log(cell.getValue());
        return cell.getValue() ? "<i class=' fa fa-check' ></i>" : "<i class=' fas fa-user-times'></i>";
    };
    UserRegisterationRequestComponent.prototype.approveFormatIcon = function () {
        return "<i class='  fas fa-user-plus'></i>";
    };
    ;
    UserRegisterationRequestComponent.prototype.activateUserFormatIcon = function () {
        return "<i class=' fas fa-user-check' ></i>";
    };
    ;
    UserRegisterationRequestComponent.prototype.cancelFormatIcon = function () {
        return "<i class=' fas fa-user-lock'></i>";
    };
    ;
    UserRegisterationRequestComponent.prototype.editFormatIcon = function () {
        return "<i class=' fa fa-edit'></i>";
    };
    ;
    UserRegisterationRequestComponent.prototype.deleteFormatIcon = function () {
        return "<i class=' fa fa-trash'></i>";
    };
    ;
    UserRegisterationRequestComponent.prototype.CheckBoxFormatIcon = function () {
        return "<input id='yourID' type='checkbox' />";
    };
    ;
    UserRegisterationRequestComponent.prototype.onSearchTextChange = function (searchTxt) {
        this.searchFilters = [
            [
                { field: 'nameAr', type: 'like', value: searchTxt },
                { field: 'nameEn', type: 'like', value: searchTxt },
                { field: 'userName', type: 'like', value: searchTxt },
                { field: 'email', type: 'like', value: searchTxt },
                { field: 'mobile', type: 'like', value: searchTxt },
                ,
            ],
        ];
    };
    UserRegisterationRequestComponent.prototype.openAddOwners = function () { };
    UserRegisterationRequestComponent.prototype.listenToClickedButton = function () {
        var sub = this.sharedService.getClickedbutton().subscribe({
            next: function (currentBtn) {
                currentBtn;
                if (currentBtn != null) {
                    if (currentBtn.action == enums_1.ToolbarActions.List) {
                        // this.router.navigate(['/control-panel/definitions/buildings']);
                    }
                    else if (currentBtn.action == enums_1.ToolbarActions.New) {
                        // this.router.navigate([this.addUrl]);
                    }
                }
            }
        });
        this.subsList.push(sub);
    };
    //#endregion
    UserRegisterationRequestComponent.prototype.openAddUserRegisterationRequests = function () { };
    UserRegisterationRequestComponent = __decorate([
        core_1.Component({
            selector: 'app-user-registeration-request',
            templateUrl: './user-registeration-request.component.html',
            styleUrls: ['./user-registeration-request.component.scss']
        })
    ], UserRegisterationRequestComponent);
    return UserRegisterationRequestComponent;
}());
exports.UserRegisterationRequestComponent = UserRegisterationRequestComponent;
