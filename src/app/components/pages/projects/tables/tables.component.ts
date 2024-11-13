import { CommonModule, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatTableModule} from '@angular/material/table';
import { PartyReqService } from '../../../../services/party-req.service';
import { MatButtonModule } from '@angular/material/button';



@Component({
  selector: 'app-tables',
  standalone: true,
  imports: [MatButtonModule,MatTableModule, MatFormField, MatInputModule, ReactiveFormsModule, NgIf, TablesComponent, MatTableModule, CommonModule, MatDatepickerModule, MatMomentDateModule],
  templateUrl: './tables.component.html',
  styleUrl: './tables.component.css'
})
export class TablesComponent implements OnInit{

  data : any;
  idUpdate! : number;
  numberIdUpdate! : number;

  displayedColumns: string[] = ['id', 'name','number_id','address','phone'];

  private partyReqService = inject(PartyReqService);

  selectedState : 'save' | 'edit' = 'save';

  partyForm : FormGroup;

  constructor( private formBuilder: FormBuilder){
    this.partyForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      number_id : ['', [Validators.required]],
      address: ['', [Validators.required]],
      phone: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.showFormParty();
    
  }

  showFormParty(){
    this.partyReqService.getParty().subscribe({
      next: (data:any) => {
        if(data){
          console.log('party:',data);
          this.data = data;
        } else {
          console.log('Party: No hay party registrada')
        };
      }, error: (error:any) => {
        console.log('Error:', error.message);
      }
    })
  }

  onPartySubmit(){
    console.log('onPartySubmit');
    if (this.partyForm.valid){
      console.log(this.partyForm.value);

      var dataPost : any = {
        name : this.partyForm.value.name,
        number_id : this.partyForm.value.number_id,
        address : this.partyForm.value.address,
        phone : this.partyForm.value.phone 
      }
      this.postParty(dataPost);
    } else {
      alert('Data error: Form invalid');
    }
  }

  postParty(dataPost:any){
    if (this.selectedState === 'save'){
      this.partyReqService.postParty(dataPost).subscribe({
        next: (data:any)=> {
          console.log('party',data);
          this.resetFormParty();
        }, error: (error:any)=> {
          console.log('Error:', error.message);
          alert(`Error al registrar el party: ${error.message}`)
        }
      })
    }
  };

  resetFormParty(){
    this.partyForm.reset();
    this.selectedState ='save';
    this.showFormParty();
  }

  getRecordParty(id : number){
    this.idUpdate = id;
    this.partyReqService.getPartyCode(id).subscribe({
      next: (data:any)=> {
        console.log('party',data);
        this.numberIdUpdate = data.number_id;
        this.partyForm.patchValue({
          name : data.name,
          number_id : data.number_id,
          address : data.address,
          phone : data.phone 
        });
        this.selectedState = 'edit';
      }, error: (error:any)=> {
        console.log('Error:', error.message);
        alert(`Error al obtener el party: ${error.message}`)
      }
    })
  }

  updateParty(){
    var dataPut : any = {
      name : this.partyForm.value.name,
      number_id : this.numberIdUpdate,
      address : this.partyForm.value.address,
      phone : this.partyForm.value.phone
    }
    this.partyReqService.putParty(this.idUpdate, dataPut).subscribe({
      next: (data:any) => {
        console.log('party actualizada:', data)
        this.resetFormParty();
      }, error: (error:any) => {
        console.log('Error:', error.message);
        alert(`Error al actualizar el party: ${error.message}`)
      }
    })
  }

}
