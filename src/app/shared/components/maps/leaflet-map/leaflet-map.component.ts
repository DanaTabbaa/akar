import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import {
  OnDestroy,
  AfterViewInit
} from '@angular/core';

import { Observable, Subscriber } from 'rxjs';
import * as L from 'leaflet'




import { SharedService } from 'src/app/shared/services/shared.service';
import { latLng, tileLayer, marker, Marker } from 'leaflet';
import { MapLayer, MapTileLayerTypes } from 'src/app/core/models/map-layers';
const icon = L.icon({
  iconUrl: '../../../../../assets/images/map/marker-icon.png',
  shadowUrl: '../../../../../assets/images/map/marker-shadow.png',
  popupAnchor: [13, 0],
});

@Component({
  selector: 'app-leaflet-map',
  templateUrl: './leaflet-map.component.html',
  styleUrls: ['./leaflet-map.component.scss']
})


export class LeafletMapComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  mapLayerTypes: MapTileLayerTypes = new MapTileLayerTypes();
  defaultMapLayer: MapLayer = new MapLayer();
  map: any;
  marker!: Marker;

  @Output() onPositionSelected: EventEmitter<{ lat: any, lng: any }> = new EventEmitter();
  @Input() latlon:{lat:number, lng:number} = {lat:0, lng:0};
  @Input() locationDescription:string = '';
 
  constructor(private sharedService: SharedService) { }

  ngOnInit(): void {
    this.loadMap();
  }

  public ngAfterViewInit(): void {
  }

  private loadMap(): void {
    this.defaultMapLayer = this.mapLayerTypes.types[2];
    let defaultLayer = L.tileLayer(this.defaultMapLayer.tileLayerUrl, this.defaultMapLayer.options);
    
    this.map = L.map("leaflet-map", {
      layers: [defaultLayer],
      zoom: 5,
      center: L.latLng(this.latlon.lat ==0 && this.latlon.lng == 0 ? { lat: 26.402439, lng: 50.050850 }: this.latlon ),
      zoomControl: true
    });

    if(!(this.latlon.lat ==0 && this.latlon.lng == 0) )
    {
      
      this.marker = L.marker([this.latlon.lat, this.latlon.lng], { icon });
        //.bindPopup('Angular Leaflet');
        this.marker.addTo(this.map);
    }

    

    L.control.layers(this.getMapTileLayers(this.mapLayerTypes, defaultLayer), undefined, {
      position: 'bottomright'
    }).addTo(this.map);
    setTimeout(() => {
      this.map.invalidateSize();
    }, 1000);

    this.map.on('dblclick', (e)=>{

      console.log(e.latlng);
         
        if(this.marker){
          this.map.removeLayer(this.marker);
        }

        this.latlon = {lat:e.latlng.lat,lng:e.latlng.lng };

        this.marker = L.marker([e.latlng.lat, e.latlng.lng], { icon }).bindPopup(this.locationDescription);
        this.marker.addTo(this.map);
        this.onPositionSelected.emit(e.latlng);
    })


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





  onClick(event: L.LeafletMouseEvent) {
    const newLatLng = event.latlng;
    this.marker.setLatLng(newLatLng);
  }


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
  }

  destroyMap() {

    let m = document.querySelector("#leaflet-map");
    if (m) {
      m.remove();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
        
      if(this.map){
        if(!(this.latlon.lat ==0 && this.latlon.lng !=0)){
          if(this.marker){
            this.map.removeLayer(this.marker);
          }
          this.marker = L.marker([this.latlon.lat, this.latlon.lng], { icon }).bindPopup(this.locationDescription);
            //.bindPopup('Angular Leaflet');
            this.marker.addTo(this.map);
        }
        
      }


  
    
  }
}
