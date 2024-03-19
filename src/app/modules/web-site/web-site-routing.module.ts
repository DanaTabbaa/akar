import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "src/app/core/guards/auth.guard";
import { AboutUsComponent } from "./about-us/about-us.component";
import { ContactUsComponent } from "./contact-us/contact-us.component";
import { HomeComponent } from "./home/home.component";
import { LoginComponent } from "./login/login.Component";
import { MapComponent } from "./map/map.component";
import { ProductDetailsComponent } from "./product-details/product-details.Component";
import { PropertyListingComponent } from "./property-listing/property-listing.Component";
import { RecentlyAddedComponent } from "./recently-added/recently-added.component";
import { ResetPasswordComponent } from "./security/reset-password/reset-password.component";
import { ViewMapComponent } from "./view-map/view-map.component";
import { WebSiteComponent } from "./web-site.component";
import { ProductMapComponent } from "./product-map/product-map.component";


const routes: Routes = [
    // { path: "", component: WebSiteComponent},
    {
        path: "", 
        component:WebSiteComponent,
        children: [
            { path: "", component: HomeComponent },
            { path: "home", component: HomeComponent },
            { path: "login", redirectTo: 'home', pathMatch: 'full', data: { statusRoute: 'login' }},
            { path: "security/resetpassword", component: ResetPasswordComponent,canActivateChild:[AuthGuard] } ,
            { path: "about-us", component: AboutUsComponent },
            { path: "contact-us", component: ContactUsComponent },
            { path: "details/:id", component: ProductDetailsComponent },
            { path: "property", component: PropertyListingComponent },
            { path: "property/:id", component: PropertyListingComponent },
            { path: "view-map", component: ViewMapComponent },
            { path: "recently-added", component: RecentlyAddedComponent },
            { path: "map", component: MapComponent },
            { path: "map/:id", component: MapComponent },
            { path: "product-map", component: ProductMapComponent },





        ]
    },
   






];


@NgModule({
    exports: [RouterModule],
    imports: [RouterModule.forChild(routes)]
})
export class WebSiteRoutingModule { }