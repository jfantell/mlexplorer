import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  message: string = "";
  status: string = ""

  bootstrap_alerts = {
    "INFO":"alert-primary",
    "SUCCESS":"alert-success",
    "ALERT":"alert-danger"
  }

	add(message: string, status: string) {
      this.message = message;
      this.status = status;
  }

  clear() {
    this.message = "";
  }

  constructor() { }
}
