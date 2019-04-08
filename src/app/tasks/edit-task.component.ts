import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ITask } from '../model/task.model';
import { TaskService } from '../shared/task.service';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.css']
})
export class EditTaskComponent implements OnInit {


  event: EventEmitter<any> = new EventEmitter;


  taskForm: FormGroup
  task: ITask
  parentTasks: []
  title: string;
  subHeading: string;
  editTaskId : number = -999;

  minDate :Date
  stDt : any

  constructor(private fb: FormBuilder,
    private taskService: TaskService,
    private bsModalRef: BsModalRef) { }

  validationMessages = {
    'taskDescription': {
      'required': 'Task is required',
      'minlength': 'Task should be more than 5 chars',
      'maxlength': 'Task should be less than 50 chars'
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
  };

  ngOnInit() {

    this.populateParentTaskDropdown();

    this.taskForm = this.fb.group({
      taskDescription: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
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
    this.getTaskbyId(this.editTaskId);

  }

  getTaskbyId(taskId: number): any {
    var task: ITask = this.taskService.getTaskById(taskId);
    
    this.taskForm.patchValue({
      taskId: task.taskId,
      taskDescription: task.taskDescription,
      parentTask: task.parentId,
      priority: task.priority,
      startDate: task.startDate,
      endDate: task.endDate
    });

  }

  //loop through form controls and formgroup. both derrive from abstract control
  logValidationErrors(group: FormGroup = this.taskForm) {

    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      this.formErrors[key] = '';

      if (key === 'startDate')
      {
          if(abstractControl.value !== '')
          {
            this.stDt = new Date (abstractControl.value).toLocaleDateString();
          }
      }

      if (key === 'endDate')
      {
        if(typeof this.stDt != 'undefined')
        {
          this.minDate = new Date(this.stDt);
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

  private populateParentTaskDropdown() {
    this.taskService.getParentTasks()
      .subscribe(response => {
        this.parentTasks = response;
      }, (err) => { console.log('error Message from component' + err); });
  }

  cancel() {
    this.bsModalRef.hide();
  }
  onSubmit(): void {
    this.mapDataToModel();
    this.task.taskId = this.editTaskId;
    this.taskService.editTask(this.task);
    this.event.emit('modalActionCompleted');
    this.bsModalRef.hide();
    

  }
  mapDataToModel() {
    this.task = {
      taskId: null,
      parentId: this.taskForm.value.parentTask === '' ? null : +this.taskForm.value.parentTask,
      taskDescription: this.taskForm.value.taskDescription,
      priority: this.taskForm.value.priority,
      startDate: this.taskForm.value.startDate,
      endDate: this.taskForm.value.endDate,
      isComplete: false
    };
  }
  onClose() {
    this.bsModalRef.hide();
  }

}
