import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,Observer } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor(private http: HttpClient) { }

  getLocationDetails(lat: number, lon: number): Observable<any> {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
    return this.http.get<any>(url);
  }

  getCurrentLocation(): Observable<Position> {
    return new Observable((observer: Observer<Position>) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position: Position) => {
            observer.next(position);
            observer.complete();
          },
          (error: any) => {
            observer.error(error);
          }
        );
      } else {
        observer.error('Geolocation is not supported by this browser.');
      }
    });
  }
}
export class Position{
    coords:Coord = new Coord();  
}

class Coord{
    latitude:any;
    longitude:any;
}
