import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ITask } from '../model/task.model';
import { TaskService } from '../shared/task.service';
import { BsModalRef } from 'ngx-bootstrap';
import { Toastr, TOASTR_TOKEN } from '../common/toastr.service';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.css']
})
export class EditTaskComponent implements OnInit {


  event: EventEmitter<any> = new EventEmitter;


  taskForm: FormGroup
  task: ITask
  parentTasks: ITask[]
  title: string;
  subHeading: string;
  editTaskId: number = -999;

  minDate: Date
  stDt: Date



  constructor(private fb: FormBuilder,
    private taskService: TaskService,
    @Inject(TOASTR_TOKEN) private toastr: Toastr,
    private bsModalRef: BsModalRef) { }

  validationMessages = {
    'taskName': {
      'required': 'Task is required',
      'minlength': 'Task should be more than 10 chars',
      'maxlength': 'Task should be less than 100 chars'
    },
    'priority': {
      'required': 'Priority is required'
    },
    'startDate': {
      'required': 'Start Date is required'
    },
    'endDate': {
      'required': 'End Date is required'
    }
  };

  formErrors = {
    "taskName" : '',
    "priority" : '',
    "startDate" :'',
    "endDate" :'',
    "dateGroup" : ''
  };

  ngOnInit() {


    this.taskForm = this.fb.group({
      taskName: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]],
      parentTask: '',
      priority: '1',
      startDate: ['', Validators.required],
      endDate: ['', [Validators.required]]
    });

    this.taskForm.valueChanges.subscribe((data) => {
      this.logValidationErrors(this.taskForm);
    });


    this.editTaskId = +this.taskService.gettempTaskId();
    this.title = "Edit Task"
    this.subHeading = "Update task details :"
    this.getEditTaskDetailsById(this.editTaskId);
  }



  getEditTaskDetailsById(taskId: number): any {


    this.taskService.getParentTasks()
    .subscribe(response => {
      this.parentTasks = [];
      this.parentTasks = response;

      this.taskService.getTaskById(taskId)
      .subscribe(response => {
        this.taskForm.patchValue({
          taskId: response.taskId,
          taskName: response.taskName,
          parentTask: response.parentTaskId == 0 ? '' : response.parentTaskId,
          priority: response.priority,
          startDate: response.startDate,
          endDate: response.endDate
        });

        //task cannot be it's own parent
        var index = this.parentTasks.findIndex (x => x.taskId === response.taskId);
        this.parentTasks.splice(index, 1);

      }, (err) => { console.log('error Message from component' + err); });

    }, (err) => { console.log('error Message from component' + err); });

  }

  //loop through form controls and formgroup. both derrive from abstract control
  logValidationErrors(group: FormGroup = this.taskForm) {

    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      this.formErrors[key] = '';

      if (key === 'startDate') {
        if (abstractControl.value !== '') {
          this.stDt = new Date(new Date(abstractControl.value).toLocaleDateString());
        }
      }

      if (key === 'endDate') {
        if (typeof this.stDt != 'undefined') {
          var temp = this.stDt;
          this.minDate = temp;
        }
      }

      if (abstractControl && !abstractControl.valid &&
        (abstractControl.touched || abstractControl.dirty || abstractControl.value !== '')) {
        const messages = this.validationMessages[key];
        for (const errorKey in abstractControl.errors) {
          if (errorKey) {
            this.formErrors[key] += messages[errorKey] + ' ';
          }
        }
      }

      if (abstractControl instanceof FormGroup) {

        this.logValidationErrors(abstractControl);
      }
    });
  }



  cancel() {
    this.bsModalRef.hide();
  }
  onSubmit(): void {

    if (this.taskForm.valid) {
      this.mapDataToModel()
      this.taskService.editTask(this.editTaskId, this.task)
        .subscribe(res => {
          this.event.emit('modalActionCompleted');
          this.bsModalRef.hide();
          this.toastr.success('Task is successfully updated!');
        },
          (error => {
            this.toastr.error("Some thing went wrong. Contact Administrator.")
            console.error(error);
          })
        )
    }
    
  }

  mapDataToModel() {
    this.task = {
      taskId: null,
      parentTaskId: this.taskForm.value.parentTask === '' ? 0 : +this.taskForm.value.parentTask,
      taskName: this.taskForm.value.taskName,
      priority: this.taskForm.value.priority,
      startDate: this.taskForm.value.startDate,
      endDate: this.taskForm.value.endDate,
      status: 1,
      parentTaskName: ''
    };

    this.task.taskId = this.editTaskId;
  }

  onClose() {
    this.bsModalRef.hide();
  }

}
