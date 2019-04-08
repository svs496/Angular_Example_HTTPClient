import { Component, OnInit, EventEmitter } from '@angular/core';
import { TaskService } from '../shared/task.service';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'app-end-task',
  templateUrl: './end-task.component.html',
  styleUrls: ['./end-task.component.css']
})
export class EndTaskComponent implements OnInit {

  taskId : number
  taskDescription : string
  event: EventEmitter<any> = new EventEmitter();

  constructor(private taskService: TaskService, private bsModalRef: BsModalRef) { }

  ngOnInit() {
    this.taskId = this.taskService.gettempTaskId();
    var task = this.taskService.getTaskById(this.taskId);
    this.taskDescription = task.taskDescription;
  }

  endTask() {
    this.taskService.endTask(this.taskId);
    this.event.emit('modalActionCompleted');
    this.bsModalRef.hide();
  }

  onClose() {
    this.event.emit('OK');
    this.bsModalRef.hide();
  }

}
