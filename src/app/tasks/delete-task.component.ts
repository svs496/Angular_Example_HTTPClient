import { Component, OnInit, EventEmitter } from '@angular/core';
import { TaskService } from '../shared/task.service';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-delete-task',
  templateUrl: './delete-task.component.html',
  styleUrls: ['./delete-task.component.css']
})
export class DeleteTaskComponent implements OnInit {

  taskId: number
  taskDescription: string
  event: EventEmitter<any> = new EventEmitter();

  constructor(private taskService: TaskService, private bsModalRef: BsModalRef) { }

  ngOnInit() {
    this.taskId = this.taskService.gettempTaskId();
    var task = this.taskService.getTaskById(this.taskId);
    this.taskDescription = task.taskDescription;
  }

  deleteTask() {
    this.taskService.deleteTask(this.taskId);
    this.event.emit('modalActionCompleted');
    this.bsModalRef.hide();
  }

  onClose() {
    this.bsModalRef.hide();
  }


}
