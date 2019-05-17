import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { ProjectListModalComponent } from '../project/modal-popup/project-list-modal.component';
import { ITask } from '../model/task.model';
import { TaskService } from '../shared/task.service';
import { EditTaskComponent } from './modal-popup/edit-task.component';
import { EndTaskComponent } from './modal-popup/end-task.component';
import { DeleteTaskComponent } from './modal-popup/delete-task.component';

@Component({
  selector: 'app-view-task',
  templateUrl: './view-task.component.html',
  styleUrls: ['./view-task.component.css']
})
export class ViewTaskComponent implements OnInit {

  projectId: number;
  projectName: string
  originalTasks: ITask[] = [];
  taskList: ITask[] = [];


  constructor(private bsModalService: BsModalService, private taskService: TaskService) { }

  bsModalRef: BsModalRef
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-lg'
  };

  ngOnInit() {
  }

  selectProject() {
    this.bsModalRef = this.bsModalService.show(ProjectListModalComponent, this.config);
    this.bsModalRef.content.event.subscribe((result: any) => {
      this.projectName = result.projectName;
      this.projectId = result.projectId;

      this.getProjectTasksById();
    });
  }

  private getProjectTasksById() {
    this.taskService.getTasksByProjectId(this.projectId)
      .subscribe(response => {
        this.originalTasks = response;
        this.taskList = response;
      });
  }

  editTask(taskId: number) {

    this.taskService.settempTaskId(taskId);
    this.bsModalRef = this.bsModalService.show(EditTaskComponent, this.config);
    this.taskService.settempTaskId(-999);
    this.bsModalRef.content.event.subscribe(result => {
      this.getProjectTasksById();
    });
  }

  endTask(task :ITask) {
    this.bsModalRef = this.bsModalService.show(EndTaskComponent, this.config);
    this.bsModalRef.content.task= task;
    this.bsModalRef.content.taskName= task.taskName;

    this.bsModalRef.content.event.subscribe(result => {
      this.getProjectTasksById();
    });
  }

  deleteTask(taskId: number, taskName:string) {
    this.bsModalRef = this.bsModalService.show(DeleteTaskComponent, this.config);
    this.bsModalRef.content.taskName= taskName;
    this.bsModalRef.content.taskId= taskId;

    this.bsModalRef.content.event.subscribe(result => {
      this.getProjectTasksById();
    });
  }

}
