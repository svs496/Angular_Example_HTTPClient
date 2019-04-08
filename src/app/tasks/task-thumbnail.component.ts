import { Component, OnInit, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { ITask } from '../model/task.model';

import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { TaskService } from '../shared/task.service';
import { DeleteTaskComponent } from './delete-task.component';
import { EditTaskComponent } from './edit-task.component';
import { EndTaskComponent } from './end-task.component';

@Component({
  selector: 'task-thumbnail',
  templateUrl: './task-thumbnail.component.html',
  styleUrls: ['./task-thumbnail.component.css']
})
export class TaskThumbnailComponent implements OnInit {

  @Input() task: ITask;
 
  parentTaskName :string

  @Output() modalActionCompleted: EventEmitter<any> = new EventEmitter;
  
  
  bsModalRef: BsModalRef
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };
  

  constructor(private bsModalService: BsModalService, private taskService :TaskService) { }

  ngOnInit() {
      
    this.parentTaskName = this.taskService.getParentTaskName(this.task.parentId);

  }

  editTask(taskId: number) {
    
    this.taskService.settempTaskId (taskId);
    this.bsModalRef = this.bsModalService.show(EditTaskComponent,  this.config);
    this.taskService.settempTaskId (-999);
    this.bsModalRef.content.event.subscribe(result => {
      if (result == 'modalActionCompleted') {
        //do something
        this.modalActionCompleted.emit();
      }
    });
  }

  deleteTask(taskId: number) {
    this.taskService.settempTaskId (taskId);
    this.bsModalRef = this.bsModalService.show(DeleteTaskComponent, this.config);
    this.taskService.settempTaskId (-999);
    this.bsModalRef.content.event.subscribe(result => {
      if (result == 'modalActionCompleted') {
        //do something
        this.modalActionCompleted.emit();
      }
    });
  }

  endTask(taskId: number) {
    this.taskService.settempTaskId (taskId);
    this.bsModalRef = this.bsModalService.show(EndTaskComponent, this.config);
    this.taskService.settempTaskId (-999);
    this.bsModalRef.content.event.subscribe(result => {
      if (result == 'modalActionCompleted') {
        //do something
        this.modalActionCompleted.emit();
      }
    });
  }

}
