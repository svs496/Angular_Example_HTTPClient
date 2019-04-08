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

  private _taskDescription: string
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
  parentTasks: [];
  /// Active filter rules
  filters = {}

  
  
  constructor(private taskService: TaskService) { }


  ngDoCheck(): void {
    this.filteredTasks = this.inputTasks;
    this.applyFilters();
  }


  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {

    this.filteredTasks = this.inputTasks;
    this.applyFilters();
  }

  ngOnInit() {
    this.populateParentTaskDropdown();

  }

  private populateParentTaskDropdown() {
    this.taskService.getParentTasks()
      .subscribe(response => {
        this.parentTasks = response;
      }, (err) => { console.log('error Message from component' + err); });
  }


  get filterTaskDescription(): string {
    return this._taskDescription;
  }
  set filterTaskDescription(value: string) {
    this._taskDescription = value;
    this.filters["taskDescription"] = value;
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
    console.log(fStartDate.value);
    this.minDate = new Date(fStartDate.value);
  }

  private filterTaskslogic() {


    var taskDescriptionFilter: string,
      parentTaskFilter: number = -1,
      priorityFromFilter : number =  0, 
      priorityToFilter : number = 30, startDateFilter, endDateFilter;

    for (const key of Object.keys(this.filters)) {
      if (key === "taskDescription") {
        //this.filteredTasks = this.inputTasks.filter(task => task.taskDescription.toLowerCase().indexOf(this.filters[key].toLowerCase()) !== -1);
        taskDescriptionFilter = this.filters[key].toLowerCase();
      }
      if (key === "parentTask") {
        parentTaskFilter = +this.filters[key];
      }
      if (key === "priorityFrom") {
        priorityFromFilter = +this.filters[key];
      }
      if (key === "priorityTo") {
        priorityToFilter = +this.filters[key]  ;

      }
      if (key === "startDate") {
        startDateFilter = new Date(this.filters[key]);
      }
      if (key === "endDate") {
        endDateFilter = new Date(this.filters[key]);
      }
    }

    this.filteredTasks = this.inputTasks.filter(task => 
      ( typeof taskDescriptionFilter != 'undefined' ?
        task.taskDescription.toLowerCase().indexOf(taskDescriptionFilter) !== -1 : true)
      && (parentTaskFilter > 0 ?  task.parentId ==  parentTaskFilter :true)
      && (
        priorityFromFilter == 0 ||  priorityToFilter == 0 ? true :
        task.priority >= priorityFromFilter &&  task.priority <= priorityToFilter
        )
      && ( typeof startDateFilter != 'undefined' && task.startDate != null
      ? Date.parse(task.startDate.toDateString()) == Date.parse(startDateFilter.toDateString()) : true)
      &&  (typeof endDateFilter != 'undefined'  && task.endDate != null ? 
      Date.parse(task.endDate.toDateString()) ==  Date.parse(endDateFilter.toDateString()) : true)
      );



  }
}
