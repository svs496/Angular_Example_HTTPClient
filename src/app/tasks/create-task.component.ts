import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ITask } from '../model/task.model';
import { TaskService } from '../shared/task.service';
import { TOASTR_TOKEN, Toastr } from '../common/toastr.service';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.css']
})
export class CreateTaskComponent implements OnInit {

  @Output() backFromAddTask = new EventEmitter()

  taskForm: FormGroup
  task: ITask;
  parentTasks: ITask[];
  title: string;
  subHeading: string;

  minDate: Date
  stDt: any

  constructor(
    private fb: FormBuilder,
    @Inject(TOASTR_TOKEN) private toastr: Toastr,
    private taskService: TaskService) { }

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
    },
    'dateGroup': {
      'dateMismatch': 'Task End Date cannot be before Task Start Date'
    }
  };

  formErrors = {
  };

  cancel() {
    this.backFromAddTask.emit();
  }

  ngOnInit() {

    this.populateParentTaskDropdown();

    this.taskForm = this.fb.group({
      taskName: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]],
      parentTask: '',
      priority: '1',
      dateGroup: this.fb.group(
        {
          startDate: ['', Validators.required],
          endDate: ['', Validators.required]
        }, { validator: compareDate }),
    });

    this.taskForm.valueChanges.subscribe((data) => {
      this.logValidationErrors(this.taskForm);
    });

    this.title = "Create Task"
    this.subHeading = "Add new task details :"


  } // end ngOnInit


  private populateParentTaskDropdown() {
    this.getParentTasks();
  }

  getParentTasks() {
    this.taskService.getParentTasks()
      .subscribe(response => {
        this.parentTasks = [];
        this.parentTasks = response;
      }, (err) => { console.log('error Message from component' + err); });
  }


  //loop through form controls and formgroup. both derrive from abstract control
  logValidationErrors(group: FormGroup = this.taskForm) {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      this.formErrors[key] = '';

      if (key === 'startDate') {

        if (abstractControl.value !== '') {
          this.stDt = new Date(abstractControl.value).toLocaleDateString();

        }
      }

      if (key === 'endDate') {
        if (typeof this.stDt != 'undefined') {
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

  onSubmit(): void {
    if (this.taskForm.valid) {

      var tasktoAdd = {
        parentTaskId: this.taskForm.value.parentTask === '' ? 0 : +this.taskForm.value.parentTask,
        taskName: this.taskForm.value.taskName,
        priority: this.taskForm.value.priority,
        startDate: this.taskForm.value.dateGroup.startDate,
        endDate: this.taskForm.value.dateGroup.endDate,
        status: 1
      };

      this.taskService.addTask(tasktoAdd)
        .subscribe(res => {
          this.backFromAddTask.emit();
          this.toastr.success('A new Task is added!');
        },
          (error => {
            this.toastr.error("Some thing went wrong. Contact Administrator.")
            console.error(error);
          })
        )
    }
  }

  // mapDataToModel() {
  //   this.task = {
  //     taskId: null,
  //     parentTaskId: this.taskForm.value.parentTask === '' ? 0 : +this.taskForm.value.parentTask,
  //     taskName: this.taskForm.value.taskName,
  //     priority: this.taskForm.value.priority,
  //     startDate: this.taskForm.value.dateGroup.startDate,
  //     endDate: this.taskForm.value.dateGroup.endDate,
  //     status: 1,
  //     parentTaskName: ''
  //   };
  // }

} //end of class


/*Cross field validation using custom validator */
function compareDate(group: AbstractControl): { [key: string]: any } | null {

  const startDateControl = group.get('startDate');
  const endDateControl = group.get('endDate');

  var startDate = new Date(startDateControl.value);
  var endDate = new Date(endDateControl.value);

  if (startDate.getTime() > endDate.getTime()) {
    return { 'dateMismatch': true }
  }
  //both dates should be selected
  if (startDate && endDate) {
    return null
  }


}