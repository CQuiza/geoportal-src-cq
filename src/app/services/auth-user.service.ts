import { inject, Injectable } from '@angular/core';
import { AuthUserModel } from '../models/authUser.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthUserService {
  authUserModel : AuthUserModel = new AuthUserModel('', '', '', false, '');
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Token ' + this.authUserModel.token
  });
  public authUserSubject = new Subject<AuthUserModel>();
  // public authMessagesSubject = new Subject<MessageModel>();
  constructor(
  ) { }
}
