import { inject, Injectable } from '@angular/core';
import { Users } from '../interfaces/users';
import { ResponseAuth } from '../interfaces/responseAuth';
import { UserActivate } from '../interfaces/user-activate';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../settings/app.settings';
import { Observable } from 'rxjs';
import { OwnerReqService } from './owner-req.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient)
  private baseUrl:string = BASE_URL.apiUrl;

  public localUsername?: string

  public user : UserActivate = {
    userId: '',
    email: '',
    username: '',
    firstName: '',
    lastName: ''
  }

  constructor() { }

  public getUser(){
    console.log(this.user)
    return this.user;
  }

  public setUser(user:any){
    console.log('private', user)
    this.user.username = user.username;
    this.user.email = user.email;
    this.user.userId = user.id;
    this.user.firstName = user.first_name || '';
    this.user.lastName = user.last_name || '';
    console.log('User activado:', this.user)
  }

  public activateUser(data:ResponseAuth): void{
    localStorage.setItem('username', data.user.username)
    this.localUsername = localStorage.getItem('username') || ''
    this.setUser(data)
  }

  public deactivateUser(){
    this.user.username = '';
    this.user.email = '';
    this.user.userId = '';
    this.user.firstName = '';
    this.user.lastName = '';
  }

  public requestProfileUser():Observable<any>{
    return this.http.get<any>(`${this.baseUrl}profile/`, {})
  }

  public updateAttr(data:any):Observable<any>{
    return this.http.post<any>(`${this.baseUrl}profile_update/`, data)
  }


}
