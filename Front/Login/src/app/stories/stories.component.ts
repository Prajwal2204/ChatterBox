import { Component, OnInit,ViewChild, ElementRef, Renderer2, RendererFactory2, OnDestroy } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { Router } from '@angular/router';
import { ChatApiService } from '../chat-api.service';

@Component({
  selector: 'app-stories',
  templateUrl: './stories.component.html',
  styleUrls: ['./stories.component.css']
})
export class StoriesComponent implements OnInit {

  constructor(private cookieService: CookieService,
              private router: Router,
              private ChatApiService:ChatApiService,
              private renderer:Renderer2) {


              }
  username:string = "";
  id:string = "";
  users:JSON[];
  active_user:string = "";
  active_user_name:string="";
  alert_content:string="";
  alert_sender:string="";

  @ViewChild('chat') chat:ElementRef;
  @ViewChild('scroll') scroll:ElementRef;
  @ViewChild('message') message:ElementRef;
  @ViewChild('alert') alert_box:ElementRef;


  ngOnDestroy(){
    this.ChatApiService.disconnect();

  }


  ngOnInit(): void {

    this.username  = this.cookieService.get("name");
    this.id  = this.cookieService.get("id");
    this.ChatApiService.connectSocket();
    this.ChatApiService.receive().subscribe((data) => {
      this.receiveMessage(data)
    })

    this.ChatApiService.getChatUsers(this.cookieService.get("auth-token"))
    .subscribe(
      {
        next: data => {
          if(data.status == 200){
            if(data.body != "No Users Available"){
              this.users = JSON.parse(data.body)
            }
          }
        },
        error: error => {
          this.router.navigate(['/login'])
        }
      })

  }

  changeUser(new_user){
    this.active_user = new_user._id;
    this.active_user_name = new_user.username;

    while (this.chat.nativeElement.firstChild) {
      this.chat.nativeElement.removeChild(this.chat.nativeElement.firstChild);
    }

    this.ChatApiService.getChatMessages(this.id, this.active_user, this.cookieService.get("auth-token"))
    .subscribe((data)=>{
      if(data.body == "No Messages Available"){
        this.chat.nativeElement.appendChild(this.createMessageNode(1, data.body, "nothing", 1))
        console.log("no messages")
        return
      }
      let messages:any = JSON.parse(data.body)
      let i;
      for(i=(messages.length-1); i>=0 ; i--){
        if(messages[i].from == this.id){
          this.chat.nativeElement.appendChild(this.createMessageNode(1, messages[i].content, "pass", 0))
        }
        else{
          this.chat.nativeElement.appendChild(this.createMessageNode(0, messages[i].content, messages[i].sender, 0))
        }
      }

    })
  }

  sendMessage(){

    var message_content = this.message.nativeElement.value
    if(this.active_user == ""){
      alert("Please Select a User!");
      return;
    }
    if(message_content == "" ){
      alert("Enter some text to send!");
      return;
    }

    this.chat.nativeElement.appendChild(this.createMessageNode(1, message_content, "passthis"));
    this.scroll.nativeElement.scrollTo(0,(this.scroll.nativeElement.scrollHeight));
    var data:JSON = <JSON><unknown>{
      "sender_id" : this.active_user,
      "content" : message_content,
    }

    this.ChatApiService.send(data)
    this.message.nativeElement.value = ""
  }


  receiveMessage(data){
    if(data.from != this.active_user){
      this.alert_content = data.content
      this.alert_sender = data.sender
      this.alert_box.nativeElement.style.display = "block"
      return
    }

    var name = data.sender
    var content = data.content.charAt(0).toUpperCase() + data.content.slice(1)

    this.chat.nativeElement.appendChild(this.createMessageNode(0, content, name));
    this.scroll.nativeElement.scrollTo(0,(this.scroll.nativeElement.scrollHeight));
  }

  createMessageNode(send_flag, message_content, name, no_message=0){

    let new_message_node = this.renderer.createElement('div')
    if(no_message == 1){
      var no_mess:string = `
          <div class="pl-2 pr-2 d-flex justify-content-center mt-2 bd-highlight mb-2">
              <h4 class="d-flex mt-5 p-2 bd-highlight">Say Hello! to start a conversation</h4>
          </div>`
      new_message_node.setAttribute('class', "row m-0 d-flex flex-column align-items-center");
      new_message_node.innerHTML = no_mess
      return new_message_node
    }

    if(send_flag){
      var s_class:string = "row m-0 d-flex flex-column align-items-end"
      var sender:string = `
          <div class="pl-3 pr-3 d-flex flex-column bd-highlight mb-3" style="min-height: auto;border-radius: 30px;background-color: rgb(161, 161, 161);">
              <b class="d-flex flex-row-reverse p-2 bd-highlight">You</b>
              <p class="centered bd-highlight" style="font-size:1.2rem;">${message_content}</p>
          </div>`
      new_message_node.setAttribute('class', s_class);
      new_message_node.innerHTML = sender
    }
    else{
      var receiver:string = `
          <div class="pl-3 pr-3 d-flex flex-column bd-highlight mb-3" style="min-height: auto;border-radius: 30px;background-color: rgb(255, 255, 255);">
            <b class="d-inline-flex p-2 bd-highlight">${name}</b>
            <p class="centered bd-highlight" style="font-size:1.2rem;">${message_content}</p>
          </div>`
      var r_class:string = "row m-0 d-flex flex-column align-items-start";
      new_message_node.setAttribute('class', r_class);
      new_message_node.innerHTML = receiver
    }

    return new_message_node

  }

  Logout(): void{
    this.cookieService.put("name", "");
    this.username = "";
    this.cookieService.put("auth-token", "");
    //this.ChatApiService.disconnect();
    this.router.navigate(['/login'])
  }

}
