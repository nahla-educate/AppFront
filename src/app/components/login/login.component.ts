import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  type: string = "password";
  isText: boolean = false;
  eyeIcon: string = "fa-eye-slash";

  userMail: string = "";
  userPassword: string = "";

  constructor(private router: Router, private loginService: LoginService) { }

  ngOnInit(): void { }

  hideShowPass() {
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.isText ? this.type = "text" : this.type = "password";
  }

  login() {
    // Your login logic here, using this.userMail and this.userPassword
    if (this.userMail && this.userPassword) {
      const authenticationRequest = {
        userMail: this.userMail,
        userPassword: this.userPassword
      };

      this.loginService.authenticate(authenticationRequest).subscribe(
        (response) => {
          // Save the token in local storage
          localStorage.setItem('token', response.token);
          // Redirect to the dashboard or desired page
          this.router.navigate(['/dashboard']);
        },
        (error) => {
          console.error('Error during authentication:', error);
          alert('Invalid username or password');
        }
      );
    }
  }
}
