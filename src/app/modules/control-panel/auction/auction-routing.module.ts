import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuctionClientsComponent } from './auction-clients/auction-clients.component';
import { AuctionSystemComponent } from './auction-system/auction-system.component';
import { AuctionComponent } from './auction.component';
import { AuctionsComponent } from './auctions/auctions.component';
import { AuctionsFeesComponent } from './auctions-fees/auctions-fees.component';
import { RealEstateAuctionComponent } from './real-estate-auction/real-estate-auction.component';
import { ReceiptComponent } from './receipt/receipt.component';


const routes: Routes = [{
 path:'',component:AuctionComponent,children:[
    {path:'auction-clients',component:AuctionClientsComponent},
    {path:'auction-system',component:AuctionSystemComponent},
    {path:'auctions',component:AuctionsComponent},
    {path:'auctions-fees',component:AuctionsFeesComponent},
    {path:'real-estate-auction',component:RealEstateAuctionComponent},
    {path:'receipt',component:ReceiptComponent}
    

 ]
 
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuctoinRoutingModule { }
