import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BASE_URL } from '../settings/app.settings';
import { Owners } from '../interfaces/owners';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OwnerReqService {

  private http = inject(HttpClient);
  private baseUrl: string = BASE_URL.apiUrl;

  public owner: Owners = {
    id: 0,
    name: '',
    lastName: '',
    email: '',
    phone: '',
    description: '',
    task: '',
    done: false
  }

  constructor() {}

  public getOwner(): Observable<Owners[]> {
    return this.http.get<Owners[]>(`${this.baseUrl}owners/owners/`);
  }
}
