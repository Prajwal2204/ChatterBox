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


  getAllVideos(auth:string){
    const headers = { 'auth-token': auth };
    return this.http.get(this.allVideosURL, {headers, responseType:'text', observe:'response'})
  }

  postFile(fileToUpload: File, auth:string): Observable<any> {
    const endpoint = this.videoUploadURL;
    const headers = { 'auth-token': auth, 'Content-Disposition': 'form-data'};
    const formData: FormData = new FormData();
    formData.append('fileKey', fileToUpload, fileToUpload.name);
    return this.http.post(endpoint, formData, {headers})
    
}
}
