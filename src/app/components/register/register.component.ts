import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  type: string = "password";
  isText: boolean = false;
  eyeIcon:string = "fa-eye-slash";

  userName: string="";
  userMail: string="";
  userPassword: string="";

  constructor(private http: HttpClient,private service: LoginService, private appComponent: AppComponent){}
  ngOnInit():void{
    
  }

  hideShowPass(){
    this.isText = !this.isText;
    this.isText? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.isText ? this.type = "text": this.type = "password";
  }

  save(){
    let bodyData = {
      
      "userMail": this.userMail,
      "userName": this.userName,
      "userPassword": this.userPassword
    };
    this.http.post("http://localhost:8080/api/auth/register",bodyData,{responseType: 'text'}).subscribe((resultData: any)=>
    {
      console.log(resultData);
      alert("Hmd User registered successfully");
      this.appComponent.setUser(this.userName);
      alert("Hmd name registered successfully");

    });
  }

}