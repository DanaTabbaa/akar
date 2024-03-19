import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuctoinRoutingModule } from './auction-routing.module';
import { AuctionComponent } from './auction.component';
import { RealEstateAuctionComponent } from './real-estate-auction/real-estate-auction.component';
import { AuctionSystemComponent } from './auction-system/auction-system.component';
import { AuctionClientsComponent } from './auction-clients/auction-clients.component';
import { AuctionsComponent } from './auctions/auctions.component';
import { AuctionsFeesComponent } from './auctions-fees/auctions-fees.component';
import { ReceiptComponent } from './receipt/receipt.component';



@NgModule({
  declarations: [
    AuctionComponent,
    RealEstateAuctionComponent,
    AuctionSystemComponent,
    AuctionClientsComponent,
    AuctionsComponent,
    AuctionsFeesComponent,
    ReceiptComponent
  ],
  imports: [
    CommonModule,
    AuctoinRoutingModule
  ]
})
export class AuctionModule { }
