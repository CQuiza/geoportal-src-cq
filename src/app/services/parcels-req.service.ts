import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BASE_URL } from '../settings/app.settings';
import { Observable } from 'rxjs';
import { Parcel } from '../interfaces/parcel';

@Injectable({
  providedIn: 'root'
})
export class ParcelsReqService {

  private http = inject(HttpClient);
  private baseUrl: string = BASE_URL.apiUrl;

  constructor() { }

  public getParcels(): Observable<Parcel[]> {
    return this.http.get<Parcel[]>(`${this.baseUrl}owners/parcel/`);
  }

  public postParcel(dataPost:Parcel):Observable<Parcel>{
    return this.http.post<Parcel>(`${this.baseUrl}owners/parcel/`, dataPost)
  }

  public getParcelCode(code:number):Observable<Parcel>{
    return this.http.get<Parcel>(`${this.baseUrl}owners/parcel/${code}/`);
  }

  public putParcel(code: number, form:Parcel):Observable<Parcel>{
    return this.http.put<Parcel>(`${this.baseUrl}owners/parcel/${code}/`, form)
  }


}
