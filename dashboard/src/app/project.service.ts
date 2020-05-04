import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private http: HttpClient) {}

  createProject(payload) {
    return this.http.post<any>(`/api/projects/`, payload)
  }

  getProjects(){
    return this.http.get<any>(`/api/projects/`)
  }

  deleteProject(projectName){
    return this.http.delete<any>(`/api/projects/${projectName}`)
  }

  getProject(projectName){
    return this.http.get<any>(`/api/projects/${projectName}`)
  }

  addMember(projectName,payload){
    return this.http.patch<any>(`/api/projects/member/add/${projectName}`,payload)
  }

  removeMember(projectName,payload){
    return this.http.patch<any>(`/api/projects/member/remove/${projectName}`,payload)
  }
}
