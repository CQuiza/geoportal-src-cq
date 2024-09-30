import { inject, Injectable } from '@angular/core';
import { Users } from '../interfaces/users';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ResponseAuth } from '../interfaces/responseAuth';
import { Login } from '../interfaces/login';
import { BASE_URL } from '../settings/app.settings';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { LogoutUser } from '../interfaces/logout';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient)
  private baseUrl:string = BASE_URL.apiUrl;
  private router = inject(Router);
  private _validToken: string = ''
  private _isLoggedIn$ = new BehaviorSubject<boolean>(false);

  public isLoggedIn$: Observable<boolean> = this._isLoggedIn$.asObservable();

  constructor() {
    if (this.isBrowser()) {
      const token = localStorage.getItem('token');
      this._validToken = token || ''
      this._isLoggedIn$.next(!!token);
    }
  }

  register(objeto:Users): Observable<ResponseAuth>{
    return this.http.post<ResponseAuth>(`${this.baseUrl}register/`, objeto);
  }

  login(objeto:Login): Observable<ResponseAuth>{
    return this.http.post<ResponseAuth>(`${this.baseUrl}login/`, objeto);
  }

  logout(): Observable<LogoutUser> {
    return this.http.post<LogoutUser>(`${this.baseUrl}logout/`, {})
  }

  public tokenExist (){
    var tokenExist: string = ''
    if(this.isBrowser()){
    tokenExist = localStorage.getItem('token') || ''}
    return tokenExist
  }

  public logged(token:string){
    localStorage.setItem('token', token);
    this._isLoggedIn$.next(true);
    this._validToken = token
    this.router.navigate(['user/login']);
  }

  public finalizeLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this._isLoggedIn$.next(false);
    this._validToken = ''
    this.router.navigate(['user/login']);
    console.log('finalized')
  }

  public isValidToken(): Observable<ResponseAuth> {
    return this.http.post<ResponseAuth>(`${this.baseUrl}validator_token/`, {});
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }
}
