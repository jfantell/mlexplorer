import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../project.service';
import { MessagesService } from '../messages.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  projectData = {
    name : "",
    description: ""
  }

  public projects : [];
  
  constructor(private projectsService : ProjectService, private router: Router, private messageService: MessagesService) { }

  createProject(){

    this.projectsService.createProject(this.projectData).subscribe(
      res => {
        this.messageService.add(`Successfully created a new model: ${res.name}. Please add '${res.name}' to your python script to create a new experiment in this model.`,"SUCCESS")
        this.getProjects()
      },
      err => {
        this.messageService.add(`Unable to create model`,"ALERT")
      }
    ) 
  }

  getProjects(){
    this.projectsService.getProjects().subscribe(
      models => {
        this.projects = models
      },
      err => {
        this.messageService.add(`Unable to fetch models...please try again later!`,"ALERT")
      }
    )
  }

  ngOnInit(): void {
    this.messageService.clear()
    this.getProjects()
  }

}
