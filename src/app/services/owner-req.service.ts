import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BASE_URL } from '../settings/app.settings';
import { OwnersPost, OwnersGet } from '../interfaces/owners';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OwnerReqService {

  private http = inject(HttpClient);
  private baseUrl: string = BASE_URL.apiUrl;

  public owner: OwnersGet = {
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

  public getOwner(): Observable<OwnersGet[]> {
    return this.http.get<OwnersGet[]>(`${this.baseUrl}owners/owners/`);
  }

  public postOwner(data: OwnersPost): Observable<OwnersPost> {
    return this.http.post<OwnersPost>(`${this.baseUrl}owners/owners/`, data);
  }
}
