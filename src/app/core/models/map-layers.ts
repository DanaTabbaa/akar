export class MapLayer {
    key: string = '';
    name: string = '';
    tileLayerUrl: string = '';
    options: {} = {};
}

export class MapTileLayerTypes {
    types: MapLayer[] = [
        {
            key: "google",
            name: "Google",
            tileLayerUrl: "http://mt.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
            options: {
                minZoom:2,
               
            }
        },
        {
            key:"googleRoad",
            name:"Google Road",
            options:{
                minZoom:2,
                
            },
            tileLayerUrl:"https://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}&s=Ga"
        },

        {
            key: "osm",
            name: "OSM",
            tileLayerUrl: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            options: {
                minZoom:2,
                
            }
        },
        {
            key: "mapbox",
            name: "MapBox",
            tileLayerUrl: "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
            options: {
                attribution: "Gmtcc Copyright",
                maxZoom: 18,
                minZoom:2,
               
                id: 'mapbox/streets-v11',
                tileSize: 512,
                zoomOffset: -1,
                accessToken: 'pk.eyJ1IjoibW9zZmV0MjAxMSIsImEiOiJja2lwcTNid2kxYWRzMndwMzg4NXJ2NnQyIn0.89V__D58hWsdzj6IctCHXw'
            }
        },
        {
            key: "googleSat",
            name: "Google Satelite",
            tileLayerUrl: "https://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}&s=Ga",
            options: {
                minZoom:2,
                
            }
        },
        {
            key: "arcGisTopo",
            name: "Arc Gis Topo",
            tileLayerUrl: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}.png",
            options:{
                minZoom:2,
                
            }
        },
        {
            key: "arcGisImagery",
            name: "Arc Gis Imagery",
            tileLayerUrl: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.png",
            options:{
                minZoom:2,
               
            }
        },
        {
            key: "wikimedia",
            name: "Wikimedia",
            tileLayerUrl: "https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png",
            options:{
                minZoom:2,
                
            }
        }

    ]
}