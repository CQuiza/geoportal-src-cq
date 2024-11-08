import { CommonModule, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [MatButtonModule, MatFormField, MatInputModule, ReactiveFormsModule, NgIf, TablesComponent, MatTableModule, CommonModule, MatDatepickerModule, MatMomentDateModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent implements OnInit{

  data: Parcel[] = [];
  dataSource: OwnersGet[] = [];
  displayedColumns: string[] = ['id', 'name','lastName','email','phone', 'description', 'task', 'done'];

  private ownerReqService = inject(OwnerReqService)
  private parcelsReqService = inject(ParcelsReqService)

  selectedForm : 'owners' | 'parcels' = 'owners';
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
      parcelGeom: ['',[Validators.required]],
      parcelArea: ['',[Validators.required]],
      parcelLandUse: ['',[Validators.required]],
      parcelDateCreate: [''],
      parcelUpdateAt: ['']
    });
  }

  ngOnInit(): void {
    this.showForm('owners');
  }

  showForm(form: 'owners' | 'parcels'):void {
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

    } else{
      this.parcelsReqService.getParcels().subscribe({
        next: (data: Parcel[]) => {
          if(data){
            console.log('Parcels:', data)
            this.data = data
          }else {
            console.log('Parcels: No hay parcels registrados')
          }
        },error: (error: any) => {
            console.log('Error:', error.message);
        }
      })
    }
  }

  showGeom(geom:string):void{
    console.log('Geom')
    alert(`${geom}`)
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
    if (this.parcelForm.valid) {
    console.log('Register', this.parcelForm.value);
    var dataPost: Parcel = {
      code: this.parcelForm.value.parcelCode,
      municipality: this.parcelForm.value.parcelMunicipality,
      geom: this.parcelForm.value.parcelGeom,
      party_owner: this.parcelForm.value.parcelOwner,
      area: this.parcelForm.value.parcelArea,
      land_use: this.parcelForm.value.parcelLandUse,
      date_create: this.parcelForm.value.parcelDateCreate,
      update_at: this.parcelForm.value.parcelUpdateAt,
    }
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
        this.resetFormParcel()
      },error: (error: any) => {
          console.log('Error:', error.message);
          alert(`Error al registrar la parcela: ${error.message}`)
        }
      })
    }
  }

  getRecord(code:number):void{
    console.log(code)
    this.parcelsReqService.getParcelCode(code).subscribe({
      next: (data: Parcel) => {
        if(data){
          console.log('Parcel:', data)
          this.parcelForm.patchValue({
            parcelCode: data.code,
            parcelMunicipality: data.municipality,
            parcelGeom: data.geom,
            parcelOwner: data.party_owner,
            parcelArea: data.area,
            parcelLandUse: data.land_use,
            parcelDateCreate: data.date_create,
            parcelUpdateAt: data.update_at,
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
      console.log('Update', this.parcelForm.value);
      var dataPut: Parcel = {
        code: this.parcelForm.value.parcelCode,
        municipality: this.parcelForm.value.parcelMunicipality,
        geom: this.parcelForm.value.parcelGeom,
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

  resetFormParcel():void{
    this.parcelForm.reset()
    this.selectedState ='save'
    this.showForm('parcels')
  }


}
