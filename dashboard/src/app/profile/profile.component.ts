import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../profile.service'
import { MessagesService } from '../messages.service';
import { ProjectService } from '../project.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private profileService : ProfileService, private messagesService: MessagesService, private projectService : ProjectService) { }

  profile = null
  projects = null

  ngOnInit(): void {
    this.getProfile()
    this.getProjects()
  }

  getProfile() {
    this.profileService.getProfile().subscribe(
      profile => this.profile = profile,
      err => {
        console.log(err)
        this.messagesService.add("Unable to retrieve profile","ALERT");
      }
    )
  }

  getProjects(){
    this.projectService.getProjects().subscribe(
      projects => {
        this.projects = projects
        console.log(projects)
      },
      err => {
        console.log(err)
        this.messagesService.add("Unable to retrieve projects","ALERT");
      }
    )
  }

}
