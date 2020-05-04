import { Component, OnInit, ViewChild } from '@angular/core';
import { ExperimentService } from '../experiment.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Router } from '@angular/router'
import { MessagesService } from '../messages.service';
import { ProjectService } from '../project.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {

  public experiments : [];
  public project_name : string;
  public project = null;
  public admin = false;
  public member_email : string;
  
  constructor(
    private location: Location, 
    private route: ActivatedRoute, 
    private router : Router, 
    private experimentService : ExperimentService,
    private messageService : MessagesService,
    private projectService : ProjectService ) { }

  getExperiments(){
    this.experimentService.getExperiments(this.project_name).subscribe(
      experiments => {
        console.log(experiments)
        this.experiments = experiments
      },
      err => {
        this.messageService.add(`Unable to fetch experiments...please try again later!`,"ALERT")
      }
    )
  }

  getProject(){
    this.projectService.getProject(this.project_name).subscribe(
      project => {
        this.project = project[0];
        this.admin = project[1].isAdmin;
      },
      err => {
        this.messageService.add(`Unable to fetch project info...please try again later!`,"ALERT")
      }
    )
  }

  addMember(){
    this.projectService.addMember(this.project_name,{member_email:this.member_email}).subscribe(
      success => {
        this.messageService.add(`User added to group successfully`,"SUCCESS")
        this.getProject()
      },
      err => {
        this.messageService.add(`Unable to add user to the group...please try again later!`,"ALERT")
      }
    )
  }

  removeMember(){
    this.projectService.removeMember(this.project_name,{member_email:this.member_email}).subscribe(
      success => {
        this.messageService.add(`User removed from group successfully`,"SUCCESS")
        this.getProject()
      },
      err => {
        this.messageService.add(`Unable to remove user from the group...please try again later!`,"ALERT")
      }
    )
  }

  deleteProject(){
    this.projectService.deleteProject(this.project_name).subscribe(
      res => {
        console.log(res)
        this.router.navigate(['/dashboard'], { replaceUrl: true });
      },
      err => {
        this.messageService.add(`Unable to delete ${this.project_name}...please try again later!`,"ALERT")
      }
    )
  }

  ngOnInit(): void {
    this.project_name = this.route.snapshot.paramMap.get('name');
    this.messageService.clear()
    this.getProject()
    this.getExperiments()
  }

  goBack(): void {
  	this.location.back();
  }

}
