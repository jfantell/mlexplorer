import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service'
import { Router } from '@angular/router'
import { MessagesService } from '../messages.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginUserData = {
    "email": "",
    "password": ""
  }

  constructor(private auth: AuthService, private router: Router, private messageService: MessagesService) { }

  ngOnInit(): void {
  }

  loginUser () {
    this.auth.loginUser(this.loginUserData)
    .subscribe(
      res => {
        localStorage.setItem('token', res.token)
        this.router.navigate(['/dashboard'])
      },
      err => {
        this.messageService.add(err['error'],"ALERT")
        console.log(err)
      }
    ) 
  }

}
