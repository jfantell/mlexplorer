import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'
import { MessagesService } from './messages.service';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient,
    private router: Router,
    private messageService: MessagesService) { }

    registerUser(user,token) {
      var url = `/api/users/register`;
      if(token){
        url += `?token=${token}`
      }
      return this.http.post(url, user, {responseType: 'text'} )
    }

    loginUser(user) {
      return this.http.post<any>("/api/users/login", user)
    }

    logoutUser() {
      this.messageService.clear()
      localStorage.removeItem('token')
      this.router.navigate(['/login'])
    }

    getToken() {
      return localStorage.getItem('token')
    }

    loggedIn() {
      return !!localStorage.getItem('token')    
    }
}
