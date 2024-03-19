import { Component, ComponentFactoryResolver, EventEmitter, Injector, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import {
  OnDestroy,
  AfterViewInit
} from '@angular/core';

import { Observable, Subscriber, Subscription } from 'rxjs';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import { AppConfigService } from 'src/app/core/services/local-services/app-config.service';
import { OpportunityImages } from 'src/app/core/models/opportunity-images';





import { SharedService } from 'src/app/shared/services/shared.service';
import { latLng, tileLayer, marker, Marker } from 'leaflet';
import { MapLayer, MapTileLayerTypes } from 'src/app/core/models/map-layers';
import { WebsiteService } from 'src/app/core/services/backend-services/website.service';
import { Opportunity } from 'src/app/core/models/opportunity';
import { OpportuityMapPopupComponent } from '../opportuity-map-popup/opportuity-map-popup.component';
import { ICustomEnum } from 'src/app/core/interfaces/ICustom-enum';
import { convertEnumToArray, OpportunitStatusArEnum, OpportunitStatusEnum } from 'src/app/core/constants/enumrators/enums';
import { ActivatedRoute } from '@angular/router';
const icon = L.icon({
  iconUrl: '../../../../../assets/images/map/marker-icon.png',
  shadowUrl: '../../../../../assets/images/map/marker-shadow.png',
  popupAnchor: [13, 0],
});

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})


