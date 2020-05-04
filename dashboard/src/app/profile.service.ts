import { Injectable } from '@angular/core';
import { MessagesService } from './messages.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient) { }

  getProfile(){
    return this.http.get<any>(`/api/users/me/`);
  }
}
