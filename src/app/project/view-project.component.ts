import { Component, OnInit, Input, Output, EventEmitter, Inject, OnChanges } from '@angular/core';
import { IProject } from '../model/project.model';
import { ProjectService } from '../shared/project.service';
import { TOASTR_TOKEN, Toastr } from '../common/toastr.service';

@Component({
  selector: 'app-view-project',
  templateUrl: './view-project.component.html',
  styleUrls: ['./view-project.component.css']
})
export class ViewProjectComponent implements OnInit, OnChanges {


  @Input() projects: IProject[];
  @Input() sortBy: string;
  visibleProjects: IProject[] = [];
  @Output() editMessageEvent = new EventEmitter<number>();
 

  constructor(@Inject(TOASTR_TOKEN) private toastr: Toastr, private projectService: ProjectService) { }

  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    if (this.projects) {
      this.visibleProjects = this.projects;
      if (this.sortBy === 'startDate') {
        this.visibleProjects.sort(sortByStartDate);
      }
      else if (this.sortBy === 'endDate') {
        this.visibleProjects.sort(sortByEndDate);
      }

      else if (this.sortBy === 'priority') {
        this.visibleProjects.sort(sortByPriority);
      }
      //to do
      else if (this.sortBy === 'status') {
        this.visibleProjects.sort(sortByPriority);
      }
    }
  }

  editProject(id: number) {
    this.editMessageEvent.emit(id);
  }
  ngOnInit() {
  }

}

function sortByStartDate(u1: IProject, u2: IProject) {
  if (u1.startDate > u2.startDate) return 1
  else if (u1.startDate === u2.startDate) return 0
  else return -1
}

function sortByEndDate(u1: IProject, u2: IProject) {
  if (u1.endDate > u2.endDate) return 1
  else if (u1.endDate === u2.endDate) return 0
  else return -1
}

function sortByPriority(u1: IProject, u2: IProject) {
  if (u1.priority > u2.priority) return 1
  else if (u1.priority === u2.priority) return 0
  else return -1
}
