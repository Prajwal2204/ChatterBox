import { Component } from '@angular/core';
import {AuthService} from '../auth.service';
import { CookieService } from 'ngx-cookie';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  constructor(private AuthService:AuthService, private cookieService: CookieService, private router: Router) { }
  error_message:string = "";
  isOn:boolean = true;

  onSubmit(data){
    this.AuthService.register(data)
    .subscribe(
      {
        next: data => {
          if(data.status == 200){
            let temp = JSON.parse(data.body)
            this.cookieService.put("auth-token", data.headers.get('auth-token'))
            this.cookieService.put("name", temp.name)
            this.cookieService.put("id", temp.id);
            this.router.navigate(['/home']);
          }
        },
        error: error => {
          this.isOn = false;
          this.error_message = error.error;
        }
      })
  }

}
