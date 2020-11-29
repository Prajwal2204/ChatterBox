import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFileUploaderModule } from "angular-file-uploader";
import { CookieModule } from 'ngx-cookie';
import { FileUploadComponent } from './file-upload/file-upload.component';

@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    FileUploadComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    CookieModule.forRoot(),
    AngularFileUploaderModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
