import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private server:string = environment.HOST_LINK_ADDRESS
  readonly loginURL:string = this.server + '/auth/login';
  readonly registerURL:string = this.server + '/auth/register';
  readonly logoutURL:string = this.server + '/auth/logout';
  constructor(private http: HttpClient) { }

  login(data:string){

    const headers = { 'Content-Type': 'application/json'};
    return this.http.post(this.loginURL, data, {headers, responseType:'text', observe:'response'})
  }

  register(data:string){
    const headers = { 'Content-Type': 'application/json'};
    return this.http.post(this.registerURL, data, {headers, responseType:'text', observe:'response'})
  }


}
