import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router, ActivatedRoute } from '@angular/router'
import { MessagesService } from '../messages.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerUserData = {
    "first_name": "",
    "last_name": "",
    "email": "",
    "password": "",
    "confirm_password":""
  }
  
  token = null;
  email_disabled : boolean;

  constructor(private auth: AuthService, private router: Router, private route : ActivatedRoute, private messageService : MessagesService) { }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
    if(this.token){
      this.email_disabled = true;
    }
  }

  clearData(){
    for(var ele in this.registerUserData){
      this.registerUserData[ele] = "";
    }
  }

  registerUser() {
    this.auth.registerUser(this.registerUserData,this.token)
    .subscribe(
      res => {
        this.messageService.add(res["msg"],"SUCCESS")
        this.clearData()
      },
      err => {
        this.messageService.add(err['error']['msg'],"ALERT")
      }
    )      
  }

}