export class MapComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  mapLayerTypes: MapTileLayerTypes = new MapTileLayerTypes();
  defaultMapLayer: MapLayer = new MapLayer();
  markers: {} = {};
  map: any;
  marker!: Marker;
  opportunities: Opportunity[] = [];
  mapMarkers = new Map();
  // @Output() onPositionSelected: EventEmitter<{ lat: any, lng: any }> = new EventEmitter();
  latlon: { lat: number, lng: number } = { lat: 0, lng: 0 };
  //@Input() locationDescription:string = '';
  opportunityStatusTypes: ICustomEnum[] = [];
  lang: string = "ar";
  markerCluster = L.markerClusterGroup({
    disableClusteringAtZoom: 10,
    spiderfyOnMaxZoom: false,
    showCoverageOnHover: true,
    zoomToBoundsOnClick: true

  });
  subsList: Subscription[] = [];
  opportunityId:any;

  constructor(private sharedService: SharedService,
    private websiteService: WebsiteService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector,
    private activatedRoute: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.lang = localStorage.getItem('language') ?? "ar";
    this.getOpportunitStatusTypes();


    this.loadMap();

    this.getRouteData().then(a=>{
      this.websiteService.loadOpportunities().then(a => {
        if(this.opportunityId)
        {
          this.opportunities = this.websiteService.getOpportunites().filter(x=>x.id == this.opportunityId);
        }
        else
        {
          this.opportunities = this.websiteService.getOpportunites();
        }
        
        this.showOpportunitiesOnMap();
      });
    });

    


  }

  getRouteData() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.activatedRoute.params.subscribe({
        next:(res)=>{
          this.opportunityId = res['id'];
          resolve();
        },
        error:(err)=>{
          resolve();
        },
        complete:()=>{}
      });
      this.subsList.push(sub);

    });
  }

  public ngAfterViewInit(): void {
  }

  private loadMap(): void {
    this.defaultMapLayer = this.mapLayerTypes.types[2];
    let defaultLayer = L.tileLayer(this.defaultMapLayer.tileLayerUrl, this.defaultMapLayer.options);

    this.map = L.map("website-map", {
      layers: [defaultLayer],
      zoom: 5,
      center: L.latLng(this.latlon.lat == 0 && this.latlon.lng == 0 ? { lat: 26.402439, lng: 50.050850 } : this.latlon),
      zoomControl: true
    });

    if (!(this.latlon.lat == 0 && this.latlon.lng == 0)) {

      this.marker = L.marker([this.latlon.lat, this.latlon.lng], { icon });
      //.bindPopup('Angular Leaflet');
      this.marker.addTo(this.map);
    }



    L.control.layers(this.getMapTileLayers(this.mapLayerTypes, defaultLayer), undefined, {
      position: 'bottomright'
    }).addTo(this.map);
    setTimeout(() => {
      this.map.invalidateSize();
      this.markerCluster.addTo(this.map);
    }, 1000);

    // this.map.on('dblclick', (e)=>{

    //   console.log(e.latlng);

    //     if(this.marker){
    //       this.map.removeLayer(this.marker);
    //     }

    //     this.latlon = {lat:e.latlng.lat,lng:e.latlng.lng };

    //     this.marker = L.marker([e.latlng.lat, e.latlng.lng], { icon }).bindPopup(this.locationDescription);
    //     this.marker.addTo(this.map);
    //     this.onPositionSelected.emit(e.latlng);
    // })


    // this.getCurrentPosition()
    //   .subscribe((position: any) => {
    //     this.map.flyTo([position.latitude, position.longitude], 13);
    //     this.sharedService.setLocationDetails({ latitude: position.latitude, longitude: position.longitude } as LocationDetails)

    //     const icon = L.icon({
    //       iconUrl: '../../../../../assets/images/map/marker-icon.png',
    //       shadowUrl: '../../../../../assets/images/map/marker-shadow.png',
    //       popupAnchor: [13, 0],
    //     });

    //     const marker = L.marker([position.latitude, position.longitude], { icon }).bindPopup('Angular Leaflet');
    //     marker.addTo(this.map);
    //   });

  }
  getImage(opportunitiesImages:OpportunityImages[]){
    if(opportunitiesImages.length)
    {
      let img = opportunitiesImages[0];
      return   AppConfigService.appCongif.resourcesUrl+"/"+img.imagePath;
    }
    return "../assets/images/imag-view-home2.png";
  }

  private getCurrentPosition(): any {
    return new Observable((observer: Subscriber<any>) => {
      if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition((position: any) => {
          observer.next({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,


          });
          observer.complete();
        });
      } else {
        observer.error();
      }
    });
  }





  // onClick(event: L.LeafletMouseEvent) {
  //   const newLatLng = event.latlng;
  //   this.marker.setLatLng(newLatLng);
  // }


  //Mosfet For Map

  getMapTileLayers(mapLayerTypes: MapTileLayerTypes, defaultLayer: any) {
    let baseMaps: any = {};
    baseMaps["Osm"] = defaultLayer;
    mapLayerTypes.types.forEach(s => {
      if (s.name != "OSM") {
        baseMaps[s.name] = L.tileLayer(s.tileLayerUrl, s.options);
      }


    });

    return baseMaps;


  }

  ngOnDestroy(): void {
    this.destroyMap();
    this.websiteService.destroy();
    let header: any = document.querySelector(".fixed-top");
    if (header) {
      header.style.backgroundColor = 'transparent';
    }

    this.subsList.forEach(s=>{
      if(s){
        s.unsubscribe();
      }
    });
  }

  destroyMap() {

    let m = document.querySelector("#website-map");
    if (m) {
      m.remove();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  showOpportunitiesOnMap() {
    
    if (this.map) {
      console.log(this.opportunities);
      this.markers = this.getMarkers();
      let mapData = {

        markers: this.markers,
      };
      this.setData(mapData);
      if(this.opportunityId)
      {
        let opportuity = this.opportunities.find(x=>x.id == this.opportunityId);
        if(opportuity)
        {
          let newLatLng = new L.LatLng(opportuity.latitude, opportuity.longitude);
            this.map.flyTo(newLatLng, 17, {
              animate: true,

            })
          
        }
      }
      
    }
  }
  openMark(id:number){
    this.mapMarkers.get(id).openPopup();
    const content = this.mapMarkers.get(id)["_icon"];
    if (content instanceof HTMLElement) {
      const tabContent = content.querySelector('.tab-content');
      if (tabContent) {
        const priceElement = tabContent.querySelector('img');
        if (priceElement) {
          priceElement.src = "../../../../assets//images/shape_active.svg";
        }
      }
    }
  }
  
  setData(data: any) {
    if (data.markers) {
      if (data.markers !== null) {
        data.markers.forEach((mark: any) => {
          if (!mark.type || mark.type == 'default') {
            mark.type = 'car';
          }
          mark.type = 'car';
          const imageUrl = `assets/images/unit.png`;
          let mapMarker: L.Marker<any> = this.mapMarkers.get(mark.id);
          if (mark.lat && mark.lng) {
            if (!mapMarker) {


              let pointMarker: L.Marker<any> = marker([mark.lat, mark.lng], { 
                icon: new L.DivIcon({
                  iconSize: [44, 56],
                  iconAnchor: [22, 56],
                  popupAnchor: [0, -20],
                  className: '',
                  html: `
                  <div class="tab-content">
                    <img height="35.1px" width="52px"  src="../../../../assets//images/shape.svg" alt="Tab Image">
                    <h1  class="map-price" >${mark.price}</h1>
                  </div>
                  `,

                })
              });




              // pointMarker.bindPopup(() => this.createCustomPopup(mark.opportuity),
              //   { autoPanPadding: new L.Point(5, 101) }).openPopup();
              pointMarker.bindPopup(() => this.createCustomPopup(mark.opportuity), {
                autoPanPadding: new L.Point(0, 0),
                closeOnClick: false,
                closeButton: false,
                autoClose: false,
                closeOnEscapeKey: false
              }).on('mouseover', (e) => {
                (e.target as L.Marker).openPopup();
                const content = e.sourceTarget["_icon"];
                if (content instanceof HTMLElement) {
                  const tabContent = content.querySelector('.tab-content');
                  if (tabContent) {
                    const priceElement = tabContent.querySelector('img');
                    if (priceElement) {
                      priceElement.src = "../../../../assets//images/shape_active.svg";
                    }
                  }
                }

              }).on('mouseout', (e) => {
                (e.target as L.Marker).closePopup();
                const content = e.sourceTarget["_icon"];
                if (content instanceof HTMLElement) {
                  const tabContent = content.querySelector('.tab-content');
                  if (tabContent) {
                    const priceElement = tabContent.querySelector('img');
                    if (priceElement) {
                      priceElement.src = "../../../../assets//images/shape.svg";
                    }
                  }
                }
                
              });
              this.mapMarkers.set(mark.id, pointMarker);
              

              this.markerCluster.addLayer(this.mapMarkers.get(mark.id));
              //this.layers.push(pointMarker);

            }
            else {
              //console.log("Marker Already Exist", mapMarker);
              let newLatLng = new L.LatLng(mark.lat, mark.lng);
              //console.log( mark.lat, mark.lng)

              mapMarker.setLatLng(newLatLng);
              mapMarker.setPopupContent(this.createCustomPopup(mark.opportuity));
              mapMarker.setIcon(L.icon({
                iconSize: [44, 56],
                iconAnchor: [22, 56],
                popupAnchor: [0, -50],
                iconUrl: imageUrl,
              }));

            }
          }
        });
      }
    }


  }

  private createCustomPopup(opportunity: Opportunity) {
    
    const factory = this.componentFactoryResolver.resolveComponentFactory(OpportuityMapPopupComponent);

    const component = factory.create(this.injector);
    component.instance.opportunity = opportunity;
    component.changeDetectorRef.detectChanges();

    return component.location.nativeElement;
  }

  getOpportunitStatusTypes() {
    if (this.lang == 'en') {
      this.opportunityStatusTypes = convertEnumToArray(OpportunitStatusEnum);
    }
    else {
      this.opportunityStatusTypes = convertEnumToArray(OpportunitStatusArEnum);

    }
  }


  getMarkers(): any {
    return this.opportunities.map((d) => {
      return {
        id: d.id,
        status: this.getStatusName(d),
        price: d.price,
        lat: d.latitude,
        lng: d.longitude,
        attributesValues: d.attributesValues,
        nameAr: d.nameAr,
        nameEn: d.nameEn,
        description: d.description,
        expireDate: d.expireDate,
        opportuity: { ...d }

      };
    });
  }

  getStatusName(opportunity: Opportunity) {
    let op = this.opportunityStatusTypes.find(x => x.id == opportunity.status);
    if (op) {
      return op.name;
    }
    else {
      return this.opportunityStatusTypes[0].name;
    }



  }
}
