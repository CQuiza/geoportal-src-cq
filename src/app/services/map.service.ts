import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  public userLocation?: [number, number, number];

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
