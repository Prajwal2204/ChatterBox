import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { Router } from '@angular/router';
import { ChatApiService } from '../chat-api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private cookieService: CookieService, private router: Router, private ChatApiService:ChatApiService) { }
  username:string = "";

  Logout(): void{
    this.cookieService.put("name", "");
    this.username = "";
    this.cookieService.put("auth-token", "");
    //this.ChatApiService.disconnect();
    this.router.navigate(['/login'])
  }

  ngOnInit(): void {
    let name = this.cookieService.get("name");
    if(name != ""){
      this.username = this.cookieService.get("name")
    }
    
  }

}
