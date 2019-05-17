import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import { ITask } from 'src/app/model/task.model';
import { TaskService } from 'src/app/shared/task.service';
import { TOASTR_TOKEN, Toastr } from 'src/app/common/toastr.service';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'app-delete-task',
  templateUrl: './delete-task.component.html',
  styleUrls: ['./delete-task.component.css']
})
export class DeleteTaskComponent implements OnInit {


  public taskName: string;
  event: EventEmitter<any> = new EventEmitter();
  public taskId: number;
  //task: ITask;

  constructor(private taskService: TaskService,
    @Inject(TOASTR_TOKEN) private toastr: Toastr,
    private bsModalRef: BsModalRef) { }


  ngOnInit() {
    
  }

  deleteTask() {

    this.taskService.deleteTask(this.taskId)
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
