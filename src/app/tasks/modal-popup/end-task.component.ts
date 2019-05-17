import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import { ITask } from 'src/app/model/task.model';
import { TaskService } from 'src/app/shared/task.service';
import { TOASTR_TOKEN, Toastr } from 'src/app/common/toastr.service';
import { BsModalRef } from 'ngx-bootstrap';


@Component({
  selector: 'app-end-task',
  templateUrl: './end-task.component.html',
  styleUrls: ['./end-task.component.css']
})
export class EndTaskComponent implements OnInit {

  public task: ITask
  event: EventEmitter<any> = new EventEmitter();
  public taskName :string

  constructor(private taskService: TaskService, @Inject(TOASTR_TOKEN) private toastr: Toastr, private bsModalRef: BsModalRef) { }

  ngOnInit() {
  }

  endTask() {

    this.task.status = 2;

    this.taskService.editTask(this.task.taskId, this.task)
      .subscribe(res => {
        this.toastr.success('Task is successfully updated!');
        this.event.emit('modalActionCompleted');
        this.bsModalRef.hide();
      },
        (error => {
          this.toastr.error("Some thing went wrong. Contact Administrator.")
          console.error(error);
        })
      )

  }

  onClose() {
    this.bsModalRef.hide();
  }

}
