import { CommonModule, NgIf } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { TablesComponent } from './tables/tables.component';
import { OwnerReqService } from '../../../services/owner-req.service';
import { OwnersPost,OwnersGet } from '../../../interfaces/owners';
import { DataSource } from '@angular/cdk/collections';
import { ResponseOwners } from '../../../interfaces/resposeOwner';
import { MatTableModule } from '@angular/material/table';
import { ParcelsReqService } from '../../../services/parcels-req.service';
import { Parcel } from '../../../interfaces/parcel';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import {MatButtonToggleModule} from '@angular/material/button-toggle';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [MatButtonModule, MatFormField, MatInputModule, ReactiveFormsModule, NgIf, TablesComponent, MatTableModule, CommonModule, MatDatepickerModule, MatMomentDateModule, MatButtonToggleModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent implements OnInit{

  @Input() drawWkt!: string;
  @Input() inputWktPolygon!: string

  data: any;
  dataSource: OwnersGet[] = [];
  displayedColumns: string[] = ['id', 'name','lastName','email','phone', 'description', 'task', 'done'];

  private ownerReqService = inject(OwnerReqService)
  private parcelsReqService = inject(ParcelsReqService)
  private toast! : any;

  selectedForm : 'owners' | 'parcels' | 'party' = 'owners';
  selectedState: 'save' | 'edit' = 'save'

  ownersForm : FormGroup;
  parcelForm : FormGroup;

  constructor(private formBuilder : FormBuilder) {
    this.ownersForm = this.formBuilder.group({
      ownerName: [''],
      ownerLastName: [''],
      ownerEmail: [''],
      ownerPhone: [''],
      ownerDescription: [''],
      ownerTask : [''],
      ownerDone : ['']
    });

    this.parcelForm = this.formBuilder.group({
      parcelCode: ['',[Validators.required]],
      parcelMunicipality: ['',[Validators.required]],
      parcelOwner: ['',[Validators.required]],
      parcelGeom: [''],
      parcelArea: ['',[Validators.required]],
      parcelLandUse: ['',[Validators.required]],
      parcelDateCreate: [''],
      parcelUpdateAt: ['']
    });
  }

  ngOnInit(): void {
    this.showForm('owners');
  }

  showForm(form: 'owners' | 'parcels' | 'party'):void {
    this.selectedForm = form;
    if(form === 'owners'){
      this.ownerReqService.getOwner().subscribe({
        next: (data:OwnersGet[]) => {
          if(data){
            console.log('Owners:', data)
            this.dataSource = data
          }else {
            console.log('Owners: No hay owners registrados')
          }
        },error: (error: any) => {
            console.log('Error:', error.message);
        }
      })

    } else if (form === 'parcels'){
      this.parcelsReqService.getParcels().subscribe({
        next: (data: any) => {
          if(data){
            console.log('Parcels:', data.features)
            this.data = data
          }else {
            console.log('Parcels: No hay parcels registrados')
          }
        },error: (error: any) => {
            console.log('Error:', error.message);
        }
      })
    } else {
    }
  }

  showGeomWKT(geom:any):void{
    // console.log('Geom')
    // geom = geom.geometry.coordinates
    // alert(`coordinates: ${geom}`)
    // alert(`${JSON.stringify(geom, null, 4)}`)
    alert(this.coordinatesToWKT(geom.geometry.coordinates[0]))
  }

  showGeomGeoJSON(geom:any){
    alert(`${JSON.stringify(geom, null, 4)}`)
  }

  showToast(message: string) {
    this.toast = document.getElementById("toast");
    
    this.toast.innerHTML = message;
    this.toast.style.display = "block";
    
    // Temporizador para que desaparezca
    setTimeout(() => {this.toast.style.display = "none";}, 5000) //setTimeout(function(),delay_ms)
  }

  onOwnersSubmit() {
    if (this.ownersForm.valid) {
      console.log('Login', this.ownersForm.value);
      var dataPost: OwnersPost = {
        name: this.ownersForm.value.ownerName,
        lastName: this.ownersForm.value.ownerLastName,
        email: this.ownersForm.value.ownerEmail,
        phone: this.ownersForm.value.ownerPhone,
        description: this.ownersForm.value.ownerDescription,
        task: this.ownersForm.value.ownerTask,
        done: this.ownersForm.value.ownerDone,
      }
      console.log(dataPost)
      this.postOwner(dataPost)
    }else {
      alert('Data error: Form invalid.')
    }
  }

  postOwner(Post:OwnersPost){
    if(this.selectedState ==='save'){
      this.ownerReqService.postOwner(Post).subscribe({
        next: (data:OwnersPost) => {
          console.log('Owner registrado:', data)
          this.showToast('Propietario registrado correctamente.')
          this.resetFormOwner()
        },error: (error: any) => {
            console.log('Error:', error.message);
            alert(`Error al registrar el propietario: ${error.message}`)
          }
        })
      }
  }

  resetFormOwner(): void {
    this.ownersForm.reset();
    this.showForm('owners')
  }

  onParcelSubmit() {
    console.log(this.drawWkt);
    if (this.parcelForm.valid) {
    console.log('Register', this.parcelForm.value);
    var dataPost: Parcel = {
      code: this.parcelForm.value.parcelCode,
      municipality: this.parcelForm.value.parcelMunicipality,
      geom: this.drawWkt,
      party_owner: this.parcelForm.value.parcelOwner,
      area: this.parcelForm.value.parcelArea,
      land_use: this.parcelForm.value.parcelLandUse,
      date_create: this.parcelForm.value.parcelDateCreate,
      update_at: this.parcelForm.value.parcelUpdateAt,
    }
    console.log(this.drawWkt);
    console.log(dataPost)
    this.postParcel(dataPost)
  } else {
    alert('Data error: Form invalid.')
  }
}

postParcel(dataPost:Parcel):void {
  if(this.selectedState === 'save'){
    this.parcelsReqService.postParcel(dataPost).subscribe({
      next: (data: Parcel) => {
        console.log('Parcel registrada:', data)
        this.showToast('Parcela registrada correctamente.')
        this.resetFormParcel()
      },error: (error: any) => {
          console.log('Error:', error.message);
          alert(`Error al registrar la parcela: ${error.message}`)
        }
      })
    }
  }

  getRecord(code:number):void{
    // console.log(code)
    this.parcelsReqService.getParcelCode(code).subscribe({
      next: (data: any) => {
        if(data){
          console.log('Parcel:', data)
          this.parcelForm.patchValue({
            parcelCode: data.properties.code,
            parcelMunicipality: data.properties.municipality,
            parcelGeom: data.geometry.coordinates,
            parcelOwner: data.properties.party_owner,
            parcelArea: data.properties.area,
            parcelLandUse: data.properties.land_use,
            parcelDateCreate: data.properties.date_create,
            parcelUpdateAt: data.properties.update_at,
          })
          this.selectedState = 'edit'
        }else {
          console.log('Parcel: No hay parcela con ese código')
        }
      },error: (error: any) => {
          console.log('Error:', error.message);
          alert(`Error al obtener la parcela: ${error.message}`)
      }
    })
  }

  updateParcel(){
    if (this.parcelForm.valid) {
      console.log('geomForm', this.parcelForm.value.parcelGeom)
      var parcelWktConverted = this.coordinatesToWKT(this.parcelForm.value.parcelGeom[0])
      console.log('Update', this.parcelForm.value);
      var dataPut: Parcel = {
        code: this.parcelForm.value.parcelCode,
        municipality: this.parcelForm.value.parcelMunicipality,
        geom: parcelWktConverted,
        party_owner: this.parcelForm.value.parcelOwner,
        area: this.parcelForm.value.parcelArea,
        land_use: this.parcelForm.value.parcelLandUse,
        date_create: this.parcelForm.value.parcelDateCreate,
        update_at: this.parcelForm.value.parcelUpdateAt,
      }
      console.log(dataPut)
      this.parcelsReqService.putParcel(dataPut.code,dataPut).subscribe({
        next: (data: any) => {
          console.log('Parcel actualizada:', data)
          this.resetFormParcel()
        },error: (error: any) => {
          console.log('Error:', error.message);
          alert(`Error al actualizar la parcela: ${error.message}`)
        }
      })

    }else {
      console.log('Formulario de parcela incompleto')
    }
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

  resetFormParcel():void{
    this.parcelForm.reset()
    this.selectedState ='save'
    this.showForm('parcels')
  }


}
