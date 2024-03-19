"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.TabulatorComponent = void 0;
var core_1 = require("@angular/core");
var Tabulator = require("tabulator-tables/dist/js/tabulator");
var TabulatorComponent = /** @class */ (function () {
    function TabulatorComponent(renderer, store, translate) {
        var _this = this;
        this.renderer = renderer;
        this.store = store;
        this.translate = translate;
        this.parentColName = "";
        this.idColName = "id";
        this.componentName = "";
        this.isModal = false;
        this.tabulatorStyle = "";
        this.onAddItem = new core_1.EventEmitter();
        this.onAddGroup = new core_1.EventEmitter();
        // @Input() showAddGroup:boolean = false;
        // @Input() showAddItem:boolean = false;
        this.onEditItem = new core_1.EventEmitter();
        this.onDeleteItem = new core_1.EventEmitter();
        this.onCheckItem = new core_1.EventEmitter();
        this.onSelectItem = new core_1.EventEmitter();
        this.onMenuActionSelected = new core_1.EventEmitter();
        this.showMenuOptions = {};
        this.panelId = 0;
        this.divId = "tabular";
        this.direction = "ltr";
        this.childRowData = [];
        this.groupByList = [];
        this.sortByList = [];
        this.subsList = [];
        this.onItemDoubleClick = new core_1.EventEmitter();
        this.searchTxt = "";
        this.onSearchTextChange = new core_1.EventEmitter();
        this.searchFilters = [];
        this.onShowGridFilterChange = new core_1.EventEmitter();
        this.isShowGridFilter = false;
        this.groupType = 0;
        this.path = "";
        this.showExport = true;
        this.filterOperations = [
            {
                nameAr: "يساوي",
                nameEn: "Equal",
                symbol: "="
            }, {
                nameAr: "أصغر من",
                nameEn: "Smaller than",
                symbol: "<"
            }, {
                nameAr: "أصغر من او يساوي",
                nameEn: "Smaller than or equal",
                symbol: "<="
            }, {
                nameAr: "أكبر من",
                nameEn: "Greater than",
                symbol: ">"
            }, {
                nameAr: "أكبر من او يساوي",
                nameEn: "Greater than or equal",
                symbol: ">="
            },
            {
                nameAr: "لا يساوي",
                nameEn: "Not equal",
                symbol: "!="
            }, {
                nameAr: "يحتوي",
                nameEn: "Like",
                symbol: "like"
            }
        ];
        this.decreaseHeight = '550';
        this.height = "100%";
        this.customStyle = "padding-left: 0px; padding-top: 0px;display: block;position: absolute;";
        // customStyle: string = `padding-left: 0px; padding-top: 0px;height: calc(100vh - ${this.decreaseHeight}px);display: block;position: absolute;`;
        this.columnSettings = [];
        this.columnNames = [];
        this.lang = localStorage.getItem("language");
        this.newColumns = [
            this.lang == "ar" ? {
                title: "حذف",
                field: "", formatter: this.deleteFormatIcon,
                cellClick: function (e, cell) {
                    _this.onDeleteItem.emit(cell.getRow().getData().id);
                }
            } :
                {
                    title: "Delete",
                    field: "", formatter: this.deleteFormatIcon,
                    cellClick: function (e, cell) {
                        _this.onDeleteItem.emit(cell.getRow().getData().id);
                    }
                },
            this.lang == "ar" ? {
                title: "تعديل",
                field: "", formatter: this.editFormatIcon,
                cellClick: function (e, cell) {
                    _this.onEditItem.emit(cell.getRow().getData().id);
                }
            }
                :
                    {
                        title: "Edit",
                        field: "", formatter: this.editFormatIcon,
                        cellClick: function (e, cell) {
                            _this.onEditItem.emit(cell.getRow().getData().id);
                        }
                    },
            this.lang == "ar" ? {
                title: "اختار",
                field: "", formatter: this.CheckBoxFormatIcon,
                cellClick: function (e, cell) {
                    _this.onCheckItem.emit(cell.getRow().getData().id);
                }
            }
                :
                    {
                        title: "select",
                        field: "", formatter: this.CheckBoxFormatIcon,
                        cellClick: function (e, cell) {
                            _this.onCheckItem.emit(cell.getRow().getData().id);
                        }
                    }
        ];
        this.headerMenu = function () {
            var menu = [];
            var columns = this.getColumns();
            var _loop_1 = function (column) {
                //create checkbox element using font awesome icons
                var icon = document.createElement("i");
                icon.classList.add("fas");
                icon.classList.add(column.isVisible() ? "fa-check-square" : "fa-square");
                //build label
                var label = document.createElement("span");
                var title = document.createElement("span");
                ////((column, column.getDefinition().title)
                title.textContent = " " + column.getDefinition().title;
                label.appendChild(icon);
                label.appendChild(title);
                //create menu item
                menu.push({
                    label: label,
                    action: function (e) {
                        //prevent menu closing
                        e.stopPropagation();
                        //toggle current column visibility
                        column.toggle();
                        //change menu item icon
                        if (column.isVisible()) {
                            icon.classList.remove("fa-square");
                            icon.classList.add("fa-check-square");
                        }
                        else {
                            icon.classList.remove("fa-check-square");
                            icon.classList.add("fa-square");
                        }
                    }
                });
            };
            for (var _i = 0, columns_1 = columns; _i < columns_1.length; _i++) {
                var column = columns_1[_i];
                _loop_1(column);
            }
            return menu;
        };
        this.getIcon = function (cell, formatterParams) {
            //plain text value
            return "<i class='fa fa-print'></i>";
        };
        this.onChangColumnsOption = function (column, scope) {
            if (scope.tabular) {
                var columns = scope.tabular.getColumns();
                for (var i = 0; i < columns.length; i++) {
                    _this.columnNames[i].visible = columns[i].isVisible();
                    _this.columnNames[i].width = columns[i].getWidth();
                }
            }
        };
    }
    TabulatorComponent.prototype.ngOnInit = function () {
        //this.listenToRedraw();
    };
    TabulatorComponent.prototype.drawTable = function () {
        var _this = this;
        var _a;
        ;
        var self = this;
        this.tabular = new Tabulator(this.tab, {
            //columns: this.columnNames,'
            cellDblClick: function (e, cell) {
                _this.onItemDoubleClick.emit(cell._cell.row.data);
            },
            //movableColumns: true,
            data: this.childRowData,
            height: this.height,
            virtualDomHoz: true,
            layout: "fitDataStretch",
            rowContextMenu: function (row, e) { return _this.getContextMenu(row, e, _this.showMenuOptions, _this, _this.componentName); },
            groupHeader: function (value, count, data, group) {
                return value + "<span style='color:#d00; margin-left:10px;'>(" + count + " item)</span>";
            },
            tooltips: function (cell) {
                return _this.getToolTip(cell);
            },
            dataSorted: function (sorters, rows) {
                _this.afterSort(sorters, rows);
            },
            //Local Pagination
            pagination: "local",
            paginationSize: 50,
            paginationSizeSelector: [5, 10, 20, 50, 100, 1000, 10000],
            //Remote Pagination
            //pagination:"remote", //enable remote pagination
            // ajaxURL: AppConfigService.settings.serverURL+"/"+this.path+"/GetAllForTabulator", //set url for ajax request
            // //ajaxParams:{token:localStorage.getItem(TOKEN_KEY)}, //set any standard parameters to pass with the request
            // paginationSize:100, //optional parameter to request a certain number of rows per page
            // paginationInitialPage:1, //optional parameter to set the initial page to load
            // paginationSizeSelector: [5, 10, 20, 50, 100, 500, 1000, 100000],
            paginationCounter: "rows",
            selectable: true
        });
        (_a = document.getElementById('my-tabular-table' + this.divId)) === null || _a === void 0 ? void 0 : _a.appendChild(this.tab);
    };
    TabulatorComponent.prototype.search = function () {
        this.onSearchTextChange.emit(this.searchTxt);
    };
    TabulatorComponent.prototype.showSearch = function () {
        // this.renderer.setStyle(this.searchInput?.nativeElement, "position", "absolute");
        // this.renderer.setStyle(this.searchInput?.nativeElement, "width", "67%");
        // this.renderer.setStyle(this.searchInput?.nativeElement, "visibility", "visible");
        // this.renderer.setStyle(this.searchInput?.nativeElement, "background-image", "url(../../../assets/sniper/images/search_yellow.svg)");
        // this.renderer.setStyle(this.searchInput?.nativeElement, "background-repeat", "no-repeat");
        // this.renderer.setStyle(this.searchInput?.nativeElement, "background-position", "95% center");
        // this.renderer.setStyle(this.searchInput?.nativeElement, "cursor", "pointer");
        // this.renderer.setStyle(this.searchInput?.nativeElement, "z-index", "99");
        var _this = this;
        //================
        // visibility:hidden;
        // transition:0s;
        // this.renderer.setStyle(this.searchButton?.nativeElement, "visibility", "hidden");
        // this.renderer.setStyle(this.searchButton?.nativeElement, "transition", "0s");
        // this.renderer.setStyle(this.searchButton?.nativeElement, "display", "none");
        setTimeout(function () {
            var _a;
            (_a = _this.searchInput) === null || _a === void 0 ? void 0 : _a.nativeElement.focus();
        }, 500);
    };
    TabulatorComponent.prototype.showGridFilter = function () {
        this.isShowGridFilter = !this.isShowGridFilter;
        this.onShowGridFilterChange.emit({
            componentName: this.componentName,
            show: this.isShowGridFilter
        });
    };
    TabulatorComponent.prototype.showSearchButton = function () {
        if (!this.searchTxt) {
            // this.renderer.setStyle(this.searchInput?.nativeElement, "width", "0px");
            // this.renderer.setStyle(this.searchButton?.nativeElement, "visibility", "visible");
            // this.renderer.setStyle(this.searchButton?.nativeElement, "display", "block");
        }
    };
    TabulatorComponent.prototype.ngAfterViewInit = function () {
        ;
        this.tab = document.createElement('div');
        this.drawTable();
        this.showDataOnGrid();
    };
    //define column header menu as column visibility toggle
    // headerMenu = function (this: any) {
    //   let menu = [];
    //   let columns = this.getColumns();
    //   for (let column of columns) {
    //     //create checkbox element using font awesome icons
    //     let icon = document.createElement("i");
    //     icon.classList.add("fas");
    //     icon.classList.add(column.isVisible() ? "fa-check-square" : "fa-square");
    //     //build label
    //     let label = document.createElement("span");
    //     let title = document.createElement("span");
    //     ////((column, column.getDefinition().title)
    //     title.textContent = " " + column.getDefinition().title;
    //     label.appendChild(icon);
    //     label.appendChild(title);
    //     //create menu item
    //     menu.push({
    //       label: label,
    //       action: function (e: any) {
    //         //prevent menu closing
    //         e.stopPropagation();
    //         //toggle current column visibility
    //         column.toggle();
    //         //change menu item icon
    //         if (column.isVisible()) {
    //           icon.classList.remove("fa-square");
    //           icon.classList.add("fa-check-square");
    //         } else {
    //           icon.classList.remove("fa-check-square");
    //           icon.classList.add("fa-square");
    //         }
    //       }
    //     });
    //   }
    //   return menu;
    // }
    TabulatorComponent.prototype.ngOnChanges = function (changes) {
        if (this.isModal) {
            this.tabulatorStyle = "width: 100%;height: max-content;position: absolute;overflow-x: scroll; overflow-y: hidden; backgroud-color:white";
            this.customStyle = "padding-left: 5px; padding-top: 0px;display: block;position: absolute;width:900px; background-color:white;";
            // this.customStyle = `padding-left: 5px; padding-top: 0px;height: calc(100vh - ${this.decreaseHeight}px);display: block;position: absolute;width:900px; background-color:white;`;
        }
        else {
            this.customStyle = "padding-left: 0px; padding-top: 0px;display: block;position: absolute;";
            // this.customStyle = `padding-left: 0px; padding-top: 0px;height: calc(100vh - ${this.decreaseHeight}px);display: block;position: absolute;`;
            this.tabulatorStyle = "width: 100%;height: max-content;position: absolute;overflow-x: scroll; overflow-y: hidden; backgroud-color:white";
        }
        if (changes["searchFilters"]) {
            if (this.tabular) {
                this.tabular.setFilter(this.searchFilters);
            }
        }
        else {
            this.showDataOnGrid();
        }
    };
    TabulatorComponent.prototype.editFormatIcon = function () {
        return "<i class=' fa fa-edit'></i>";
    };
    ;
    TabulatorComponent.prototype.deleteFormatIcon = function () {
        return "<i class=' fa fa-trash'></i>";
    };
    ;
    TabulatorComponent.prototype.CheckBoxFormatIcon = function () {
        return "<input id='yourID' type='checkbox' />";
    };
    ;
    TabulatorComponent.prototype.showDataOnGrid = function () {
        //(("childRowData", this.childRowData)
        if (this.tabular) {
            if (this.columnSettings) {
                if (this.columnSettings.length > 0) {
                    this.columnNames = __spreadArrays(this.columnSettings);
                    this.setHeaderMenu();
                    this.setHeaderContextMenu();
                    this.tabular.setColumns(this.columnNames);
                    if (this.childRowData.length) {
                        if (this.childRowData.length) {
                            this.tabular.setData(JSON.parse(JSON.stringify(this.childRowData)));
                        }
                    }
                }
            }
        }
    };
    TabulatorComponent.prototype.sortAndGroup = function () {
        if (this.sortByList) {
            this.setSorter();
        }
        if (this.groupByList) {
            this.tabular.setGroupBy(this.groupByList);
        }
    };
    //assign show hide function for table header columns
    TabulatorComponent.prototype.setHeaderMenu = function () {
        var _this = this;
        if (this.columnNames) {
            this.columnNames.forEach(function (col) {
                col.headerMenu = _this.headerMenu;
            });
        }
    };
    TabulatorComponent.prototype.getSelectedGridItem = function (item, e) {
        ////((e.currentTarget.checked);
        this.onSelectItem.emit({ item: item, isChecked: e.currentTarget.checked });
    };
    TabulatorComponent.prototype.getContextMenu = function (row, e, menuOptions, scope, componentName) {
        //component - column/cell/row component that triggered the menu
        //e - click event object
        var menu = [];
        ////((component.getData())
        if (menuOptions.showEdit) {
            menu.push(scope.getContextMenuItem(row, componentName, "Edit", "../../../assets/sniper/images/dropdown_edit.svg", this.translate.transform("general.edit")));
        }
        if (menuOptions.showDisplay) {
            menu.push(scope.getContextMenuItem(row, componentName, "Display", "../../../assets/sniper/images/dropdown_edit.svg", this.translate.transform("general.display")));
        }
        if (menuOptions.showActivate) {
            menu.push(scope.getContextMenuItem(row, componentName, "Activate", "../../../assets/sniper/images/check_icon.svg", this.translate.transform("general.activate")));
        }
        if (menuOptions.showDelete) {
            menu.push(scope.getContextMenuItem(row, componentName, "Delete", "../../../assets/sniper/images/delete_blue.svg", this.translate.transform("general.delete")));
        }
        if (menuOptions.showDeviceNotification) {
            menu.push(scope.getContextMenuItem(row, componentName, "DeviceNotification", "../../../assets/sniper/images/dropdown_notification.svg"));
        }
        if (menuOptions.showDeviceGeofence) {
            menu.push(scope.getContextMenuItem(row, componentName, "DeviceGeofence", "../../../assets/sniper/images/dropdown_geofences.svg"));
        }
        if (menuOptions.showUserGroup) {
            menu.push(scope.getContextMenuItem(row, componentName, "UserGroups", "../../../assets/sniper/images/dropdown_folder.svg", this.translate.transform("general.user-groups")));
        }
        if (menuOptions.showUserDevice) {
            menu.push(scope.getContextMenuItem(row, componentName, "UserDevices", "../../../assets/sniper/images/dropdown_device.svg", this.translate.transform("general.user-devices")));
        }
        if (menuOptions.showUserDriver) {
            menu.push(scope.getContextMenuItem(row, componentName, "UserDrivers", "../../../assets/sniper/images/dropdown_driver.svg"));
        }
        if (menuOptions.showUserNotification) {
            menu.push(scope.getContextMenuItem(row, componentName, "UserNotifications", "../../../assets/sniper/images/dropdown_notification.svg", this.translate.transform("general.user-notifications")));
        }
        if (menuOptions.showUserGeofence) {
            menu.push(scope.getContextMenuItem(row, componentName, "UserGeofences", "../../../assets/sniper/images/dropdown_geofences.svg"));
        }
        if (menuOptions.showUserRoute) {
            menu.push(scope.getContextMenuItem(row, componentName, "UserRoutes", "../../../assets/sniper/images/dropdown_route.svg"));
        }
        if (menuOptions.showUserCity) {
            menu.push(scope.getContextMenuItem(row, componentName, "UserCities", "../../../assets/sniper/images/dropdown_city.svg"));
        }
        if (menuOptions.showDeviceComputedAttribute) {
            menu.push(scope.getContextMenuItem(row, componentName, "DeviceComputedAttribute", "../../../assets/sniper/images/sensor.svg"));
        }
        if (menuOptions.showWASL) {
            menu.push(scope.getContextMenuItem(row, componentName, "WaslItem", "../../../assets/sniper/images/WASL.svg"));
        }
        if (menuOptions.showWaslLog) {
            menu.push(scope.getContextMenuItem(row, componentName, "WaslLog", "../../../assets/sniper/images/WASL.svg"));
        }
        if (menuOptions.showCommands) {
            menu.push(scope.getContextMenuItem(row, componentName, 'DeviceCommand', '../../../assets/sniper/images/Commands.svg'));
        }
        if (menuOptions.showSendCommand) {
            menu.push(scope.getContextMenuItem(row, componentName, 'SendCommand', '../../../assets/sniper/images/server.svg'));
        }
        if (menuOptions.showSelectGroup) {
            menu.push(scope.getContextMenuItem(row, componentName, "SelectGroup", "../../../assets/sniper/images/folder.svg"));
        }
        if (menuOptions.showSelectItem) {
            menu.push(scope.getContextMenuItem(row, componentName, "SelectItem", "../../../assets/sniper/images/dropdown_edit.svg"));
        }
        if (menuOptions.showDeleteGroup) {
            menu.push(scope.getContextMenuItem(row, componentName, "DeleteGroup", "../../../assets/sniper/images/delete_blue.svg"));
        }
        if (menuOptions.showSensorDevices) {
            menu.push(scope.getContextMenuItem(row, componentName, "SensorDevices", "../../../assets/sniper/images/sensor.svg"));
        }
        if (menuOptions.showRegisterAllDevices) {
            menu.push(scope.getContextMenuItem(row, componentName, "RegisterAllDevices", "../../../assets/sniper/images/sensor.svg"));
        }
        if (menuOptions.showRegisterAllDrivers) {
            menu.push(scope.getContextMenuItem(row, componentName, "RegisterAllDrivers", "../../../assets/sniper/images/sensor.svg"));
        }
        if (menuOptions.showRegisterWaslCustomerDevices) {
            menu.push(scope.getContextMenuItem(row, componentName, "RegisterWaslCustomerDevices", "../../../assets/sniper/images/sensor.svg"));
        }
        if (menuOptions.showRegisterWaslCustomerDrivers) {
            menu.push(scope.getContextMenuItem(row, componentName, "RegisterWaslCustomerDrivers", "../../../assets/sniper/images/sensor.svg"));
        }
        if (menuOptions.showRegisterItem) {
            menu.push(scope.getContextMenuItem(row, componentName, "RegisterItem", "../../../assets/sniper/images/sensor.svg"));
        }
        if (menuOptions.showAdminPanelPermission) {
            menu.push(scope.getContextMenuItem(row, componentName, "AdminPanelPermission", "../../../assets/sniper/images/dropdown_notification.svg"));
        }
        if (menuOptions.showRegisterCustomer) {
            menu.push(scope.getContextMenuItem(row, componentName, "RegisterCustomer", "../../../assets/sniper/images/WASL.svg"));
        }
        if (menuOptions.showUnRegisterCustomer) {
            menu.push(scope.getContextMenuItem(row, componentName, "UnRegisterCustomer", "../../../assets/sniper/images/delete.svg"));
        }
        if (menuOptions.showQueryCustomer) {
            menu.push(scope.getContextMenuItem(row, componentName, "QueryCustomer", "../../../assets/sniper/images/WASL.svg"));
        }
        if (menuOptions.showQueryDevice) {
            menu.push(scope.getContextMenuItem(row, componentName, "QueryDevice", "../../../assets/sniper/images/WASL.svg"));
        }
        if (menuOptions.showUnRegisterDevice) {
            menu.push(scope.getContextMenuItem(row, componentName, "UnRegisterDevice", "../../../assets/sniper/images/WASL.svg"));
        }
        if (menuOptions.showUnAssignSensorFromDevice) {
            menu.push(scope.getContextMenuItem(row, componentName, "UnAssignSensorFromDevice", "../../../assets/sniper/images/delete_blue.svg"));
        }
        if (menuOptions.showDetermineTheTechnician) {
            menu.push(scope.getContextMenuItem(row, componentName, "DetermineTheTechnician", "../../../assets/sniper/images/dropdown_edit.svg", this.translate.transform("general.detemine-technician")));
        }
        if (menuOptions.showRequestDetails) {
            menu.push(scope.getContextMenuItem(row, componentName, "RequestDetails", "../../../assets/sniper/images/dropdown_edit.svg", this.translate.transform("general.request-details")));
        }
        //(('maintenanceRequestState', row._row.data.requestStatus);
        var maintenanceRequestState = row._row.data.requestStatus;
        if (maintenanceRequestState != null) {
            if (maintenanceRequestState == 3 || maintenanceRequestState == 4 || maintenanceRequestState == 5 || maintenanceRequestState == 6) {
                if (menuOptions.showProductReceipt) {
                    menu.push(scope.getContextMenuItem(row, componentName, "ProductReceipt", "../../../assets/sniper/images/dropdown_edit.svg", this.translate.transform("general.product-receipt")));
                }
            }
            if (maintenanceRequestState == 3 || maintenanceRequestState == 4) {
                if (menuOptions.showPriceRequest) {
                    menu.push(scope.getContextMenuItem(row, componentName, "PriceRequest", "../../../assets/sniper/images/dropdown_edit.svg", this.translate.transform("general.price-request")));
                }
            }
            if (maintenanceRequestState != 8) {
                if (menuOptions.showCloseRequest) {
                    menu.push(scope.getContextMenuItem(row, componentName, "CloseRequest", "../../../assets/sniper/images/dropdown_edit.svg", this.translate.transform("general.close-request")));
                }
            }
        }
        ;
        //(('contractStatus', row._row.data.contractStatus);
        var contractStatus = row._row.data.contractStatus;
        if (contractStatus != null) {
            ;
            if (contractStatus == 0 || contractStatus == 5) {
                if (menuOptions.showIssueContract) {
                    menu.push(scope.getContextMenuItem(row, componentName, "IssueContract", "../../../assets/sniper/images/dropdown_edit.svg", this.translate.transform("rent-contracts.IssueContract")));
                }
            }
            if (contractStatus == 8 && row._row.data.isRenew != true) {
                if (menuOptions.showRenewContract) {
                    menu.push(scope.getContextMenuItem(row, componentName, "RenewContract", "../../../assets/sniper/images/dropdown_edit.svg", this.translate.transform("rent-contracts.renew-contract")));
                }
            }
            if (contractStatus != 7) {
                if (menuOptions.showSettlementContract) {
                    menu.push(scope.getContextMenuItem(row, componentName, "SettlementContract", "../../../assets/sniper/images/dropdown_edit.svg", this.translate.transform("rent-contracts.settlement-contract")));
                }
            }
        }
        if (menuOptions.showPrint) {
            menu.push(scope.getContextMenuItem(row, componentName, "Print", "../../../assets/sniper/images/dropdown_edit.svg", this.translate.transform("general.print")));
        }
        return menu;
    };
    TabulatorComponent.prototype.onMenuAction = function (row, componentName, actionName) {
        ////((row.getData());
        this.onMenuActionSelected.emit({
            componentName: componentName,
            actionName: actionName,
            item: row.getData()
        });
    };
    TabulatorComponent.prototype.getContextMenuItem = function (row, componentName, actionName, iconUrl, actionTranslate) {
        var _this = this;
        return {
            //label: `<img src='${iconUrl}'> ${this.translate.transform("settingMenu." + actionName,)}`,
            label: "<img src='" + iconUrl + "'> " + actionTranslate,
            action: function (e, column) {
                //component.update({ "approved": true });
                _this.onMenuAction(row, componentName, actionName);
            }
        };
    };
    TabulatorComponent.prototype.onShowHideColumn = function (column, visible) {
        if (this.tabular) {
            ////((this.tabular.getColumns());
            //this.savePanelSettings();
        }
    };
    TabulatorComponent.prototype.savePanelSettings = function () {
        if (this.panelId) {
            var userId = localStorage.getItem("id");
            var colSettings = this.getColumnSettings();
            var panelSetting = {
                id: 0,
                userId: Number(userId),
                panelId: this.panelId,
                panelSettings: JSON.stringify(colSettings),
                groupByCols: this.getGroupByColAsString(),
                sortByCols: this.getSortByColAsString()
            };
        }
    };
    TabulatorComponent.prototype.getGroupByColAsString = function () {
        var groupByColString = "";
        this.groupByList.forEach(function (g) {
            groupByColString = groupByColString + g + ";";
        });
        groupByColString = groupByColString.slice(0, groupByColString.length - 1);
        return groupByColString;
    };
    TabulatorComponent.prototype.getSortByColAsString = function () {
        ////((this.sortByList);
        return JSON.stringify(this.sortByList);
    };
    TabulatorComponent.prototype.getColumnSettings = function () {
        var currentColumns = [];
        var columns = this.tabular.getColumns();
        for (var i = 0; i < columns.length; i++) {
            var colDefination = columns[i].getDefinition();
            currentColumns.push({
                title: colDefination.title,
                field: colDefination.field,
                width: columns[i].getWidth(),
                visible: columns[i].isVisible()
            });
        }
        return currentColumns;
    };
    TabulatorComponent.prototype.setHeaderContextMenu = function () {
        var _this = this;
        if (this.columnNames) {
            this.columnNames.forEach(function (col) {
                col["headerContextMenu"] = function (c) { return _this.headerContextMenuSetting(c, _this); };
            });
        }
    };
    TabulatorComponent.prototype.headerContextMenuSetting = function (column, scope) {
        var headerContextMenu = [
            {
                label: "<i class='fa fa-eye'></i> Hide",
                action: function (e, column) {
                    column.hide();
                }
            },
            {
                label: "<i class='fa fa-save'></i> Save Settings",
                action: function (e, column) {
                    if (scope.enableTree) {
                        scope.savePanelSettings();
                    }
                    else {
                        scope.saveReportSettings();
                    }
                }
            },
            {
                label: "<i class='fa fa-users'></i> Group By",
                action: function (e, column) {
                    var colDefination = column.getDefinition();
                    if (colDefination) {
                        if (!scope.groupByList.find(function (a) { return a == colDefination.field; })) {
                            scope.groupByList.push(colDefination.field);
                            scope.tabular.setGroupBy(scope.groupByList);
                        }
                    }
                }
            },
            {
                label: "<i class='fas fa-minus-circle'></i> Un Group",
                action: function (e, column) {
                    var colDefination = column.getDefinition();
                    if (colDefination) {
                        // scope.groupByString = scope.groupByString.replaceAll(colDefination.title, "");
                        // scope.groupByString = scope.groupByString.replaceAll(colDefination.title, "");
                        //scope.tabular.setGroupBy(scope.groupByString);
                        var unGroupFieldName_1 = scope.groupByList.find(function (a) { return a == colDefination.field; });
                        if (unGroupFieldName_1) {
                            var index = scope.groupByList.findIndex(function (a) { return a == unGroupFieldName_1; });
                            scope.groupByList.splice(index, 1);
                            scope.tabular.setGroupBy(scope.groupByList);
                        }
                    }
                }
            },
            {
                label: "<i class='fas fa-sort'></i> Sort",
                action: function (e, column) {
                    var colDefination = column.getDefinition();
                    if (colDefination) {
                        // let sortByGroup:any[] = scope.tabular.getSorters();
                        ////((sortByGroup);
                        if (scope.sortByList) {
                            ////((colDefination, sortByGroup);
                            //Check is exist in sort by elements
                            var sortBy = scope.sortByList.find(function (x) { return x.column == colDefination.field; });
                            if (sortBy) {
                                if (sortBy.dir == "asc") {
                                    sortBy.dir = "desc";
                                }
                                else {
                                    sortBy.dir = "asc";
                                }
                            }
                            else {
                                sortBy = {
                                    column: colDefination.field,
                                    dir: "asc"
                                };
                                scope.sortByList.push(sortBy);
                            }
                            var newSortBy_1 = [];
                            scope.sortByList.forEach(function (so) {
                                newSortBy_1.push({
                                    column: so.column,
                                    dir: so.dir
                                });
                            });
                            scope.tabular.setSort(newSortBy_1);
                        }
                    }
                }
            }
        ];
        return headerContextMenu;
    };
    TabulatorComponent.prototype.exportPdf = function () {
        this.tabular.download("pdf", this.componentName + ".pdf", {
            orientation: "portrait",
            title: this.componentName + " " + "Report"
        });
    };
    TabulatorComponent.prototype.exportJson = function () {
        this.tabular.download("json", this.componentName + ".json");
    };
    TabulatorComponent.prototype.exportHtml = function () {
        this.tabular.download("html", this.componentName + ".html", { style: true });
    };
    TabulatorComponent.prototype.exportCsv = function () {
        this.tabular.download("csv", this.componentName + ".csv");
    };
    TabulatorComponent.prototype.exportExcel = function () {
        this.tabular.download("xlsx", this.componentName + ".xlsx", { sheetName: this.componentName });
    };
    TabulatorComponent.prototype.removeGroupItem = function (index) {
        this.groupByList.splice(index, 1);
        this.tabular.setGroupBy(this.groupByList);
    };
    // listenToLanguage() {
    //   let sub = this.sharedService.getLanguage().subscribe(lang => {
    //     if (lang) {
    //       if (lang == "ar") {
    //         this.direction = "rtl";
    //         this.lang = "ar";
    //       }
    //       else {
    //         this.direction = "ltr";
    //         this.lang = lang;
    //       }
    //       //this function custom Added by mosfet not from original source code
    //       this.tabular.setDirection(this.direction);
    //       this.tabular.rtlCheck();
    //       this.translateService.use(lang).subscribe(a => {
    //         this.translateColumns(this.columnNames, this.componentName);
    //         //this.drawTable();
    //         this.tabular.setColumns(this.columnNames);
    //       })
    //     }
    //   });
    //   this.subsList.push(sub);
    // }
    TabulatorComponent.prototype.ngOnDestroy = function () {
        this.subsList.forEach(function (s) {
            if (s) {
                s.unsubscribe();
            }
        });
    };
    TabulatorComponent.prototype.recreateColumnsForTranslate = function () {
        for (var k = 0; k < this.columnNames.length; k++) {
            this.tabular.deleteColumn(this.columnNames[k].field);
            this.tabular.addColumn(this.columnNames[k]);
        }
    };
    TabulatorComponent.prototype.translateColumns = function (columns, componentName) {
        for (var i = 0; i < this.columnNames.length; i++) {
            var col = this.columnNames[i];
            //col.title = this.translate.transform((componentName + "." + col.field));
        }
    };
    TabulatorComponent.prototype.getToolTip = function (cell) {
        return cell.getColumn().getField() + "\n" + cell.getValue(); //return cells "field - value";
    };
    TabulatorComponent.prototype.resetColumns = function () {
    };
    TabulatorComponent.prototype.afterSort = function (sorters, rows) {
        /////((sorters, rows);
    };
    TabulatorComponent.prototype.removeSortItem = function () {
    };
    // lisetnToActivePanel() {
    //   let sub = this.sharedService.getActivePanel().subscribe(panelName => {
    //     if (panelName == this.componentName) {
    //       if (this.tabular) {
    //         setTimeout(a => {
    //           this.tabular.setColumns(this.columnNames);
    //           setTimeout(() => {
    //             this.sortAndGroup();
    //           }, 200);
    //         }, 200);
    //       }
    //     }
    //   });
    //   this.subsList.push(sub);
    // }
    TabulatorComponent.prototype.sortItems = function (e) {
        var _this = this;
        //
        //let newSortList: any[] = [];
        this.sortByList = [];
        e.forEach(function (col) {
            if (col.checked) {
                _this.sortByList.push({
                    column: col.field,
                    dir: col.sort
                });
            }
        });
        this.setSorter();
    };
    TabulatorComponent.prototype.groupByItems = function (e) {
        var newGroupByList = [];
        e.forEach(function (col) {
            if (col.checked) {
                newGroupByList.push(col.field);
            }
        });
        this.groupByList = newGroupByList.filter(function (x) { return true; });
        this.tabular.setGroupBy(this.groupByList);
    };
    TabulatorComponent.prototype.showHideArraneColums = function (e) {
        var _this = this;
        //Update current columns setting
        ////((this.columnNames);
        var newColSetting = [];
        e.forEach(function (nCol) {
            var currentCol = _this.columnNames.find(function (x) { return x.field == nCol.field; });
            newColSetting.push({
                field: nCol.field,
                title: nCol.title,
                visible: nCol.checked,
                width: currentCol.width,
                headerMenu: currentCol.headerMenu
            });
        });
        ////((newColSetting);
        this.tabular.setColumns(newColSetting);
        this.setSorter();
    };
    TabulatorComponent.prototype.setSorter = function () {
        var newSorter = [];
        if (this.sortByList) {
            this.sortByList.forEach(function (s) {
                newSorter.push({
                    column: s.column,
                    dir: s.dir
                });
            });
            this.tabular.setSort(newSorter);
        }
    };
    TabulatorComponent.prototype.setGroupBy = function () {
        this.tabular.setGroupBy(this.groupByList);
    };
    TabulatorComponent.prototype.saveColumnsSetting = function (e) {
        //type == 1
        var colSettings = this.getColumnSettings();
        this.customMenuSave(JSON.stringify(colSettings).toString(), 1);
    };
    TabulatorComponent.prototype.saveGroupBy = function (e) {
        //type == 2
        var groupByString = "";
        e.forEach(function (f) {
            if (f.checked) {
                groupByString = groupByString + f.field + ";";
            }
        });
        groupByString = groupByString.length > 0 ? groupByString.slice(0, groupByString.length - 1) : "";
        this.customMenuSave(groupByString, 2);
    };
    TabulatorComponent.prototype.saveSortBy = function (e) {
        //type == 3
        this.customMenuSave(JSON.stringify(e), 3);
    };
    TabulatorComponent.prototype.customMenuSave = function (settings, type) {
        this.updatePanelSetting(settings, type);
    };
    TabulatorComponent.prototype.updatePanelSetting = function (settings, type) {
        var userId = localStorage.getItem("id");
    };
    TabulatorComponent.prototype.saveAllSetting = function () {
        this.savePanelSettings();
    };
    TabulatorComponent.prototype.openAddGroup = function () {
        // this.store.dispatch(GroupActions.actions.setSelectedWithTypeAction({ data: undefined, typeId: this.groupType }));
        // this.dialogService.openComponent(GroupComponent, {
        //   componentName: "Group"
        // })
        this.onAddGroup.emit();
    };
    TabulatorComponent.prototype.openAddItem = function () {
        this.onAddItem.emit();
        // if(this.groupType == 1)
        // {
        //   this.openAddDevice();
        // }
        // else if(this.groupType == 2)
        // {
        //   this.openAddDriver();
        // }
        // else if(this.groupType == 7)
        // {
        //   this.openAddUser();
        // }
        // else if(this.groupType == -2)
        // {
        //   this.openAddWaslCustomer();
        // }
    };
    // openAddDevice() {
    //   this.dialogService.openComponent(DeviceComponent, {
    //     componentName: "Device",
    //     isBackdrop:true
    //   });
    // }
    // openAddDriver() {
    //   this.dialogService.openComponent(DriverComponent, {
    //     componentName: "Driver"
    //   })
    // }
    // openAddUser() {
    //   this.dialogService.openComponent(UserComponent, {
    //     componentName: "User"
    //   })
    // }
    TabulatorComponent.prototype.ngAfterContentInit = function () {
    };
    __decorate([
        core_1.Input()
    ], TabulatorComponent.prototype, "parentColName");
    __decorate([
        core_1.Input()
    ], TabulatorComponent.prototype, "idColName");
    __decorate([
        core_1.Input()
    ], TabulatorComponent.prototype, "componentName");
    __decorate([
        core_1.Input()
    ], TabulatorComponent.prototype, "isModal");
    __decorate([
        core_1.Output()
    ], TabulatorComponent.prototype, "onAddItem");
    __decorate([
        core_1.Output()
    ], TabulatorComponent.prototype, "onAddGroup");
    __decorate([
        core_1.Output()
    ], TabulatorComponent.prototype, "onEditItem");
    __decorate([
        core_1.Output()
    ], TabulatorComponent.prototype, "onDeleteItem");
    __decorate([
        core_1.Output()
    ], TabulatorComponent.prototype, "onCheckItem");
    __decorate([
        core_1.Output()
    ], TabulatorComponent.prototype, "onSelectItem");
    __decorate([
        core_1.Output()
    ], TabulatorComponent.prototype, "onMenuActionSelected");
    __decorate([
        core_1.Input()
    ], TabulatorComponent.prototype, "showMenuOptions");
    __decorate([
        core_1.Input()
    ], TabulatorComponent.prototype, "panelId");
    __decorate([
        core_1.Input()
    ], TabulatorComponent.prototype, "divId");
    __decorate([
        core_1.Input()
    ], TabulatorComponent.prototype, "direction");
    __decorate([
        core_1.Input()
    ], TabulatorComponent.prototype, "childRowData");
    __decorate([
        core_1.Input()
    ], TabulatorComponent.prototype, "groupByList");
    __decorate([
        core_1.Input()
    ], TabulatorComponent.prototype, "sortByList");
    __decorate([
        core_1.Output()
    ], TabulatorComponent.prototype, "onItemDoubleClick");
    __decorate([
        core_1.Output()
    ], TabulatorComponent.prototype, "onSearchTextChange");
    __decorate([
        core_1.Input()
    ], TabulatorComponent.prototype, "searchFilters");
    __decorate([
        core_1.Output()
    ], TabulatorComponent.prototype, "onShowGridFilterChange");
    __decorate([
        core_1.Input()
    ], TabulatorComponent.prototype, "groupType");
    __decorate([
        core_1.Input()
    ], TabulatorComponent.prototype, "path");
    __decorate([
        core_1.Input()
    ], TabulatorComponent.prototype, "showExport");
    __decorate([
        core_1.ViewChild("searchInput")
    ], TabulatorComponent.prototype, "searchInput");
    __decorate([
        core_1.ViewChild("searchButton")
    ], TabulatorComponent.prototype, "searchButton");
    __decorate([
        core_1.Input()
    ], TabulatorComponent.prototype, "decreaseHeight");
    __decorate([
        core_1.Input()
    ], TabulatorComponent.prototype, "columnSettings");
    TabulatorComponent = __decorate([
        core_1.Component({
            selector: 'app-tabulator',
            templateUrl: './tabulator.component.html',
            styleUrls: ['./tabulator.component.scss']
        })
    ], TabulatorComponent);
    return TabulatorComponent;
}());
exports.TabulatorComponent = TabulatorComponent;
