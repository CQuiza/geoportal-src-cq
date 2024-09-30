import { Component, inject, OnInit } from '@angular/core';
import { HomeComponent } from '../home/home.component';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { Login } from '../../../interfaces/login';
import { HttpClient } from '@angular/common/http';
import { UserRegisterComponent } from '../user-register/user-register.component';
import { AsyncPipe, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ResponseAuth } from '../../../interfaces/responseAuth';
import { UserService } from '../../../services/user.service';
import { UserActivate } from '../../../interfaces/user-activate';

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatIconModule, ReactiveFormsModule, RouterLink, HomeComponent, UserRegisterComponent, NgIf, AsyncPipe],
  templateUrl: './user-login.component.html',
  styleUrl: './user-login.component.css'
})
export class UserLoginComponent implements OnInit{

  hide = true;

  authService = inject(AuthService);

  private _authService = inject(AuthService);
  private _router = inject(Router);
  private _formBuild = inject(FormBuilder);
  private _userService = inject(UserService)

  public username?: string;

  public formLogin: FormGroup = this._formBuild.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  })

  constructor() {
    this.username = this._userService.user.username
    console.log(this.username)
   }

  ngOnInit(): void {
    if(this.isBrowser()){
    this.username = localStorage.getItem('username') || ''}
  }

  initSession(){
    if (this.formLogin.invalid) return;
    const userLogin:Login = {
      username: this.formLogin.value.username,
      password: this.formLogin.value.password,
    }

    this._authService.login(userLogin).subscribe({
      next:(data:ResponseAuth) => {
        if(data.isSucces === true){
          let token: string = data.token;
          this._authService.logged(token);
          this._userService.activateUser(data)
          console.log('logged:',{data})
          alert(data.message);
          this.formLogin.reset()
        }else {
          alert("Credenciales son incorrectas");
          console.log('Not logged:',{data})
        }
      },
      error: (error:any) => {
        console.log('not logged:',error.message);
        alert("Credenciales son incorrectas");
      }
    })

  }

  register(){
    this._router.navigate(['user/register']);
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }


}
