import { Component, OnInit,ViewChild, ElementRef, Renderer2, RendererFactory2, OnDestroy } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { Router } from '@angular/router';
import { VideoApiService } from '../video-api.service';

@Component({
  selector: 'app-stories',
  templateUrl: './stories.component.html',
  styleUrls: ['./stories.component.css']
})
export class StoriesComponent implements OnInit {

  constructor(private cookieService: CookieService,
              private router: Router,
              private VideoApiService:VideoApiService,
              private renderer:Renderer2) {


              }
  username:string = "";
  id:string = "";
  users:JSON[];
  active_user:string = "";
  active_user_name:string="";
  alert_content:string="";
  alert_sender:string="";
  fileToUpload: File = null;

  @ViewChild('chat') chat:ElementRef;
  @ViewChild('scroll') scroll:ElementRef;
  @ViewChild('message') message:ElementRef;
  @ViewChild('alert') alert_box:ElementRef;


  ngOnInit(): void {
    this.username  = this.cookieService.get("name");
    this.id  = this.cookieService.get("id");

  }

  handleFileInput(element:any){
    console.log(element)
    this.fileToUpload = element.item(0);
    const auth  = this.cookieService.get("auth");
    this.VideoApiService.postFile(this.fileToUpload, auth).subscribe(
      {
        next: data => {
          console.log(data)
        },
        error: error => {
          console.log(error)
        }
      })
  }


  Logout(): void{
    this.cookieService.put("name", "");
    this.username = "";
    this.cookieService.put("auth-token", "");
    this.router.navigate(['/login'])
  }

}
