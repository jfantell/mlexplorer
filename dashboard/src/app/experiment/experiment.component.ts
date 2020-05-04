import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { ExperimentService }  from '../experiment.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Router } from '@angular/router'
import { MessagesService } from '../messages.service'

@Component({
  selector: 'app-experiment',
  templateUrl: './experiment.component.html',
  styleUrls: ['./experiment.component.css']
})
export class ExperimentComponent implements OnInit {

  public project_name :string;
  public experiment_id : string;
  public experiment = null;

  constructor(
    private router: Router,
  	private route: ActivatedRoute,
  	private experimentService: ExperimentService,
    private location: Location,
    private messageService: MessagesService) {}

  ngOnInit(): void {
    this.project_name = this.route.snapshot.paramMap.get('name');
    this.experiment_id = this.route.snapshot.paramMap.get('id');
    // this.route.params.subscribe(
    //   params => {
    //     const experiment_id = +params['id'];
    //     this.experiment_id = String(experiment_id)
    //     this.getExperiment();
    //   }
    // );
    this.getExperiment(this.project_name,this.experiment_id);
  }

  objectKeys(obj) {
    return Object.keys(obj);
  }

  getExperiment(project_name,experiment_id){
    this.experimentService.getExperiment(project_name,experiment_id).subscribe(
      experiment => {
        this.experiment = experiment;
      },
      err => {
        this.messageService.add(`Unable to fetch experiment details...please try again later`,"ALERT")
      }
    )
  }

	goBack(): void {
  	this.location.back();
  }
  
  deleteExperiment(){
    this.experimentService.deleteExperiment(this.project_name, this.experiment_id).subscribe(
      res => {
        console.log(res)
        this.router.navigate([`/projects/${this.project_name}`], {replaceUrl : true});
      },
      err => {
        this.messageService.add(`Unable to delete ${this.project_name}...please try again later!`,"ALERT")
      }
    )
  }

  go_to(experiment_id){
    this.router.navigate([`experiments/project/${this.project_name}/id/${experiment_id}`], {replaceUrl : true})
  }
}
