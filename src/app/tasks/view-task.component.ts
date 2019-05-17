import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { ProjectListModalComponent } from '../project/modal-popup/project-list-modal.component';
import { ITask } from '../model/task.model';
import { TaskService } from '../shared/task.service';

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

      this.taskService.getTasksByProjectId(this.projectId)
        .subscribe(response => {
          this.originalTasks = response;
          this.taskList = response;
        });
    });
  }

}
