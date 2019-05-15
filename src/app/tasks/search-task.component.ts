import { Component, OnInit, Input, Output, EventEmitter, OnChanges, DoCheck } from '@angular/core';
import { ITask } from '../model/task.model';
import { TaskService } from '../shared/task.service';



@Component({
  selector: 'app-search-task',
  templateUrl: './search-task.component.html',
  styleUrls: ['./search-task.component.css']
})
export class SearchTaskComponent implements OnInit, OnChanges, DoCheck {


  // @ViewChild('filterTaskForm') filterTaskForm: NgForm;

  private _taskName: string
  private _parentTask: number
  private _startDate: Date
  private _endDate: Date
  private _priorityTo: number
  private _priorityFrom: number

  minDate: Date

  private tasks: ITask[]

  @Input() inputTasks: ITask[];

  @Output() populateTasks: EventEmitter<any> = new EventEmitter;

  addMode: boolean;
  filteredTasks: ITask[];
  parentTasks: ITask[];
  /// Active filter rules
  filters = {}

  


  constructor(private taskService: TaskService) { }


  ngDoCheck(): void {
    // this.filteredTasks = [];
    // this.filteredTasks = this.inputTasks;
    // this.applyFilters();
  }


  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    this.filteredTasks = [];
    this.filteredTasks = this.inputTasks;
    this.applyFilters();
  }

  ngOnInit() {
    this.populateParentTaskDropdown();
    this.filterParentTask = -1;
   
  }

  private populateParentTaskDropdown() {
    this.getParentTasks();
  }

  getParentTasks() {
    this.taskService.getParentTasks()
      .subscribe(response => {
        this.parentTasks = [];
        this.parentTasks = response;
      }, (err) => { console.log('error Message from component' + err); });
  }


  get filtertaskName(): string {
    return this._taskName;
  }
  set filtertaskName(value: string) {
    this._taskName = value;
    this.filters["taskName"] = value;
    this.applyFilters();
  }

  get filterParentTask(): number {
    return this._parentTask;
  }

  set filterParentTask(value: number) {
    this._parentTask = value;
    this.filters["parentTask"] = value;
    this.applyFilters();
  }

  get filterStartDate(): Date {
    return this._startDate;
  }

  set filterStartDate(value: Date) {
    this._startDate = value;
    this.filters["startDate"] = value;
    this.applyFilters();
  }

  get filterEndDate(): Date {
    return this._endDate;
  }

  set filterEndDate(value: Date) {

    this._endDate = value;
    this.filters["endDate"] = value;
    this.applyFilters();
  }
  get filterPriorityTo(): number {
    return this._priorityTo;
  }

  set filterPriorityTo(value: number) {
    this._priorityTo = value;
    this.filters["priorityTo"] = value;
    this.applyFilters();
  }

  get filterPriorityFrom(): number {
    return this._priorityFrom;
  }

  set filterPriorityFrom(value: number) {
    this._priorityFrom = value;
    this.filters["priorityFrom"] = value;
    this.applyFilters();
  }

  applyFilters(): any {

    if (Object.keys(this.filters).length != 0) {
      this.filterTaskslogic();
    }

    this.populateTasks.emit(this.filteredTasks);
  }

  setMinDate(fStartDate) {
    this.minDate = new Date(fStartDate.value);
  }

  private filterTaskslogic() {

    var taskNameFilter: string,
      parentTaskFilter: number = -1,
      priorityFromFilter: number = 0,
      priorityToFilter: number = 30,
      startDateFilter: Date,
      endDateFilter: Date;

    for (const key of Object.keys(this.filters)) {
      if (key === "taskName") {
        //this.filteredTasks = this.inputTasks.filter(task => task.taskName.toLowerCase().indexOf(this.filters[key].toLowerCase()) !== -1);
        taskNameFilter = this.filters[key].toLowerCase();
      }
      if (key === "parentTask") {
        parentTaskFilter = +this.filters[key];
      }
      if (key === "priorityFrom") {
        priorityFromFilter = +this.filters[key];
      }
      if (key === "priorityTo") {
        priorityToFilter = +this.filters[key];

      }
      if (key === "startDate") {
        startDateFilter = new Date(this.filters[key]);
      }
      if (key === "endDate") {
        endDateFilter = new Date(this.filters[key]);
      }
    }

    //console.log(startDateFilter.getUTCDate());
    if (typeof startDateFilter != 'undefined') {
      startDateFilter = new Date(startDateFilter.setHours(0, 0, 0));
    }

  
    if (typeof endDateFilter != 'undefined') {
      endDateFilter = new Date(endDateFilter.setHours(0, 0, 0));
    }

 

    this.filteredTasks = [];

    this.filteredTasks = this.inputTasks.filter(task =>
      (typeof taskNameFilter != 'undefined' ?
        task.taskName.toLowerCase().indexOf(taskNameFilter) !== -1 : true)
      && (
        parentTaskFilter > 0 ? task.parentTaskId === parentTaskFilter : true
      )
      && (
        priorityFromFilter == 0 || priorityToFilter == 0 ? true :
          task.priority >= priorityFromFilter && task.priority <= priorityToFilter
      )
      && (typeof startDateFilter != 'undefined' && task.startDate != null
        ? task.startDate == this.compareDate(task.startDate, startDateFilter) : true
        )
      && (typeof endDateFilter != 'undefined' && task.endDate != null ?
        task.endDate == this.compareDate(task.endDate, endDateFilter) : true)
    );
  }

  compareDate(tempDate: Date, dateFilter: Date): Date {

    var dt = new Date (tempDate);

    if (Date.parse(dt.toDateString()) == Date.parse(dateFilter.toDateString()))
      return tempDate;

      return new Date (dateFilter);
  }

  resetEndDate (){
  
    this.filterEndDate = null;

  }


}
