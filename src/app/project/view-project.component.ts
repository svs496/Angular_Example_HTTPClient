import { Component, OnInit, Input, Output, EventEmitter, Inject, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { IProject } from '../model/project.model';
import { ProjectService } from '../shared/project.service';
import { TOASTR_TOKEN, Toastr } from '../common/toastr.service';

@Component({
  selector: 'app-view-project',
  templateUrl: './view-project.component.html',
  styleUrls: ['./view-project.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewProjectComponent implements OnInit, OnChanges {


  @Input() projects: IProject[];
  sortBy: string = 'startDate';
  visibleProjects: IProject[] = [];
  @Output() editMessageEvent = new EventEmitter<number>();
  _customFilter: string;
  completedTasks: number = 0;
  suspend: boolean = false;


  constructor(@Inject(TOASTR_TOKEN) private toastr: Toastr) { }

  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    this.SortAndFilterProjects();
  }

  get filterProject(): string {
    return this._customFilter;
  }
  set filterProject(value: string) {
    this._customFilter = value;
    this.SortAndFilterProjects();
  }

  private SortAndFilterProjects() {
    if (this.projects) {
      this.visibleProjects = [];


      if (this._customFilter && this._customFilter.length > 0) {
        this.visibleProjects = this.projects.filter(usr =>
          (usr.projectName.toLowerCase().indexOf(this._customFilter) !== -1)
          || (usr.priority.toString().indexOf(this._customFilter) !== -1)
        );
      }
      else
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

  suspendProject() {
    this.suspend = true;
  }

  setSortValue(sortString: string) {
    this.sortBy = sortString;
    this.SortAndFilterProjects();
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
