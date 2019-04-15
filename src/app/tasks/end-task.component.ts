import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import { TaskService } from '../shared/task.service';
import { BsModalRef } from 'ngx-bootstrap';
import { ITask } from '../model/task.model';
import { TOASTR_TOKEN, Toastr } from '../common/toastr.service';

@Component({
  selector: 'app-end-task',
  templateUrl: './end-task.component.html',
  styleUrls: ['./end-task.component.css']
})
export class EndTaskComponent implements OnInit {

  task:ITask
  taskName: string
  event: EventEmitter<any> = new EventEmitter();

  constructor(private taskService: TaskService,  @Inject(TOASTR_TOKEN) private toastr: Toastr, private bsModalRef: BsModalRef) { }

  private getTaskName() {
    this.taskService.getTaskById(this.taskService.gettempTaskId())
      .subscribe(response => {
        this.task = null;
        this.task = response;
        this.taskName = response.taskName;
      }, (err) => { console.log('error Message from component' + err); });
  }

  ngOnInit() {
    this.getTaskName();
  }

  endTask() {
    this.task.status = 2;

    this.taskService.editTask(this.task.taskId, this.task)
    .subscribe(res => {
      this.event.emit('modalActionCompleted');
      this.bsModalRef.hide();
      this.toastr.info('This task is now Ended!');
    },
      (error => {
        console.error(error);
      })
    )
  }

  onClose() {
    this.event.emit('OK');
    this.bsModalRef.hide();
  }

}
