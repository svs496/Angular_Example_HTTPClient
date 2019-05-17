import { Component, OnInit, EventEmitter } from '@angular/core';
import { ITask } from 'src/app/model/task.model';
import { TaskService } from 'src/app/shared/task.service';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'app-parent-task-modal',
  templateUrl: './parent-task-modal.component.html',
  styleUrls: ['./parent-task-modal.component.css']
})
export class ParentTaskModalComponent implements OnInit {

  originalParentTasks: ITask[] = [];
  parentTaskList: ITask[] = [];
  _customFilter: string;

  event: EventEmitter<any> = new EventEmitter();

  get filterParentTask(): string {
    return this._customFilter;
  }
  set filterParentTask(value: string) {
    this._customFilter = value;
    this.applyFilters();
  }

  constructor(private taskService: TaskService, private bsModalRef: BsModalRef) { }

  ngOnInit() {
    this.getParentTasks();
  }

  getParentTasks() {
    this.taskService.getParentTasks()
      .subscribe(response => {
        this.originalParentTasks = [];
        this.originalParentTasks = response;
        this.parentTaskList = response;
      }, (err) => { console.log('error Message from component' + err); });
  }

  applyFilters() {
    this.parentTaskList = [];
    this.parentTaskList = this.originalParentTasks.filter(p =>
        (p.taskName.toLowerCase().indexOf(this._customFilter) !== -1)
      );
  }

  onClose() {
    this.bsModalRef.hide();
  }

  selectParentTask(taskId: number, taskName: number) {
    var parentTask =
    {
      'taskName': taskName,
      'taskId': taskId
    };
    this.event.emit(parentTask);
    this.bsModalRef.hide();

  }


}
