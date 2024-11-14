import { Component, inject, OnInit } from '@angular/core';
import { MapService } from '../../../services/map.service';
import { icon, marker, Map, tileLayer, layerGroup, control, GeoJSON, FeatureGroup } from 'leaflet';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { streetEsri, Esri_WorldImagery, Esri_WorldTopoMap } from './mapsStore';
import { ParcelsReqService } from '../../../services/parcels-req.service';
import { Parcel } from '../../../interfaces/parcel';
import * as wellknown from 'wellknown'
import { ProjectsComponent } from '../projects/projects.component';
import { AuthService } from '../../../services/auth.service';
import '@geoman-io/leaflet-geoman-free'
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [MatButton, MatCardActions, MatCardContent, MatCardSubtitle, MatCardTitle, MatCardHeader, MatCard, NgIf, NgFor, ProjectsComponent, AsyncPipe, MatInputModule, ReactiveFormsModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements OnInit {

  public map: any;

  public userLocation?: any;
  public mapService = inject(MapService)
  public authService = inject(AuthService);
  public parcelsService = inject(ParcelsReqService)
  public streetEsri = streetEsri;
  public topoEsri = Esri_WorldTopoMap;
  public satelitalEsri = Esri_WorldImagery;
  public parcels: any[] = [];

  private _drawItems!: FeatureGroup;
  public drawPolygon!: any;
  public wktPolygon: string = "";
  public inputWktPolygon: string = "";
  public drawWkt!: string;
  public inputGeoJSON: boolean = false;

  inputGeoJSONForm: FormGroup;

  public baseMaps: {} = {
    "streetMapEsri": this.streetEsri,
    "topoEsri": this.topoEsri,
    "satelitalEsri": this.satelitalEsri
  };

  public selectedLayer: string = 'streetEsri';
  public defaultLocation: [number, number] = [4.713, -74.086];

  constructor(
    private _formBuilder: FormBuilder
  ) {
    this.inputGeoJSONForm = this._formBuilder.group({
      geojson: ['', Validators.required]
    });
  }

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

    setTimeout(() => {
      if (this.mapService.userLocation) {
        console.log(this.mapService.userLocation)
      }
    }, 2000);
    this.userLocation = this.mapService.userLocation;
    if (this.userLocation) {
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
        next: (data: any) => {
          if (data) {
            this.parcels = data.features
            console.log('Parcels:', this.parcels)
            this.showParcelsOnMap(data)
          } else {
            console.log('Parcels: No hay parcels registrados')
          }
        }, error: (error: any) => {
          console.log('Error:', error.message);
        }
      })
    }
  }

  showParcelsOnMap(data:any): void {
    console.log(JSON.stringify(data, null, 4));
    this.parcels.forEach(parcel => {
      console.log(JSON.stringify(parcel, null, 4));
      if (parcel.geometry) {
        var geoJsonFeature = parcel.geometry

        console.log(JSON.stringify(geoJsonFeature, null, 4));

        var geoJsonLayer = new GeoJSON(geoJsonFeature, {
          style: {
            color: '#ff7800',
            weight: 2,
            opacity: 0.65
          },
          onEachFeature: (feature, layer) => {
            var popupContent = `
              <div>
                <h4><strong>owner:</strong>${parcel.properties.party_owner}</h4>
                <p><strong>ID:</strong> ${parcel.properties.code}</p>
                <p><strong>Land use:</strong> ${parcel.properties.land_use}</p>
                <p><strong>Area:</strong> ${parcel.properties.area} m²</p>
                <p><strong>Municipality:</strong> ${parcel.properties.municipality}</p>
                <p><strong>Date create:</strong> ${parcel.properties.date_create}</p>
                <p><strong>Date update:</strong> ${parcel.properties.update_at}</p>
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

  // private formatGeoJSON(parcel:any){
  //   const geoJsonFeature = {
  //     type: "Feature" as const,
  //     geometry: wellknown.parse(parcel.geometry),
  //     properties: {
  //       id: parcel.id,
  //       party_owner: parcel.properties.party_owner,
  //       municipality: parcel.properties.municipality,
  //       area: parcel.properties.area,
  //       land_use: parcel.properties.land_use,
  //       date_create: parcel.properties.date_create,
  //       update_at: parcel.properties.update_at,
        
  //       // Añade aquí más propiedades que quieras mostrar
  //     }
  //   };
  //   return geoJsonFeature;
  // }

  //iniciador de edicion
  initDrawControl(): void {
    this._drawItems = new FeatureGroup();
    this.map.addLayer(this._drawItems);

    // Configurar controles de dibujo
    this.map.pm.addControls({
      position: 'topleft',
      //drawCircleMarker: true,
      // rotateMode: true,
    });

    // Escuchar eventos de dibujo
    this.map.on('pm:create', (e: any) => {
      this.drawPolygon = e.layer;
      this._drawItems.addLayer(this.drawPolygon);

      // Obtener WKT del polígono dibujado
      var coordinates = this.drawPolygon.getLatLngs()[0];
      console.log(coordinates);
      var wkt = this.convertToWKT(coordinates);
      this.drawWkt = wkt;

      // Actualizar el formulario
      this.updateForm(wkt);
    });
  }

  //convertir a wkt
  private convertToWKT(coordinates: any[]): string {
    console.log('convertWKT',coordinates);
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
    if (this.map) {
      this.map.remove();
    }
  }


  changeInputGeoJSON() {
    if (this.inputGeoJSON === false) {
      this.inputGeoJSON = true;
    } else {
      this.inputGeoJSON = false;
    }
  }

  uploadGeoJSON() {
    alert('uploadGeoJSON')
    if (this.inputGeoJSONForm.valid) {
      // console.log(this.inputGeoJSONForm.value.geojson)
      var geoJSONParse = JSON.parse(this.inputGeoJSONForm.value.geojson)
      console.log(geoJSONParse)
      // console.log(JSON.stringify(geoJSONParse, null, 4))


      var geoJsonFeature = geoJSONParse;
      console.log(geoJsonFeature)
      var geoJsonLayer = new GeoJSON(geoJsonFeature.geometry, {
        style: {
          color: '#ff7800',
          weight: 2,
          opacity: 0.65
        },
        onEachFeature: (feature, layer) => {
          var popupContent = `
            <div>
                <h4><strong>owner:</strong>${geoJsonFeature.properties.party_owner}</h4>
                <p><strong>ID:</strong> ${geoJsonFeature.properties.id}</p>
                <p><strong>Land use:</strong> ${geoJsonFeature.properties.land_use}</p>
                <p><strong>Area:</strong> ${geoJsonFeature.properties.area} m²</p>
                <p><strong>Municipality:</strong> ${geoJsonFeature.properties.municipality}</p>
                <p><strong>Date create:</strong> ${geoJsonFeature.properties.date_create}</p>
                <p><strong>Date update:</strong> ${geoJsonFeature.properties.update_at}</p>
                <!-- Añade más atributos aquí -->
              </div>
          `;
          layer.bindPopup(popupContent);
        }
      });

      geoJsonLayer.addTo(this.map);
      this.map.fitBounds(geoJsonLayer.getBounds());
      console.log(geoJsonFeature.geometry.coordinates)
      this.map.flyTo(geoJsonFeature.geometry.coordinates[0][0].reverse(), 18);
    }
  }

  saveGeoJSON(){
    alert('Save')
    var geoJSONParse = JSON.parse(this.inputGeoJSONForm.value.geojson)
    var wkt = this.coordinatesToWKT(geoJSONParse.geometry.coordinates[0]);
    console.log(wkt)
    this.wktPolygon = wkt
    var dataPost : any  = {
      code: geoJSONParse.properties.code,
      municipality: geoJSONParse.properties.municipality,
      geom: wkt,
      party_owner: geoJSONParse.properties.party_owner,
      area: geoJSONParse.properties.area,
      land_use: geoJSONParse.properties.land_use,
      date_create: geoJSONParse.properties.date_create,
      update_at: geoJSONParse.properties.update_at,
    }

    this.parcelsService.postParcel(dataPost).subscribe({
      next: (data: Parcel) => {
        console.log('Parcel registrada:', data)
        this.resetFormParcelInputGeoJSON()
      },error: (error: any) => {
          console.log('Error:', error.message);
          alert(`Error al registrar la parcela: ${error.message}`)
        }
      })
    }

  resetFormParcelInputGeoJSON(){
    this.inputGeoJSONForm.reset()
    this.ngOnDestroy()
    this.ngOnInit()
  }

  coordinatesToWKT(coordinates: number[][]): string {
    if (!coordinates || coordinates.length === 0) {
      throw new Error("No se proporcionaron coordenadas.");
    }
  
    // Convertimos cada par de coordenadas a "x y" en WKT
    const wktCoordinates = coordinates.map(coord => `${coord[0]} ${coord[1]}`).join(', ');
  
    // Creamos el WKT con formato POLYGON
    return `SRID=4326;POLYGON ((${wktCoordinates}))`;
  }






}
