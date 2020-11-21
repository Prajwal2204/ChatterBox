import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  readonly loginURL:string = 'http://localhost:8080/auth/login';
  readonly registerURL:string = 'http://localhost:8080/auth/register';
  readonly logoutURL:string = 'http://localhost:8080/auth/logout';
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
