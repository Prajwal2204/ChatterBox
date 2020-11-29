import { Component, OnInit } from '@angular/core';
import { FileUploadService } from '../file-upload.service';
import { VideoApiService } from '../video-api.service';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {

    file_name:string="Choose File";
    shortLink: string = "";
    loading: boolean = false; // Flag variable
    file: File = null; // Variable to store file
    upload_status:string="";
    step:string="";
    // Inject service
    constructor(private fileUploadService: FileUploadService, private VideoApiService:VideoApiService,
                private CookieService:CookieService) { }

    ngOnInit(): void {
    }

    // On file Select
    onChange(event) {
        this.file = event.target.files[0];
        this.file_name = event.target.files[0].name;
    }

    // OnClick of button Upload
    onUpload() {

        if(this.file == null){
            return
        }
    
        this.loading = !this.loading;
        this.VideoApiService.uploadVideo(this.file, this.CookieService.get("auth-token"))
        .subscribe(
            {
            next:data =>{
                if(data.status == 200){
                    this.upload_status = "Upload Complete!"
                    setTimeout("", 4000);
                    this.loading = false;
                    this.step = "step1"
                }
            },
            error:data =>{
                if (data.status == 401){
                    this.upload_status = "Story Already present, Please Delete to add new!"
                    this.step = "step2"
                }
                else{
                    this.upload_status = "There was a Fatal Error"
                    this.step = "step3"
                }
                this.loading = false;
            }
            })
    }




}
