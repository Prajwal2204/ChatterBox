import { Component, OnInit,ViewChild, ElementRef, Renderer2, RendererFactory2, OnDestroy } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { Router } from '@angular/router';
import { VideoApiService } from '../video-api.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-stories',
  templateUrl: './stories.component.html',
  styleUrls: ['./stories.component.css']
})
export class StoriesComponent implements OnInit {

  constructor(private cookieService: CookieService,
              private router: Router,
              private VideoApiService:VideoApiService) {


              }
  username:string = "";
  id:string = "";
  videos:JSON[];
  step:string="";
  fileToUpload: File = null;
  novideos:string = "No Stories Available"
  server:string = environment.HOST_LINK_ADDRESS;

  @ViewChild('chat') chat:ElementRef;
  @ViewChild('scroll') scroll:ElementRef;
  @ViewChild('message') message:ElementRef;
  @ViewChild('alert') alert_box:ElementRef;


  ngOnInit(): void {
    this.username  = this.cookieService.get("name");
    this.id  = this.cookieService.get("id");
    this.VideoApiService.getAllVideos(this.cookieService.get("auth-token"))
    .subscribe({
      next:data=>{
        if(data.body != ""){
          this.novideos = ""
          let temp = JSON.parse(data.body)
          console.log(temp)
          let i=0;
          for(i=0;i<temp.length;i++){
            temp[i].video_link = this.server + "/static/" + temp[i].video_link
          }
          console.log(temp)
          this.videos = temp; 
        }
      },
      error:error=>{
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
