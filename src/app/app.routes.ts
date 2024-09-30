import { Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { MapComponent } from './components/pages/map/map.component';
import { UserComponent } from './components/pages/user/user.component';
import { UserRegisterComponent } from './components/pages/user-register/user-register.component';
import { UserLoginComponent } from './components/pages/user-login/user-login.component';
import { AboutComponent } from './components/pages/about/about.component';
import { ProjectsComponent } from './components/pages/projects/projects.component';
import { projectGuard } from './custom/guards/project.guard';

import { ProfileComponent } from './components/pages/profile/profile.component';

export const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'map', component: MapComponent},
  {path: 'projects', component: ProjectsComponent, canActivate:[projectGuard]},
  {path: 'profile', component: ProfileComponent, canActivate:[projectGuard]},
  {path: 'user', component: UserComponent},
  {path: 'user/login', component: UserLoginComponent},
  {path: 'user/register', component: UserRegisterComponent},
  {path: 'about', component: AboutComponent},
  {path: '**', redirectTo: '', pathMatch: 'full'}
];
