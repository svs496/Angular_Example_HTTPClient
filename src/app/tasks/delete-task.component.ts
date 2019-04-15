import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import { TaskService } from '../shared/task.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ITask } from '../model/task.model';
import { TOASTR_TOKEN, Toastr } from '../common/toastr.service';

@Component({
  selector: 'app-delete-task',
  templateUrl: './delete-task.component.html',
  styleUrls: ['./delete-task.component.css']
})
export class DeleteTaskComponent implements OnInit {


  taskName: string
  event: EventEmitter<any> = new EventEmitter();
  task: ITask;

  constructor(private taskService: TaskService,
    @Inject(TOASTR_TOKEN) private toastr: Toastr,
    private bsModalRef: BsModalRef) { }

  private getTaskName() {
    this.taskService.getTaskById(this.taskService.gettempTaskId())
      .subscribe(response => {
        this.task = response;
        this.taskName = response.taskName;
      }, (err) => { console.log('error Message from component' + err); });
  }

  ngOnInit() {
    this.getTaskName();
  }

  deleteTask() {

    this.taskService.deleteTask(this.task.taskId)
      .subscribe(res => {
        this.toastr.success("Task is deleted.");
        this.event.emit('modalActionCompleted');
        this.bsModalRef.hide();
      },
        (error) => {
          if (error.status == '409') {
            this.toastr.error(error.error.customMessage);
          }
          else {
            this.toastr.error("Operation Failed. Contact Admin!")
          }
          this.event.emit('modalActionCompleted');
          this.bsModalRef.hide();
        });


  }

  onClose() {
    this.bsModalRef.hide();
  }


}
