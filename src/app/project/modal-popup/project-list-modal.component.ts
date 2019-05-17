import { Component, OnInit, EventEmitter } from '@angular/core';
import { IProject } from 'src/app/model/project.model';
import { BsModalRef } from 'ngx-bootstrap';
import { ProjectService } from 'src/app/shared/project.service';

@Component({
  selector: 'app-project-list-modal',
  templateUrl: './project-list-modal.component.html',
  styleUrls: ['./project-list-modal.component.css']
})
export class ProjectListModalComponent implements OnInit {

  projectList : IProject[] = [];
  originalProjectList : IProject[] = [];
  _customFilter: string;

  event: EventEmitter<any> = new EventEmitter();
  
  constructor(private bsModalRef: BsModalRef, private projectService: ProjectService) { }

  ngOnInit() {
    this.projectService.getProjects()
      .subscribe(response => {
        this.originalProjectList = response;
        this.projectList = response;
      }, (err) => { console.log('error Message from component' + err); });
  }

  
  onClose() {
    this.bsModalRef.hide();
  }

  selectProject(projectId: number, projectName: string) {
    var project =
    {
      'projectId': projectId,
      'projectName': projectName
    };
    this.event.emit(project);
    this.bsModalRef.hide();
  }

  get filterProject(): string {
    return this._customFilter;
  }
  set filterProject(value: string) {
    this._customFilter = value;
    this.applyFilters();
  }

  applyFilters() {
    this.projectList = [];
    this.projectList = this.originalProjectList.filter( k =>
      (k.projectName.toLowerCase().indexOf(this._customFilter) !== -1)
      || (k.user.firstName.toLowerCase().indexOf(this._customFilter) !== -1)
      || (k.user.lastName.toLowerCase().indexOf(this._customFilter) !== -1)
    );
  }

}
