import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { ProjectListModalComponent } from '../project/modal-popup/project-list-modal.component';
import { ITask } from '../model/task.model';
import { TaskService } from '../shared/task.service';
import { EndTaskComponent } from './modal-popup/end-task.component';
import { DeleteTaskComponent } from './modal-popup/delete-task.component';
import { Router } from '@angular/router';

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


  constructor(private bsModalService: BsModalService, private taskService: TaskService, private router :Router) { }

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
    this.router.navigate(['task/edit', taskId]);
  }

  endTask(task :ITask) {
    this.bsModalRef = this.bsModalService.show(EndTaskComponent, this.config);
    this.bsModalRef.content.task= task;
    this.bsModalRef.content.taskName= task.taskName;

    this.bsModalRef.content.event.subscribe(() => {
      this.getProjectTasksById();
    });
  }

  deleteTask(taskId: number, taskName:string) {
    this.bsModalRef = this.bsModalService.show(DeleteTaskComponent, this.config);
    this.bsModalRef.content.taskName= taskName;
    this.bsModalRef.content.taskId= taskId;

    this.bsModalRef.content.event.subscribe(() => {
      this.getProjectTasksById();
    });
  }

}
