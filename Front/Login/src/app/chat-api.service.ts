import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as io from "socket.io-client";
import { CookieService } from 'ngx-cookie';
import { Observable } from 'rxjs';
import {notify} from 'notifyjs';

@Injectable({
  providedIn: 'root'
})
export class ChatApiService{

  private socket:any; 

  readonly chatusersURL:string = 'http://localhost:8080/chat/users';
  readonly getallchatURL:string = "http://localhost:8080/chat/conversation";
  
  constructor(private http: HttpClient, private CookieService:CookieService) { 
    let id = this.CookieService.get("id");
      this.socket = io('ws://localhost:3000', {
        query:`_id=${id}&username=${this.CookieService.get("name")}`,
      });
  }

  getChatUsers(auth:string){
    const headers = { 'auth-token': auth };
    return this.http.get(this.chatusersURL, {headers, responseType:'text', observe:'response'})
  }

  getChatMessages(from:string, to:string, auth:string){
    const headers = { 'auth-token': auth, 'Content-Type': 'application/json' };
    return this.http.post(this.getallchatURL, {from, to}, {headers, responseType:'text', observe:'response'})
  }

  send(data:JSON){

    this.socket.emit("receive_message", data)
  }

  receive(){
    let observable = new Observable<{sender:string, from:string, to:string, content:string}>((observer) => {
      this.socket.on("sent_message", (data) => {
        observer.next(data)
      })
      return () =>{
        this.socket.disconnect();
        alert("Please Re-Connect!");
      }
    })

    return observable;
  }

  disconnect(){
    if(this.socket){
      this.socket.disconnect();
      console.log("disconnected!")
    }
    
  }
}