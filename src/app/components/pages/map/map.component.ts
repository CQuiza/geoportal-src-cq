import { Component, inject, OnInit } from '@angular/core';
import { MapService } from '../../../services/map.service';
import { icon, marker, Map, tileLayer } from 'leaflet';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [MatButton, MatCardActions, MatCardContent, MatCardSubtitle, MatCardTitle, MatCardHeader, MatCard, NgIf],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements OnInit{

  public map: any;

  public userLocation?: any;
  public mapService = inject(MapService)
  public defaultLocation:[number,number] = [4.713, -74.086];
  constructor() { }

  ngOnInit(): void {
    this.mapService.getUserLocation();
  }

  ngAfterViewInit(): void {
    this.map = new Map('map').setView(this.defaultLocation, 10);
    tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
    }).addTo(this.map);
  };

  goUserLocation(): void {

    setTimeout(()=>{
      if (this.mapService.userLocation) {
        console.log(this.mapService.userLocation)
      }
    }, 2000);
    this.userLocation = this.mapService.userLocation;
    if(this.userLocation){
      const popupContent = `${this.userLocation[0]}, ${this.userLocation[1]}, ${this.userLocation[2].toFixed(3)}`;
      marker(this.userLocation).addTo(this.map).bindPopup(popupContent).openPopup();
      this.map.flyTo(this.userLocation, 15);
    }
  }

}
