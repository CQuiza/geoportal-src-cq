import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BASE_URL } from '../settings/app.settings';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PartyReqService {

  private http = inject(HttpClient);
  private baseUrl : string = BASE_URL.apiUrl;
  public party! : any;

  constructor() { }

  public getParty(): Observable<any> {
    var data = this.http.get(`${this.baseUrl}party/party/`);
    this.party = data
    return data
  }

  public postParty(dataPost:any): Observable<any>{
    return this.http.post(`${this.baseUrl}party/party/`, dataPost)
  }

  public getPartyCode(code:number): Observable<any>{
    return this.http.get(`${this.baseUrl}party/party/${code}/`);
  }

  public putParty(code: number, form:any): Observable<any>{
    return this.http.put(`${this.baseUrl}party/party/${code}/`, form)
  }

  public deleteParty(code:number): Observable<any>{
    return this.http.delete(`${this.baseUrl}party/party/${code}/`);
  }

}
