import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { UserActivate } from '../../../interfaces/user-activate';
import { UserService } from '../../../services/user.service';
import {MatExpansionModule} from '@angular/material/expansion';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatGridListModule, MatListModule, MatExpansionModule, ReactiveFormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{

  public userActivate: UserActivate = {
    userId: '',
    username: '',
    email: '',
    firstName: '',
    lastName: '',
  }

  public updateEmail:boolean = false;
  public updateUsername:boolean = false;

  private _userService = inject(UserService)
  public formUpdateEmail : FormGroup;
  public formUpdateUsername : FormGroup;

  constructor( private formBuilder: FormBuilder) {

    this.formUpdateEmail = this.formBuilder.group({
      attrUpdate: ['', [Validators.required, Validators.email]],
    })
    this.formUpdateUsername = this.formBuilder.group({
      attrUpdate: ['', [Validators.required]],
    })
  }

  ngOnInit(): void {
    this._userService.requestProfileUser().subscribe({
      next: (data:any) => {
        if(data.user)
        console.log('Profile exitoso:', data);
        this._userService.setUser(data.user);
        this.updateUser(data.user)
      },
      error: (error) => {
        console.error('Error al obtener el profile:', error);
      }

    })
  }

  updateUser(user:any):void{
    this.userActivate.userId = user.id;
    this.userActivate.email = user.email;
    this.userActivate.username = user.username;
    this.userActivate.firstName = 'Cristhian Andres';
    this.userActivate.lastName = 'Quiza Neuto';

    this.updateEmail = false;
    this.updateUsername = false;
  }

  updateInfoUser(attr:string){
    if (attr == 'email'){
      this.updateEmail = !this.updateEmail;
      console.log(this.updateEmail)
    }
    if (attr == 'username'){
      this.updateUsername = !this.updateUsername
    }
  }

  sendUpdate(attr:string){

    if (attr === 'email'){
      if(this.formUpdateEmail.invalid) return (alert('data error'))
      var object : any = {
        email : this.formUpdateEmail.value.attrUpdate
      }
    }
    if (attr === 'username'){
      if(this.formUpdateUsername.invalid) return (alert('data error'))
      var object : any = {
        username : this.formUpdateUsername.value.attrUpdate
      }
    }

    this._userService.updateAttr(object).subscribe({
      next: (data:any) => {
        if(data.email){
          console.log('Update exitoso:', data);
          alert('Update Granted');
          this.updateUser(data);
          this._userService.setUser(data);
          this.resetForm();
        }else {
          alert(data.message);
          console.log('update error:',{data})
        }
      },
      error: (err) => {
        console.error('Error al actualizar el email:', err);
        alert('Error al actualizar el email');
      }
    })
  }

  resetForm(){
    this.formUpdateEmail.reset();
    this.formUpdateUsername.reset();
  }
}
