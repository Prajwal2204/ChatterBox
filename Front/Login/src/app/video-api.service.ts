import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VideoApiService {

  private server:string = environment.HOST_LINK_ADDRESS
  readonly allVideosURL:string = this.server + '/story/all';
  readonly videoUploadURL:string = this.server + '/story/upload';
  constructor(private CookieService:CookieService, private http:HttpClient) { }


  getAllVideos(auth:string):Observable<any>{
    const headers = { 'auth-token': auth };
    return this.http.get(this.allVideosURL, {headers, responseType:'text', observe:'response'})
  }

  uploadVideo(file, auth:string):Observable<any> {
    const formData = new FormData();
    formData.append("VideoIdTag", file, file.name);
    const headers = { 'auth-token': auth,};
    return this.http.post(this.videoUploadURL, formData, {headers, responseType:'text', observe:'response'})
  }
}
