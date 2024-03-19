"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.SharedModule = exports.HttpLoaderFactory = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var sidebar_component_1 = require("./components/sidebar/sidebar.component");
var router_1 = require("@angular/router");
var flex_layout_1 = require("@angular/flex-layout");
var color_pallet_component_1 = require("./components/color-pallet/color-pallet.component");
var nav_bar_component_1 = require("./components/header/nav-bar/nav-bar.component");
var metrics_component_1 = require("./components/dashboard/metrics/metrics.component");
var graph_component_1 = require("./components/dashboard/graph/graph.component");
var daily_benefits_component_1 = require("./components/dashboard/daily-benefits/daily-benefits.component");
var reservations_component_1 = require("./components/dashboard/reservations/reservations.component");
var reusable_unit_component_1 = require("./components/control-panel-components/reusable-unit/reusable-unit.component");
var ng_select_1 = require("@ng-select/ng-select");
var forms_1 = require("@angular/forms");
var resuable_unit_services_component_1 = require("./components/control-panel-components/resuable-unit-services/resuable-unit-services.component");
var reusable_rent_contract_dues_component_1 = require("./components/control-panel-components/reusable-rent-contract-dues/reusable-rent-contract-dues.component");
var toolbar_component_1 = require("./components/pages/toolbar/toolbar.component");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var multiselect_1 = require("primeng/multiselect");
var core_2 = require("@ngx-translate/core");
var http_1 = require("@angular/common/http");
var http_loader_1 = require("@ngx-translate/http-loader");
var tabulator_module_1 = require("./components/tabulator/tabulator.module");
var message_modal_component_1 = require("./message-modal/message-modal.component");
var input_component_1 = require("./components/form/input/input.component");
var filter_pipe_1 = require("./piples/filter-pipe");
var upload_files_form_component_1 = require("./components/pages/upload-files/upload-files-form.component");
var button_1 = require("@angular/material/button");
var dialog_1 = require("@angular/material/dialog");
var upload_files_dialog_service_1 = require("./services/upload-files-dialog.service");
var icon_1 = require("@angular/material/icon");
var divider_1 = require("@angular/material/divider");
var file_upload_module_1 = require("./components/file-upload/file-upload.module");
var menu_1 = require("@angular/material/menu");
var perview_uploaded_files_component_1 = require("./components/pages/upload-files/perview-uploaded-files/perview-uploaded-files.component");
var leaflet_map_component_1 = require("./components/maps/leaflet-map/leaflet-map.component");
var ngx_leaflet_1 = require("@asymmetrik/ngx-leaflet");
function HttpLoaderFactory(http) {
    return new http_loader_1.TranslateHttpLoader(http);
}
exports.HttpLoaderFactory = HttpLoaderFactory;
var SharedModule = /** @class */ (function () {
    function SharedModule() {
    }
    SharedModule = __decorate([
        core_1.NgModule({
            declarations: [
                nav_bar_component_1.NavBarComponent,
                sidebar_component_1.SidebarComponent,
                color_pallet_component_1.ColorPalletComponent,
                metrics_component_1.MetricsComponent,
                graph_component_1.GraphComponent,
                daily_benefits_component_1.DailyBenefitsComponent,
                reservations_component_1.ReservationsComponent,
                reusable_unit_component_1.ReusableUnitComponent,
                resuable_unit_services_component_1.ResuableUnitServicesComponent,
                reusable_rent_contract_dues_component_1.ReusablRentContractDuesComponent,
                toolbar_component_1.ToolbarComponent,
                message_modal_component_1.MessageModalComponent,
                input_component_1.InputComponent,
                filter_pipe_1.FilterPipe,
                upload_files_form_component_1.UploadFilesFormComponent,
                perview_uploaded_files_component_1.PerviewUploadedFilesComponent,
                leaflet_map_component_1.LeafletMapComponent,
            ],
            imports: [
                common_1.CommonModule,
                router_1.RouterModule,
                flex_layout_1.FlexLayoutModule,
                ng_select_1.NgSelectModule,
                forms_1.ReactiveFormsModule,
                forms_1.FormsModule,
                ng_bootstrap_1.NgbNavModule,
                multiselect_1.MultiSelectModule,
                dialog_1.MatDialogModule, button_1.MatButtonModule,
                icon_1.MatIconModule,
                divider_1.MatDividerModule,
                file_upload_module_1.FileUploadModule,
                menu_1.MatMenuModule,
                ngx_leaflet_1.LeafletModule,
                core_2.TranslateModule.forRoot({
                    loader: {
                        provide: core_2.TranslateLoader,
                        useFactory: HttpLoaderFactory,
                        deps: [http_1.HttpClient]
                    }
                }),
                core_2.TranslateModule.forRoot({
                    loader: {
                        provide: core_2.TranslateLoader,
                        useFactory: function (http) { return new http_loader_1.TranslateHttpLoader(http, './assets/i18n/', '.json'); },
                        deps: [http_1.HttpClient]
                    }
                }),
            ],
            exports: [
                sidebar_component_1.SidebarComponent,
                nav_bar_component_1.NavBarComponent,
                color_pallet_component_1.ColorPalletComponent,
                metrics_component_1.MetricsComponent,
                graph_component_1.GraphComponent,
                daily_benefits_component_1.DailyBenefitsComponent,
                reservations_component_1.ReservationsComponent,
                reusable_unit_component_1.ReusableUnitComponent,
                resuable_unit_services_component_1.ResuableUnitServicesComponent,
                reusable_rent_contract_dues_component_1.ReusablRentContractDuesComponent,
                toolbar_component_1.ToolbarComponent,
                core_2.TranslateModule,
                tabulator_module_1.TabulatorModule,
                message_modal_component_1.MessageModalComponent,
                input_component_1.InputComponent,
                filter_pipe_1.FilterPipe,
                upload_files_form_component_1.UploadFilesFormComponent,
                leaflet_map_component_1.LeafletMapComponent,
            ], providers: [core_2.TranslatePipe, filter_pipe_1.FilterPipe, upload_files_dialog_service_1.UploadFilesDialogService]
        })
    ], SharedModule);
    return SharedModule;
}());
exports.SharedModule = SharedModule;
