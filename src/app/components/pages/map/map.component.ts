import { Component, inject, OnInit } from '@angular/core';
import { MapService } from '../../../services/map.service';
import { icon, marker, Map, tileLayer, layerGroup, control } from 'leaflet';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { NgIf } from '@angular/common';
import { streetEsri, Esri_WorldImagery,Esri_WorldTopoMap} from './mapsStore';

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
  public streetEsri = streetEsri;
  public topoEsri = Esri_WorldTopoMap;
  public satelitalEsri = Esri_WorldImagery;

  public baseMaps: {} = {
    "streetMapEsri": this.streetEsri,
    "topoEsri": this.topoEsri,
    "satelitalEsri": this.satelitalEsri
  };

  public selectedLayer: string = 'streetEsri';
  public defaultLocation:[number,number] = [4.713, -74.086];
  constructor() { }

  ngOnInit(): void {
    this.mapService.getUserLocation();
    this.setMapLayers(this.baseMaps);
  }

  setMapLayers(baseMaps: {}): void {
    this.map = new Map('map').setView(this.defaultLocation, 10);
    this.streetEsri.addTo(this.map);
    control.layers(baseMaps).addTo(this.map);
  }

  goUserLocation(): void {

    setTimeout(()=>{
      if (this.mapService.userLocation) {
        console.log(this.mapService.userLocation)
      }
    }, 2000);
    this.userLocation = this.mapService.userLocation;
    if(this.userLocation){
      var lat = this.userLocation[0]
      var long = this.userLocation[1]
      var accuracy = this.userLocation[2]
      const popupContent = `${lat}, ${long}, ${accuracy.toFixed(3)}`;
      marker(this.userLocation).addTo(this.map).bindPopup(popupContent).openPopup();
      this.map.flyTo(this.userLocation, 15);
    }
  }






}
