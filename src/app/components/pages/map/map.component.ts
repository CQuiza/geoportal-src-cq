import { Component, inject, OnInit } from '@angular/core';
import { MapService } from '../../../services/map.service';
import { icon, marker, Map, tileLayer, layerGroup, control, GeoJSON, FeatureGroup } from 'leaflet';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { streetEsri, Esri_WorldImagery,Esri_WorldTopoMap} from './mapsStore';
import { ParcelsReqService } from '../../../services/parcels-req.service';
import { Parcel } from '../../../interfaces/parcel';
import * as wellknown from 'wellknown'
import { ProjectsComponent } from '../projects/projects.component';
import { AuthService } from '../../../services/auth.service';
import '@geoman-io/leaflet-geoman-free'

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [MatButton, MatCardActions, MatCardContent, MatCardSubtitle, MatCardTitle, MatCardHeader, MatCard, NgIf, NgFor, ProjectsComponent, AsyncPipe],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements OnInit{
  
  public map: any;

  public userLocation?: any;
  public mapService = inject(MapService)
  public authService = inject(AuthService);
  public parcelsService = inject(ParcelsReqService)
  public streetEsri = streetEsri;
  public topoEsri = Esri_WorldTopoMap;
  public satelitalEsri = Esri_WorldImagery;
  public parcels: Parcel[] = [];

  private _drawItems! : FeatureGroup;
  public drawPolygon! : any;
  public wktPolygon: string = "";
  public drawWkt!: string;

  public baseMaps: {} = {
    "streetMapEsri": this.streetEsri,
    "topoEsri": this.topoEsri,
    "satelitalEsri": this.satelitalEsri
  };

  public selectedLayer: string = 'streetEsri';
  public defaultLocation:[number,number] = [4.713, -74.086];

  constructor() {}

  ngOnInit(): void {
    this.mapService.getUserLocation();
    this.setMapLayers(this.baseMaps);
  }

  setMapLayers(baseMaps: {}): void {
    this.map = new Map('map').setView(this.defaultLocation, 10);
    this.streetEsri.addTo(this.map);
    control.layers(baseMaps).addTo(this.map);
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        // Aquí puedes agregar la lógica que deseas ejecutar si el usuario está logueado
        this.getParcels()
      }
    });
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

  //Funcion de parcelas 
  getParcels(): void {
    {
      this.parcelsService.getParcels().subscribe({
        next: (data: Parcel[]) => {
          if(data){
            this.parcels = data
            console.log('Parcels:', this.parcels)
            this.showParcelsOnMap()
          }else {
            console.log('Parcels: No hay parcels registrados')
          }
        },error: (error: any) => {
            console.log('Error:', error.message);
        }
      })
    } 
  }

  showParcelsOnMap(): void {
    this.parcels.forEach(parcel => {
      if (parcel.geom) {
        const geoJsonFeature = {
          type: "Feature" as const,
          geometry: wellknown.parse(parcel.geom),
          properties: {
            id: parcel.code,
            name: parcel.party_owner,
            description: parcel.land_use,
            // Añade aquí más propiedades que quieras mostrar
          }
        };

        const geoJsonLayer = new GeoJSON(geoJsonFeature, {
          style: {
            color: '#ff7800',
            weight: 2,
            opacity: 0.65
          },
          onEachFeature: (feature, layer) => {
            const popupContent = `
              <div>
                <h4><strong>owner:</strong>${parcel.party_owner}</h4>
                <p><strong>ID:</strong> ${parcel.code}</p>
                <p><strong>Descripción:</strong> ${parcel.land_use}</p>
                <!-- Añade más atributos aquí -->
              </div>
            `;
            layer.bindPopup(popupContent);
          }
        });

        geoJsonLayer.addTo(this.map);
        this.map.fitBounds(geoJsonLayer.getBounds()); // Hacer zoom al feature
        
      }
    });
  }

  //iniciador de edicion
  initDrawControl(): void {
    this._drawItems = new FeatureGroup();
    this.map.addLayer(this._drawItems);

    // Configurar controles de dibujo
    this.map.pm.addControls({  
      position: 'topleft',  
      drawCircleMarker: false,
      rotateMode: false,
    });  

    // Escuchar eventos de dibujo
    this.map.on('pm:create', (e: any) => {
      this.drawPolygon = e.layer;
      this._drawItems.addLayer(this.drawPolygon);
      
      // Obtener WKT del polígono dibujado
      const coordinates = this.drawPolygon.getLatLngs()[0];
      console.log(coordinates);
      const wkt = this.convertToWKT(coordinates);
      this.drawWkt = wkt; 
      
      // Actualizar el formulario
      this.updateForm(wkt);
    });
  }

  //convertir a wkt
  private convertToWKT(coordinates: any[]): string {
    // Asegurarse de que el primer y último punto sean iguales para cerrar el polígono
    if (!this.arePointsEqual(coordinates[0], coordinates[coordinates.length - 1])) {
      coordinates.push(coordinates[0]);
    }
  
    // Convertir coordenadas a formato WKT
    const coordsString = coordinates
      .map(coord => `${coord.lng} ${coord.lat}`)
      .join(',');
  
    return `POLYGON((${coordsString}))`;
  }

  //guardar wkt en variable
  private updateForm(wkt: string): void {
    this.wktPolygon = wkt;
    console.log('Polígono en formato WKT:', wkt);
    // Aquí puedes agregar la lógica adicional para actualizar tu formulario
    // Por ejemplo, si tienes un formulario reactivo:
    // this.form.patchValue({ geometry: wkt });
  }
  
  private arePointsEqual(point1: any, point2: any): boolean {
    return point1.lat === point2.lat && point1.lng === point2.lng;
  }

  // Remover el mapa al cambiar de ruta en la web
  ngOnDestroy(): void {
    if (this.map){
      this.map.remove();
    }
  }






}
