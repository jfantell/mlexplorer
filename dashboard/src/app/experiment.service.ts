import { Injectable } from '@angular/core';
import { MessagesService } from './messages.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ExperimentService {

  constructor(private http: HttpClient, private messageService: MessagesService) { }

  getExperiments(model_name: string) {
  	return this.http.get<any>(`/api/experiments/project/${model_name}/`);
	}

  getExperiment(model_name : string, experiment_id: string) {
    return this.http.get<any>(`/api/experiments/project/${model_name}/id/${experiment_id}/`);
  }

  deleteExperiment(model_name : string, experiment_id: string){
    return this.http.delete<any>(`/api/experiments/project/${model_name}/id/${experiment_id}/`);
  }
}
