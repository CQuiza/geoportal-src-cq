import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReplacePipe } from '../../../replace.pipe';
import { Router, RouterLink } from '@angular/router';
import { UserLoginComponent } from '../user-login/user-login.component';
import { Users } from '../../../interfaces/users';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ReplacePipe, RouterLink, UserLoginComponent],
  templateUrl: './user-register.component.html',
  styleUrl: './user-register.component.css'
})
export class UserRegisterComponent implements OnInit{

  private _router = inject(Router)
  private _authService = inject(AuthService)

  formRegister : FormGroup ;
  usuarioActivo: Users = {
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  }
  rolType: string = 'Interesed';

  constructor(private formBuilder: FormBuilder) {

    this.formRegister = this.formBuilder.group({

      firstName: ['', [Validators.minLength(3), Validators.required]],
      lastName: ['', [Validators.minLength(3), Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      rolType:['',],
      rolId: ['',],
      password: ['', [Validators.required, Validators.minLength(8)]],
      checkPassword: ['', [Validators.required, Validators.minLength(8)]],
      checkAgg: ['',]
    })
  }
  ngOnInit(): void {
    this.formRegister.get('rolType')?.valueChanges.subscribe(value => {
      this.rolType = value
    })
    this.formRegister.patchValue({
      username: this.usuarioActivo.username,
      email: this.usuarioActivo.email,
    })
    if (this.usuarioActivo.firstName.length > 0 ) {
      this.formRegister.get('firstName')?.disable();
    }
    if (this.usuarioActivo.lastName.length > 0 ) {
      this.formRegister.get('lastName')?.disable();
    }
    if (this.usuarioActivo.email.length > 0 ){
      this.formRegister.get('email')?.disable();
    }
    if (this.usuarioActivo.username.length > 0 ){
      this.formRegister.get('username')?.disable();
    }
    if (this.usuarioActivo.password.length > 0 ){
      this.formRegister.get('password')?.disable();
    }
  }

  hasError(controlName:string, errorType:string){
    return this.formRegister.get(controlName)?.hasError(errorType) && this.formRegister.get(controlName)?.touched
  }

  sendRegister(){
    if (this.formRegister.invalid) return (alert("Credencials error"));
    if (this.formRegister.value.password !== this.formRegister.value.checkPassword) return (alert("Password error"));

    const objeto:Users = {
      firstName: this.formRegister.value.firstName,
      lastName: this.formRegister.value.lastName,
      email: this.formRegister.value.email,
      username: this.formRegister.value.username,
      password: this.formRegister.value.password,
    }

    this._authService.register(objeto).subscribe({
      next:(data:any) => {
        if(data.isSucces){
          let token: string = data.token
          this._authService.logged(token)
          console.log({data})
          alert(data.message);
        }else {
          alert(data.username[0]);
          console.log('register error:',{data})
        }
      },
      error: (error:any) => {
        console.log(error.message);
        alert("Credencials error");
      }
    })

    console.log(this.formRegister)

  }

  comeBack(){
    this._router.navigate([''])
  }
}

