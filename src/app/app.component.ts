import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { MapComponent } from './components/pages/map/map.component';
import { AboutComponent } from './components/pages/about/about.component';
import { UserComponent } from './components/pages/user/user.component';
import { ProjectsComponent } from './components/pages/projects/projects.component';
import { UserLoginComponent } from './components/pages/user-login/user-login.component';
import { MatIconModule } from '@angular/material/icon';
import { AsyncPipe, NgIf } from '@angular/common';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { ProfileComponent } from './components/pages/profile/profile.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HomeComponent, MapComponent, AboutComponent, UserComponent, UserLoginComponent, ProjectsComponent, ProfileComponent, RouterLink, MatIconModule, NgIf, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'geoportal-scr-cq';

  public authService = inject(AuthService);
  private _userService = inject(UserService);
  private _router = inject(Router);

  public localUsername?: string;

  ngOnInit(): void {
    if(this.isBrowser()){
    this.localUsername = localStorage.getItem('username') || ''}
  }

  logout() {

    this.authService.logout().subscribe({
      next: (response) => {
        console.log('Logout exitoso:', response);
        this.authService.finalizeLogout()
        this._userService.deactivateUser()
      },
      error: (err) => {
        console.error('Error al cerrar sesión:', err);
        alert('Error al cerrar sesión');
        this.authService.finalizeLogout()
      }
    })
  }

  // HTTP CON FETCH
  // logout() {
  //   const token = localStorage.getItem('token');
  //   fetch ('http://localhost:8000/app1/logout/', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization': `Token ${token}`
  //     }
  //   })
  //   .then((response) => response.json())
  //   .then((json) => console.log(json))
  // }

  loginNav(){
    this._router.navigate(['user/login']);
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }
}

