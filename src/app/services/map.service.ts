import { inject, Injectable } from '@angular/core';
import * as L from 'leaflet';
import { isPlatformBrowser } from '@angular/common';
import { ParcelsReqService } from './parcels-req.service';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private _parcelsService = inject(ParcelsReqService)
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
  
}
