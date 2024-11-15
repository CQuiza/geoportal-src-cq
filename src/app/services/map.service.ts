import { inject, Injectable } from '@angular/core';
import * as L from 'leaflet';
import { isPlatformBrowser } from '@angular/common';
import { ParcelsReqService } from './parcels-req.service';
import { BASE_URL } from '../settings/app.settings';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private _parcelsService = inject(ParcelsReqService)
  private api_SIPRA: string = BASE_URL.api_SIPRA
  private http = inject(HttpClient)
  public userLocation?: [number, number, number];
  public parcels : any;

  constructor() { }

  public getUserLocation(){
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.userLocation = [position.coords.latitude, position.coords.longitude, position.coords.accuracy];
      },
      (error) => {
        console.error('Error getting location', error);
      }
    );
    return this.userLocation;
  }

  getLandPotential(webMercatorPoint:{x:number, y:number}): Observable<any>{
    var data = this.http.get(`${this.api_SIPRA}point(${webMercatorPoint.x}%20${webMercatorPoint.y})`);
    this.parcels = data;
    return data
  }
  
}
